import { Injectable, computed, inject, signal } from '@angular/core';
import { Resume } from '../../core/models/resume.model';
import { ResumeStore } from '../../core/services/resume-store.service';
import { AiService, describeAiError } from '../../core/ai/ai.service';
import { AiProvider } from '../../core/ai/ai-provider';
import { ToastService } from '../../core/services/toast.service';

export type ExportKind = 'pdf' | 'docx' | 'print' | 'json';

export type StepId ='heading' | 'experience' | 'education' | 'skills' | 'summary' | 'extras' | 'finalize';

export interface StepDef {
  id: StepId;
  label: string;
  icon: string;
}

export const STEPS: StepDef[] = [
  { id: 'heading', label: 'Heading', icon: 'user' },
  { id: 'experience', label: 'Work history', icon: 'briefcase' },
  { id: 'education', label: 'Education', icon: 'education' },
  { id: 'skills', label: 'Skills', icon: 'wrench' },
  { id: 'summary', label: 'Summary', icon: 'text' },
  { id: 'extras', label: 'Additional', icon: 'award' },
  { id: 'finalize', label: 'Design & download', icon: 'palette' },
];

/** State shared by the builder page and its step components. Provided per builder instance. */
@Injectable()
export class BuilderContext {
  private readonly store = inject(ResumeStore);
  private readonly ai = inject(AiService);
  private readonly toast = inject(ToastService);

  readonly id = signal('');
  readonly step = signal<StepId>('heading');
  readonly resume = computed(() => this.store.get(this.id()));

  /** Set by the builder page, which owns the unscaled render used for export. */
  exportHandler: (kind: ExportKind) => Promise<void> = async () => {};
  readonly exporting = signal<ExportKind | null>(null);

  async export(kind: ExportKind): Promise<void> {
    if (this.exporting()) return;
    this.exporting.set(kind);
    try {
      await this.exportHandler(kind);
    } catch (e) {
      console.error(e);
      this.toast.error('Export failed. Please try again or use Print / Save as PDF.');
    } finally {
      this.exporting.set(null);
    }
  }

  update(mutate: (draft: Resume) => void): void {
    this.store.update(this.id(), mutate);
  }

  /** Runs an AI task with busy state and friendly error toasts. Resolves to `null` on failure. */
  async runAi<T>(task: string, fn: (p: AiProvider) => Promise<T>): Promise<T | null> {
    try {
      return await this.ai.run(task, fn);
    } catch (e) {
      this.toast.error(await describeAiError(e));
      return null;
    }
  }
}
