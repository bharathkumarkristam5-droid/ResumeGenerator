import { Experience, Resume, toBullets, yearsOfExperience } from '../models/resume.model';
import {
  FILLER_WORDS, GERUND_TO_PAST, HELP_VERBS, OWNERSHIP_OPENING, PRESENT_TO_PAST, ROLE_PACKS, STOP_WORDS, TERM_CASE,
  WEAK_PHRASES, findRolePack,
} from '../data/phrase-library';
import { AiProvider, TailorResult } from './ai-provider';

const pause = (ms = 450) => new Promise((r) => setTimeout(r, ms));

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function primaryTitle(r: Resume): string {
  return r.contact.title || r.experience[0]?.title || 'professional';
}

function resumeText(r: Resume): string {
  return [
    r.contact.title, r.summary, r.awards, r.interests,
    ...r.experience.flatMap((e) => [e.title, e.employer, e.description]),
    ...r.education.flatMap((e) => [e.degree, e.field, e.school, e.details]),
    ...r.skills.map((s) => s.name),
    ...r.projects.flatMap((p) => [p.name, p.description]),
    ...r.certifications.map((c) => c.name),
  ].join(' ').toLowerCase();
}

function fixTermCase(s: string): string {
  return s.replace(/(?<![\w.#/])([a-z][a-z0-9.#/]*(?: bi)?)(?![\w#/])/gi, (word) => TERM_CASE[word.toLowerCase()] ?? word);
}

export function polishBullet(line: string, pastTense: boolean): string {
  let s = line.trim().replace(/\.$/, '').replace(FILLER_WORDS, '').replace(/\s{2,}/g, ' ');
  const own = s.match(OWNERSHIP_OPENING);
  const help = s.match(/^(?:i\s+)?helped\s+(?:to\s+)?(\w+)\s*/i);
  if (own && GERUND_TO_PAST[own[1].toLowerCase()]) {
    // "responsible for building X" → "Built X"
    s = `${GERUND_TO_PAST[own[1].toLowerCase()]} ${s.slice(own[0].length)}`;
  } else if (help) {
    // "helped build X" stays a verb phrase; "helped junior developers" → "Supported junior developers"
    const rest = s.slice(help[0].length);
    s = HELP_VERBS.has(help[1].toLowerCase()) ? `Helped ${help[1].toLowerCase()} ${rest}` : `Supported ${help[1]} ${rest}`;
  } else {
    for (const [re, rep] of WEAK_PHRASES) {
      if (re.test(s)) {
        s = s.replace(re, rep);
        break;
      }
    }
  }
  s = fixTermCase(s.trim());
  if (pastTense) {
    const first = s.split(/\s+/)[0]?.toLowerCase().replace(/s$/, '');
    if (first && PRESENT_TO_PAST[first]) s = PRESENT_TO_PAST[first] + s.slice(s.indexOf(' ') >= 0 ? s.indexOf(' ') : s.length);
  }
  s = s.replace(/\.$/, '').trim();
  return capitalize(s);
}

/** Free, private, rule-based assistant that runs entirely in the browser. */
export class OfflineAi implements AiProvider {
  async writeSummary(r: Resume): Promise<string[]> {
    await pause();
    const title = primaryTitle(r);
    const pack = findRolePack(title);
    const years = yearsOfExperience(r);
    const exp = years > 0 ? `${years}+ years of experience` : 'a strong foundation';
    const skills = (r.skills.length ? r.skills.map((s) => s.name) : pack.skills).slice(0, 3);
    const recent = r.experience[0];
    const win = recent ? toBullets(recent.description)[0] : '';
    const t = title.toLowerCase();

    const out: string[] = [];
    if (r.summary.trim()) {
      const improved = r.summary
        .replace(FILLER_WORDS, '')
        .replace(/\b(I am|I'm|I have|I've)\s+/g, '')
        .replace(/\bmy\b/gi, 'the')
        .replace(/\s{2,}/g, ' ')
        .split(/(?<=[.!?])\s+/)
        .map((x) => capitalize(x.trim()))
        .join(' ');
      out.push(improved);
    }
    out.push(
      `${capitalize(t)} with ${exp} in ${pack.focus}. Skilled in ${listJoin(skills)}, with a track record of ` +
        `delivering measurable results${win ? ` — most recently: ${win.charAt(0).toLowerCase() + win.slice(1)}` : ''}. ` +
        `Brings ownership, clear communication and a commitment to continuous improvement.`,
    );
    out.push(
      `Results-driven ${t} offering ${exp} and deep expertise in ${listJoin(skills.slice(0, 2))}. ` +
        `Recognised for combining analytical thinking with collaboration to solve complex problems and exceed goals. ` +
        `Seeking to contribute to a forward-thinking team focused on ${pack.focus}.`,
    );
    out.push(
      `Detail-oriented ${t} passionate about ${pack.focus}. Combines ${exp} with hands-on strength in ` +
        `${listJoin(skills)} to deliver high-quality outcomes. Known for adaptability, reliability and building strong relationships with stakeholders.`,
    );
    return out.slice(0, 3);
  }

  async enhanceBullets(_r: Resume, exp: Experience): Promise<string> {
    await pause();
    const lines = toBullets(exp.description);
    if (!lines.length) return '';
    return lines.map((l) => polishBullet(l, !exp.current)).join('\n');
  }

  async suggestBullets(r: Resume, exp: Experience): Promise<string[]> {
    await pause(300);
    const pack = findRolePack(exp.title || r.contact.title);
    const have = exp.description.toLowerCase();
    return pack.bullets.filter((b) => !have.includes(b.toLowerCase().slice(0, 30)));
  }

  async suggestSkills(r: Resume): Promise<string[]> {
    await pause(300);
    const have = new Set(r.skills.map((s) => s.name.toLowerCase()));
    const titles = [r.contact.title, ...r.experience.map((e) => e.title)].filter(Boolean);
    const pool = new Set<string>();
    for (const t of titles.length ? titles : ['']) findRolePack(t).skills.forEach((s) => pool.add(s));
    return [...pool].filter((s) => !have.has(s.toLowerCase())).slice(0, 18);
  }

  async tailor(r: Resume, jd: string): Promise<TailorResult> {
    await pause();
    return analyzeKeywords(r, jd);
  }
}

/** Keyword extraction + matching. Shared with the Claude engine, which adds a tailored summary on top. */
export function analyzeKeywords(r: Resume, jd: string): TailorResult {
  const text = jd.toLowerCase();
  const known = new Set<string>();
  for (const pack of ROLE_PACKS) {
    for (const skill of pack.skills) {
      const core = skill.toLowerCase().replace(/\s*\(.*\)$/, '');
      if (core.length > 1 && new RegExp(`\\b${core.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\b`).test(text)) known.add(skill);
    }
  }
  const freq = new Map<string, number>();
  for (const w of text.match(/[a-z][a-z0-9+#.\-]{2,}/g) ?? []) {
    const word = w.replace(/[.\-]+$/, '');
    if (STOP_WORDS.has(word) || word.length < 3) continue;
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }
  const frequent = [...freq.entries()]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14)
    .map(([w]) => w);

  const keywords = [...known];
  for (const w of frequent) {
    if (!keywords.some((k) => k.toLowerCase().includes(w))) keywords.push(w);
  }
  const body = resumeText(r);
  const matched = keywords.filter((k) => body.includes(k.toLowerCase().replace(/\s*\(.*\)$/, '')));
  const missing = keywords.filter((k) => !matched.includes(k));
  const score = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0;

  const tips: string[] = [];
  if (!keywords.length) tips.push('Paste a longer job description to get a meaningful keyword analysis.');
  if (missing.length) tips.push(`Work the missing keywords into your skills or bullet points where they are genuinely true for you (e.g. ${missing.slice(0, 3).join(', ')}).`);
  if (!r.summary.trim()) tips.push('Add a professional summary that mirrors the job title and top requirements.');
  if (r.experience.some((e) => !/\d/.test(e.description))) tips.push('Quantify achievements with numbers (%, $, time saved) — recruiters scan for measurable impact.');
  if (score >= 75) tips.push('Strong match! Make sure your most relevant experience appears first.');
  return { score, matched, missing, tips };
}
