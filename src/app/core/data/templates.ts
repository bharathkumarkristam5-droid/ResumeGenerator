import { ResumeTheme } from '../models/resume.model';

export type TemplateCategory = 'Modern' | 'Professional' | 'Creative' | 'Simple' | 'ATS';

export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  categories: TemplateCategory[];
  columns: 1 | 2;
  photo: boolean;
  defaultAccent: string;
  defaultFont: string;
  popular?: boolean;
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = ['Modern', 'Professional', 'Creative', 'Simple', 'ATS'];

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'aurora', name: 'Aurora', popular: true,
    description: 'Bold colored sidebar with photo, skill meters and a clean main column.',
    categories: ['Modern', 'Creative'], columns: 2, photo: true,
    defaultAccent: '#1e3a5f', defaultFont: 'Inter',
  },
  {
    id: 'summit', name: 'Summit', popular: true,
    description: 'Timeless single-column layout with accent rules. Passes every ATS.',
    categories: ['Professional', 'ATS', 'Simple'], columns: 1, photo: false,
    defaultAccent: '#0f766e', defaultFont: 'Lato',
  },
  {
    id: 'meridian', name: 'Meridian',
    description: 'Full-width header band with a two-column body for dense experience.',
    categories: ['Modern', 'Professional'], columns: 2, photo: true,
    defaultAccent: '#4338ca', defaultFont: 'Manrope',
  },
  {
    id: 'nordic', name: 'Nordic',
    description: 'Minimal Scandinavian layout with section labels in a left gutter.',
    categories: ['Simple', 'Modern'], columns: 1, photo: false,
    defaultAccent: '#334155', defaultFont: 'Inter',
  },
  {
    id: 'executive', name: 'Executive', popular: true,
    description: 'Elegant serif typography for leadership and senior roles.',
    categories: ['Professional'], columns: 1, photo: false,
    defaultAccent: '#7c2d12', defaultFont: 'Source Serif 4',
  },
  {
    id: 'catalyst', name: 'Catalyst',
    description: 'Creative timeline with an accent spine — stands out in design and marketing.',
    categories: ['Creative', 'Modern'], columns: 1, photo: true,
    defaultAccent: '#be185d', defaultFont: 'Manrope',
  },
  {
    id: 'atlas', name: 'Atlas',
    description: 'Plain, machine-readable structure optimised for applicant tracking systems.',
    categories: ['ATS', 'Simple'], columns: 1, photo: false,
    defaultAccent: '#111827', defaultFont: 'Roboto',
  },
  {
    id: 'horizon', name: 'Horizon',
    description: 'Monogram header, skill chips and a right-hand sidebar. Modern and friendly.',
    categories: ['Modern', 'Creative'], columns: 2, photo: false,
    defaultAccent: '#0369a1', defaultFont: 'Inter',
  },
];

export const ACCENT_COLORS = [
  '#1e3a5f', '#0f766e', '#4338ca', '#334155', '#7c2d12',
  '#be185d', '#111827', '#0369a1', '#15803d', '#b45309', '#6d28d9', '#b91c1c',
];

export interface FontOption {
  name: string;
  stack: string;
  kind: 'Sans' | 'Serif';
}

export const FONTS: FontOption[] = [
  { name: 'Inter', stack: "'Inter Variable', 'Inter', Arial, sans-serif", kind: 'Sans' },
  { name: 'Manrope', stack: "'Manrope Variable', 'Manrope', Arial, sans-serif", kind: 'Sans' },
  { name: 'Roboto', stack: "'Roboto Variable', 'Roboto', Arial, sans-serif", kind: 'Sans' },
  { name: 'Lato', stack: "'Lato', Arial, sans-serif", kind: 'Sans' },
  { name: 'Source Serif 4', stack: "'Source Serif 4 Variable', Georgia, serif", kind: 'Serif' },
  { name: 'Merriweather', stack: "'Merriweather', Georgia, serif", kind: 'Serif' },
  { name: 'Playfair Display', stack: "'Playfair Display Variable', Georgia, serif", kind: 'Serif' },
];

export function fontStack(name: string): string {
  return FONTS.find((f) => f.name === name)?.stack ?? FONTS[0].stack;
}

export function templateById(id: string): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

export function defaultTheme(templateId: string): ResumeTheme {
  const t = templateById(templateId);
  return { accent: t.defaultAccent, font: t.defaultFont, fontSize: 'md', pageSize: 'A4' };
}

/** Page dimensions in CSS pixels (96 dpi). */
export const PAGE_PX = {
  A4: { w: 794, h: 1123 },
  Letter: { w: 816, h: 1056 },
} as const;
