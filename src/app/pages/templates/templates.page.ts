import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SiteHeaderComponent } from '../../layout/site-header.component';
import { SiteFooterComponent } from '../../layout/site-footer.component';
import { IconComponent } from '../../shared/icon.component';
import { ResumePreviewComponent } from '../../resume-templates/resume-preview.component';
import { ACCENT_COLORS, TEMPLATES, TEMPLATE_CATEGORIES, TemplateCategory, TemplateMeta } from '../../core/data/templates';
import { sampleResume } from '../../core/data/sample-resume';
import { Resume } from '../../core/models/resume.model';
import { ResumeStore } from '../../core/services/resume-store.service';

@Component({
  selector: 'app-templates-page',
  imports: [SiteHeaderComponent, SiteFooterComponent, IconComponent, ResumePreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-site-header />
    <section class="top">
      <div class="container">
        <span class="eyebrow">Step 1 of 3</span>
        <h1>Choose a resume template</h1>
        <p>Every template is fully customizable and recruiter-tested. You can switch designs any time.</p>
        <div class="filters">
          <div class="chips" role="group" aria-label="Filter by style">
            <button class="chip" [class.active]="category() === 'All'" (click)="category.set('All')">All templates</button>
            @for (c of categories; track c) {
              <button class="chip" [class.active]="category() === c" (click)="category.set(c)">{{ c === 'ATS' ? 'ATS-friendly' : c }}</button>
            }
          </div>
          <div class="toggles">
            <button class="chip" [class.active]="photoOnly()" (click)="photoOnly.set(!photoOnly())"><app-icon name="camera" [size]="14" /> With photo</button>
            <button class="chip" [class.active]="columns() === 1" (click)="columns.set(columns() === 1 ? 0 : 1)">1 column</button>
            <button class="chip" [class.active]="columns() === 2" (click)="columns.set(columns() === 2 ? 0 : 2)">2 columns</button>
          </div>
        </div>
      </div>
    </section>

    <section class="container gallery">
      @for (t of filtered(); track t.meta.id) {
        <article class="tpl" [class.selected]="selected() === t.meta.id">
          <div class="thumb">
            @if (t.meta.popular) { <span class="tag">Popular</span> }
            <app-resume-preview [resume]="t.resume" [clip]="true" />
            <div class="overlay">
              <button class="btn btn-primary" (click)="use(t.meta)">Use this template</button>
            </div>
          </div>
          <div class="meta">
            <div class="name-row">
              <h3>{{ t.meta.name }}</h3>
              <div class="swatches" role="radiogroup" [attr.aria-label]="t.meta.name + ' color'">
                @for (col of swatches(t.meta); track col) {
                  <button class="sw" role="radio" [attr.aria-checked]="t.resume.theme.accent === col" [attr.aria-label]="col"
                    [style.background]="col" [class.on]="t.resume.theme.accent === col" (click)="setAccent(t.meta.id, col)"></button>
                }
              </div>
            </div>
            <p>{{ t.meta.description }}</p>
            <div class="tags">
              @for (c of t.meta.categories; track c) { <span class="badge">{{ c === 'ATS' ? 'ATS-friendly' : c }}</span> }
            </div>
          </div>
        </article>
      } @empty {
        <p class="empty">No templates match these filters.</p>
      }
    </section>
    <app-site-footer />
  `,
  styles: `
    .top { padding: 48px 0 28px; background: linear-gradient(180deg, #f3f6ff, var(--bg)); }
    h1 { font-size: clamp(30px, 4vw, 44px); color: var(--navy); margin: 12px 0 10px; }
    .top p { color: var(--text-muted); font-size: 17px; }
    .filters { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-top: 28px; }
    .chips, .toggles { display: flex; gap: 8px; flex-wrap: wrap; }
    .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 30px 26px; padding-top: 12px; padding-bottom: 40px; }
    .tpl { display: flex; flex-direction: column; }
    .thumb { position: relative; border-radius: 14px; overflow: hidden; background: #fff; border: 1px solid var(--border);
      box-shadow: var(--shadow-sm); transition: transform .2s, box-shadow .2s, border-color .2s; }
    .tpl:hover .thumb { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .tpl.selected .thumb { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-100), var(--shadow); }
    .tag { position: absolute; top: 12px; left: 12px; z-index: 2; background: var(--navy); color: #fff; font: 700 11px/1 var(--font);
      padding: 6px 9px; border-radius: 999px; letter-spacing: .04em; }
    .overlay { position: absolute; inset: 0; display: grid; place-items: center; background: rgb(11 23 54 / .0); opacity: 0; transition: all .2s; }
    .tpl:hover .overlay, .tpl:focus-within .overlay { opacity: 1; background: rgb(11 23 54 / .35); }
    .meta { padding: 14px 4px 0; }
    .name-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
    .meta h3 { font-size: 18px; }
    .meta p { color: var(--text-muted); font-size: 13.5px; margin: 6px 0 10px; line-height: 1.5; }
    .tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .swatches { display: flex; gap: 5px; }
    .sw { width: 18px; height: 18px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px var(--border-strong); cursor: pointer; padding: 0; }
    .sw.on { box-shadow: 0 0 0 2px var(--text); }
    .empty { grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 60px 0; }
    @media (hover: none) { .overlay { opacity: 1; background: transparent; align-items: end; padding-bottom: 14px; } }
  `,
})
export class TemplatesPage {
  /** Bound from the `?selected=` query parameter. */
  readonly selectedParam = input<string>('', { alias: 'selected' });

  private readonly store = inject(ResumeStore);
  private readonly router = inject(Router);

  protected readonly categories = TEMPLATE_CATEGORIES;
  protected readonly category = signal<TemplateCategory | 'All'>('All');
  protected readonly photoOnly = signal(false);
  protected readonly columns = signal<0 | 1 | 2>(0);
  private readonly accents = signal<Record<string, string>>({});

  protected readonly selected = computed(() => this.selectedParam());

  private readonly previews = computed(() => {
    const accents = this.accents();
    return TEMPLATES.map((meta) => {
      const resume: Resume = sampleResume(meta.id);
      resume.theme.accent = accents[meta.id] ?? meta.defaultAccent;
      return { meta, resume };
    });
  });

  protected readonly filtered = computed(() =>
    this.previews().filter(
      ({ meta }) =>
        (this.category() === 'All' || meta.categories.includes(this.category() as TemplateCategory)) &&
        (!this.photoOnly() || meta.photo) &&
        (!this.columns() || meta.columns === this.columns()),
    ),
  );

  protected swatches(meta: TemplateMeta): string[] {
    return [meta.defaultAccent, ...ACCENT_COLORS.filter((c) => c !== meta.defaultAccent)].slice(0, 5);
  }

  protected setAccent(id: string, color: string): void {
    this.accents.update((a) => ({ ...a, [id]: color }));
  }

  protected use(meta: TemplateMeta): void {
    const resume = this.store.create(meta.id);
    const accent = this.accents()[meta.id];
    if (accent) this.store.update(resume.id, (d) => (d.theme.accent = accent));
    this.router.navigate(['/builder', resume.id]);
  }
}
