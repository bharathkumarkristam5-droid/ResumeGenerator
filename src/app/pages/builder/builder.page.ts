import {
  ChangeDetectionStrategy, Component, ElementRef, OnInit, computed, effect, inject, input, signal, viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BuilderContext, ExportKind, STEPS, StepId } from './builder-context.service';
import { HeadingStep } from './steps/heading.step';
import { ExperienceStep } from './steps/experience.step';
import { EducationStep } from './steps/education.step';
import { SkillsStep } from './steps/skills.step';
import { SummaryStep } from './steps/summary.step';
import { ExtrasStep } from './steps/extras.step';
import { FinalizeStep } from './steps/finalize.step';
import { ResumeStore } from '../../core/services/resume-store.service';
import { ExportService } from '../../core/services/export.service';
import { ToastService } from '../../core/services/toast.service';
import { AiService } from '../../core/ai/ai.service';
import { scoreResume } from '../../core/services/resume-score';
import { templateById } from '../../core/data/templates';
import { Resume } from '../../core/models/resume.model';
import { IconComponent } from '../../shared/icon.component';
import { LogoComponent } from '../../layout/logo.component';
import { ResumePreviewComponent } from '../../resume-templates/resume-preview.component';
import { ResumeRendererComponent } from '../../resume-templates/resume-renderer.component';

@Component({
  selector: 'app-builder-page',
  imports: [
    RouterLink, DatePipe, IconComponent, LogoComponent, ResumePreviewComponent, ResumeRendererComponent,
    HeadingStep, ExperienceStep, EducationStep, SkillsStep, SummaryStep, ExtrasStep, FinalizeStep,
  ],
  providers: [BuilderContext],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:click)': 'menuOpen.set(false)' },
  templateUrl: './builder.page.html',
  styleUrl: './builder.page.scss',
})
export class BuilderPage implements OnInit {
  /** Route parameter `:id`. */
  readonly id = input.required<string>();

  protected readonly ctx = inject(BuilderContext);
  protected readonly store = inject(ResumeStore);
  protected readonly ai = inject(AiService);
  private readonly exporter = inject(ExportService);
  private readonly toast = inject(ToastService);
  private readonly exportEl = viewChild<ElementRef<HTMLElement>>('exportEl');
  private readonly formCol = viewChild<ElementRef<HTMLElement>>('formCol');

  protected readonly steps = STEPS;
  protected readonly resume = this.ctx.resume;
  protected readonly stepIndex = computed(() => STEPS.findIndex((s) => s.id === this.ctx.step()));
  protected readonly score = computed(() => (this.resume() ? scoreResume(this.resume()!).score : 0));
  protected readonly templateName = computed(() => templateById(this.resume()?.templateId ?? '').name);
  protected readonly zoom = signal(1);
  protected readonly mobilePreview = signal(false);
  protected readonly menuOpen = signal(false);

  constructor() {
    effect(() => this.ctx.id.set(this.id()));
    this.ctx.exportHandler = (kind) => this.doExport(kind);
    // Scroll the form back to the top whenever the step changes.
    effect(() => {
      this.ctx.step();
      this.formCol()?.nativeElement.scrollTo({ top: 0 });
    });
  }

  ngOnInit(): void {
    // Set synchronously so the first render already has the resume (the effect handles later param changes).
    this.ctx.id.set(this.id());
  }

  protected done(step: StepId, r: Resume): boolean {
    switch (step) {
      case 'heading': return !!(r.contact.firstName && (r.contact.email || r.contact.phone));
      case 'experience': return r.experience.length > 0;
      case 'education': return r.education.length > 0;
      case 'skills': return r.skills.length > 0;
      case 'summary': return !!r.summary.trim();
      case 'extras': return r.projects.length + r.certifications.length + r.languages.length > 0 || !!r.awards.trim() || !!r.interests.trim();
      default: return false;
    }
  }

  protected go(delta: number): void {
    const next = STEPS[this.stepIndex() + delta];
    if (next) this.ctx.step.set(next.id);
  }

  protected rename(name: string): void {
    this.ctx.update((d) => (d.name = name.trim() || 'Untitled resume'));
  }

  protected setZoom(delta: number): void {
    this.zoom.set(Math.min(1.6, Math.max(0.6, Math.round((this.zoom() + delta) * 10) / 10)));
  }

  protected toggleMenu(ev: Event): void {
    ev.stopPropagation();
    this.menuOpen.set(!this.menuOpen());
  }

  private async doExport(kind: ExportKind): Promise<void> {
    const r = this.resume();
    const page = this.exportEl()?.nativeElement.querySelector<HTMLElement>('.rs-page');
    if (!r || !page) return;
    this.menuOpen.set(false);
    switch (kind) {
      case 'pdf':
        await this.exporter.pdf(page, r);
        this.toast.success('PDF downloaded.');
        break;
      case 'docx':
        await this.exporter.docx(r);
        this.toast.success('Word document downloaded.');
        break;
      case 'print':
        this.exporter.print(page, r);
        break;
      case 'json':
        this.exporter.json(r);
        this.toast.success('Backup downloaded. Import it from “My resumes”.');
        break;
    }
  }
}
