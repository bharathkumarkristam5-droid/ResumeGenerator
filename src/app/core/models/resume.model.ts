export type PageSize = 'A4' | 'Letter';
export type FontSize = 'sm' | 'md' | 'lg';

export interface ResumeTheme {
  accent: string;
  font: string;
  fontSize: FontSize;
  pageSize: PageSize;
}

export interface Contact {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedin: string;
  website: string;
  photo: string;
}

export interface Experience {
  id: string;
  title: string;
  employer: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  details: string;
}

export interface Skill {
  id: string;
  name: string;
  /** 1 (beginner) – 5 (expert) */
  level: number;
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Resume {
  id: string;
  name: string;
  templateId: string;
  theme: ResumeTheme;
  contact: Contact;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  awards: string;
  interests: string;
  createdAt: number;
  updatedAt: number;
}

export const LANGUAGE_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];

export const SKILL_LEVELS = ['Beginner', 'Novice', 'Skillful', 'Experienced', 'Expert'];

export function uid(): string {
  return crypto.randomUUID().slice(0, 8);
}

export function emptyExperience(): Experience {
  return { id: uid(), title: '', employer: '', city: '', startDate: '', endDate: '', current: false, description: '' };
}

export function emptyEducation(): Education {
  return { id: uid(), school: '', degree: '', field: '', city: '', startDate: '', endDate: '', current: false, details: '' };
}

export function emptyProject(): Project {
  return { id: uid(), name: '', link: '', description: '' };
}

export function emptyCertification(): Certification {
  return { id: uid(), name: '', issuer: '', date: '' };
}

export function emptyLanguage(): Language {
  return { id: uid(), name: '', level: 'Fluent' };
}

export function createResume(templateId: string, theme: ResumeTheme): Resume {
  const now = Date.now();
  return {
    id: uid(),
    name: 'Untitled resume',
    templateId,
    theme,
    contact: {
      firstName: '', lastName: '', title: '', email: '', phone: '',
      city: '', country: '', linkedin: '', website: '', photo: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    awards: '',
    interests: '',
    createdAt: now,
    updatedAt: now,
  };
}

/** Splits a free-text description into bullet lines, stripping any typed bullet glyphs. */
export function toBullets(text: string): string[] {
  return (text || '')
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*([•\-*–·▪]|\d+[.)])\s*/, '').trim())
    .filter(Boolean);
}

export function fullName(c: Contact): string {
  return [c.firstName, c.lastName].filter(Boolean).join(' ');
}

export function initials(c: Contact): string {
  return ((c.firstName[0] ?? '') + (c.lastName[0] ?? '')).toUpperCase();
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Formats a `YYYY-MM` value as `Mon YYYY`. */
export function formatMonth(value: string): string {
  if (!value) return '';
  const [y, m] = value.split('-');
  const idx = Number(m) - 1;
  return idx >= 0 && idx < 12 ? `${MONTHS[idx]} ${y}` : y;
}

export function dateRange(start: string, end: string, current: boolean): string {
  const s = formatMonth(start);
  const e = current ? 'Present' : formatMonth(end);
  if (s && e) return `${s} – ${e}`;
  return s || e;
}

/** Total years of experience across all roles (overlaps not deduplicated – good enough for summaries). */
export function yearsOfExperience(r: Resume): number {
  let months = 0;
  const now = new Date();
  for (const x of r.experience) {
    if (!x.startDate) continue;
    const [sy, sm] = x.startDate.split('-').map(Number);
    let ey = now.getFullYear();
    let em = now.getMonth() + 1;
    if (!x.current && x.endDate) [ey, em] = x.endDate.split('-').map(Number);
    months += Math.max(0, (ey - sy) * 12 + (em - sm));
  }
  // Floor so a 5.6-year career reads "5+ years", never overstating experience.
  return Math.floor(months / 12);
}
