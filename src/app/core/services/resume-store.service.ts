import { Injectable, computed, signal } from '@angular/core';
import { Resume, createResume, uid } from '../models/resume.model';
import { defaultTheme, templateById } from '../data/templates';
import { sampleResume } from '../data/sample-resume';

const STORAGE_KEY = 'rs.resumes.v1';

/** All resumes live in the visitor's browser (localStorage). Nothing is sent to a server. */
@Injectable({ providedIn: 'root' })
export class ResumeStore {
  readonly resumes = signal<Resume[]>(this.load());
  readonly sorted = computed(() => [...this.resumes()].sort((a, b) => b.updatedAt - a.updatedAt));
  readonly lastSaved = signal<number | null>(null);

  private saveTimer: ReturnType<typeof setTimeout> | undefined;

  get(id: string): Resume | undefined {
    return this.resumes().find((r) => r.id === id);
  }

  create(templateId: string, withSample = false): Resume {
    const tpl = templateById(templateId);
    const resume = withSample
      ? { ...sampleResume(tpl.id), id: uid(), name: 'Example resume', createdAt: Date.now(), updatedAt: Date.now() }
      : createResume(tpl.id, defaultTheme(tpl.id));
    this.resumes.update((list) => [resume, ...list]);
    this.persist();
    return resume;
  }

  update(id: string, mutate: (draft: Resume) => void): void {
    this.resumes.update((list) =>
      list.map((r) => {
        if (r.id !== id) return r;
        const draft = structuredClone(r);
        mutate(draft);
        draft.updatedAt = Date.now();
        return draft;
      }),
    );
    this.persist();
  }

  duplicate(id: string): Resume | undefined {
    const src = this.get(id);
    if (!src) return undefined;
    const copy: Resume = { ...structuredClone(src), id: uid(), name: `${src.name} (copy)`, createdAt: Date.now(), updatedAt: Date.now() };
    this.resumes.update((list) => [copy, ...list]);
    this.persist();
    return copy;
  }

  remove(id: string): void {
    this.resumes.update((list) => list.filter((r) => r.id !== id));
    this.persist();
  }

  /** Imports a resume previously exported as JSON. Throws on invalid files. */
  importJson(text: string): Resume {
    const data = JSON.parse(text) as Partial<Resume>;
    if (!data || typeof data !== 'object' || !data.contact || !Array.isArray(data.experience)) {
      throw new Error('This file is not a valid resume export.');
    }
    const base = createResume(data.templateId ?? 'aurora', data.theme ?? defaultTheme(data.templateId ?? 'aurora'));
    const resume: Resume = { ...base, ...data, contact: { ...base.contact, ...data.contact }, id: uid(), updatedAt: Date.now() } as Resume;
    this.resumes.update((list) => [resume, ...list]);
    this.persist();
    return resume;
  }

  private load(): Resume[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Resume[]) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.resumes()));
        this.lastSaved.set(Date.now());
      } catch {
        // Quota exceeded (usually a large photo) – data stays in memory for this session.
        this.lastSaved.set(null);
      }
    }, 400);
  }
}
