import { Resume, toBullets } from '../models/resume.model';

export interface ScoreCheck {
  label: string;
  done: boolean;
  points: number;
  step: string;
}

/** Heuristic completeness / quality score shown in the builder. */
export function scoreResume(r: Resume): { score: number; checks: ScoreCheck[] } {
  const c = r.contact;
  const bullets = r.experience.flatMap((e) => toBullets(e.description));
  const words = r.summary.trim().split(/\s+/).filter(Boolean).length;
  const checks: ScoreCheck[] = [
    { label: 'Add your name and job title', done: !!(c.firstName && c.lastName && c.title), points: 10, step: 'heading' },
    { label: 'Add an email and phone number', done: !!(c.email && c.phone), points: 10, step: 'heading' },
    { label: 'Add a LinkedIn profile or website', done: !!(c.linkedin || c.website), points: 5, step: 'heading' },
    { label: 'Add at least one work experience', done: r.experience.length > 0, points: 15, step: 'experience' },
    { label: 'Describe each role with 3+ bullet points', done: r.experience.length > 0 && r.experience.every((e) => toBullets(e.description).length >= 3), points: 15, step: 'experience' },
    { label: 'Quantify achievements with numbers', done: bullets.filter((b) => /\d/.test(b)).length >= 2, points: 10, step: 'experience' },
    { label: 'Add your education', done: r.education.length > 0, points: 10, step: 'education' },
    { label: 'List 5 or more skills', done: r.skills.length >= 5, points: 10, step: 'skills' },
    { label: 'Write a 40–90 word summary', done: words >= 40 && words <= 90, points: 10, step: 'summary' },
    { label: 'Add certifications, projects or languages', done: r.certifications.length + r.projects.length + r.languages.length > 0, points: 5, step: 'extras' },
  ];
  const score = checks.reduce((s, x) => s + (x.done ? x.points : 0), 0);
  return { score, checks };
}
