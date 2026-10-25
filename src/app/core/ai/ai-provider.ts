import { Experience, Resume } from '../models/resume.model';

export interface TailorResult {
  /** 0–100 keyword match between resume and job description. */
  score: number;
  matched: string[];
  missing: string[];
  tips: string[];
  summary?: string;
}

/** Contract implemented by both the built-in engine and the Claude-backed engine. */
export interface AiProvider {
  /** Returns up to three alternative professional summaries. */
  writeSummary(resume: Resume): Promise<string[]>;
  /** Rewrites the description of one role, one bullet per line. */
  enhanceBullets(resume: Resume, exp: Experience): Promise<string>;
  /** Suggests new bullet points for one role. */
  suggestBullets(resume: Resume, exp: Experience): Promise<string[]>;
  /** Suggests skills that are not on the resume yet. */
  suggestSkills(resume: Resume): Promise<string[]>;
  /** Compares the resume with a job description. */
  tailor(resume: Resume, jobDescription: string): Promise<TailorResult>;
}
