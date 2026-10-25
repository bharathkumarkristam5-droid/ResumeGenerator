import type Anthropic from '@anthropic-ai/sdk';
import { Experience, Resume, dateRange, toBullets } from '../models/resume.model';
import { AiProvider, TailorResult } from './ai-provider';
import { analyzeKeywords } from './offline-ai';

export const CLAUDE_MODEL = 'claude-opus-5-5';

const SYSTEM = `You are an expert resume writer and career coach.
Write concise, specific, achievement-oriented resume content in a confident professional voice.
Rules:
- Never invent employers, dates, credentials or numbers that are not in the provided resume. When a metric would help but is unknown, phrase the impact qualitatively instead.
- Start bullet points with strong past-tense action verbs (present tense only for a current role). No first-person pronouns, no trailing periods on bullets.
- Keep the candidate's facts, tone and language. Output only what the JSON schema asks for.`;

type JsonSchema = Record<string, unknown>;

function strArray(desc: string): JsonSchema {
  return { type: 'array', items: { type: 'string' }, description: desc };
}

function obj(properties: Record<string, JsonSchema>): JsonSchema {
  return { type: 'object', properties, required: Object.keys(properties), additionalProperties: false };
}

/** Compact plain-text rendering of the resume used as model context. */
function describe(r: Resume): string {
  const c = r.contact;
  const lines = [
    `Name: ${c.firstName} ${c.lastName}`.trim(),
    c.title && `Target title: ${c.title}`,
    r.summary && `Current summary: ${r.summary}`,
    r.skills.length && `Skills: ${r.skills.map((s) => s.name).join(', ')}`,
    ...r.experience.map(
      (e) =>
        `Role: ${e.title} at ${e.employer} (${dateRange(e.startDate, e.endDate, e.current)})\n` +
        toBullets(e.description).map((b) => `  - ${b}`).join('\n'),
    ),
    ...r.education.map((e) => `Education: ${e.degree} ${e.field}, ${e.school}`),
    r.certifications.length && `Certifications: ${r.certifications.map((x) => x.name).join(', ')}`,
  ];
  return lines.filter(Boolean).join('\n');
}

export class AiRefusalError extends Error {}

/** Claude-backed assistant. Calls the Anthropic API directly from the browser with the user's own key. */
export class ClaudeAi implements AiProvider {
  private clientPromise: Promise<Anthropic> | null = null;

  constructor(private readonly apiKey: string) {}

  private client(): Promise<Anthropic> {
    // Lazy-load the SDK so visitors using the built-in engine never download it.
    this.clientPromise ??= import('@anthropic-ai/sdk').then(
      ({ default: Sdk }) => new Sdk({ apiKey: this.apiKey, dangerouslyAllowBrowser: true }),
    );
    return this.clientPromise;
  }

  private async ask<T>(prompt: string, schema: JsonSchema): Promise<T> {
    const client = await this.client();
    const response = await client.beta.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM,
      output_config: { effort: 'medium', format: { type: 'json_schema', schema } },
      messages: [{ role: 'user', content: prompt }],
    });
    if (response.stop_reason === 'refusal') {
      throw new AiRefusalError('Claude declined this request. Try rephrasing your content.');
    }
    const text = response.content.find((b) => b.type === 'text');
    if (!text || text.type !== 'text') throw new Error('Claude returned an empty response.');
    return JSON.parse(text.text) as T;
  }

  /** Cheap round-trip used by the settings dialog to validate the key. */
  async ping(): Promise<void> {
    await this.ask<{ ok: boolean }>('Reply with ok = true.', obj({ ok: { type: 'boolean' } }));
  }

  async writeSummary(r: Resume): Promise<string[]> {
    const res = await this.ask<{ summaries: string[] }>(
      `Write three distinct professional summaries (2–4 sentences, 45–75 words each) for this resume. ` +
        `${r.summary ? 'The first should be a polished rewrite of the current summary; the others fresh alternatives.' : 'Vary the angle: impact, expertise, and leadership/collaboration.'}\n\n${describe(r)}`,
      obj({ summaries: strArray('Exactly three summaries') }),
    );
    return res.summaries.slice(0, 3);
  }

  async enhanceBullets(r: Resume, exp: Experience): Promise<string> {
    const res = await this.ask<{ bullets: string[] }>(
      `Rewrite the bullet points for the role "${exp.title}" at "${exp.employer}" (${exp.current ? 'current role' : 'past role'}) ` +
        `so they are concise, start with action verbs and emphasise impact. Keep the same facts and roughly the same number of bullets.\n\n` +
        `Bullets:\n${toBullets(exp.description).map((b) => `- ${b}`).join('\n')}\n\nResume context:\n${describe(r)}`,
      obj({ bullets: strArray('Rewritten bullet points without bullet glyphs') }),
    );
    return res.bullets.join('\n');
  }

  async suggestBullets(r: Resume, exp: Experience): Promise<string[]> {
    const res = await this.ask<{ bullets: string[] }>(
      `Suggest 6 new, realistic bullet points this candidate could adapt for the role "${exp.title}"` +
        `${exp.employer ? ` at "${exp.employer}"` : ''}. Do not repeat existing bullets. Use bracketed placeholders like [X%] where a number is needed.\n\nResume:\n${describe(r)}`,
      obj({ bullets: strArray('Six suggested bullet points') }),
    );
    return res.bullets;
  }

  async suggestSkills(r: Resume): Promise<string[]> {
    const res = await this.ask<{ skills: string[] }>(
      `Suggest 15 relevant hard and soft skills (1–3 words each) for this candidate that are not already listed.\n\n${describe(r)}`,
      obj({ skills: strArray('Skill names') }),
    );
    const have = new Set(r.skills.map((s) => s.name.toLowerCase()));
    return res.skills.filter((s) => !have.has(s.toLowerCase()));
  }

  async tailor(r: Resume, jd: string): Promise<TailorResult> {
    const base = analyzeKeywords(r, jd);
    const res = await this.ask<{ missing_keywords: string[]; tips: string[]; summary: string }>(
      `Compare this resume with the job description. Return: the most important keywords/requirements from the job that the resume lacks, ` +
        `4–6 specific, honest tips to tailor the resume, and a tailored professional summary using only facts from the resume.\n\n` +
        `JOB DESCRIPTION:\n${jd}\n\nRESUME:\n${describe(r)}`,
      obj({
        missing_keywords: strArray('Up to 12 missing keywords'),
        tips: strArray('Tailoring tips'),
        summary: { type: 'string', description: 'Tailored summary, 45–75 words' },
      }),
    );
    const missing = [...new Set([...res.missing_keywords, ...base.missing])].slice(0, 16);
    return { ...base, missing, tips: res.tips, summary: res.summary };
  }
}
