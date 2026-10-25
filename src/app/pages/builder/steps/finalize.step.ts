import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { BuilderContext, ExportKind, StepId } from '../builder-context.service';
import { ACCENT_COLORS, FONTS, TEMPLATES, defaultTheme, fontStack } from '../../../core/data/templates';
import { sampleResume } from '../../../core/data/sample-resume';
import { FontSize, PageSize, uid } from '../../../core/models/resume.model';
import { AiService } from '../../../core/ai/ai.service';
import { TailorResult } from '../../../core/ai/ai-provider';
import { scoreResume } from '../../../core/services/resume-score';
import { IconComponent } from '../../../shared/icon.component';
import { ResumePreviewComponent } from '../../../resume-templates/resume-preview.component';

@Component({
  selector: 'app-finalize-step',
  imports: [IconComponent, ResumePreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let res = r();
    <div class="step-head">
      <h2>Design, review & download</h2>
      <p>Fine-tune the look, check your resume against a job posting, then download it in the format you need.</p>
    </div>

    <!-- Downloads -->
    <div class="panel downloads">
      <h3><app-icon name="download" [size]="18" /> Download</h3>
      <p class="sub">All formats are free, with no watermark.</p>
      <div class="dl-grid">
        @for (d of downloads; track d.kind) {
          <button class="dl" (click)="ctx.export(d.kind)" [disabled]="!!ctx.exporting()">
            <span class="dl-icon" [class]="d.kind"><app-icon [name]="ctx.exporting() === d.kind ? 'loader' : d.icon" [class.spin]="ctx.exporting() === d.kind" [size]="20" /></span>
            <span class="dl-t"><strong>{{ d.title }}</strong><small>{{ d.text }}</small></span>
          </button>
        }
      </div>
    </div>

    <!-- Template -->
    <div class="panel">
      <h3><app-icon name="template" [size]="18" /> Template</h3>
      <p class="sub">Your content is kept when you switch.</p>
      <div class="tpl-grid">
        @for (t of thumbs; track t.id) {
          <button class="tpl" [class.on]="res.templateId === t.id" (click)="setTemplate(t.id)" [attr.aria-pressed]="res.templateId === t.id">
            <div class="tpl-thumb"><app-resume-preview [resume]="t.resume" [clip]="true" /></div>
            <span>{{ t.name }}</span>
          </button>
        }
      </div>
    </div>

    <!-- Style -->
    <div class="panel">
      <h3><app-icon name="palette" [size]="18" /> Style</h3>
      <p class="sub">Colors, typography and paper size.</p>
      <div class="style-grid">
        <div class="field">
          <span class="label">Accent color</span>
          <div class="colors">
            @for (c of colors; track c) {
              <button class="sw" [style.background]="c" [class.on]="res.theme.accent === c" (click)="theme('accent', c)" [attr.aria-label]="'Color ' + c"></button>
            }
            <label class="sw custom" title="Custom color">
              <input type="color" [value]="res.theme.accent" (input)="theme('accent', $any($event.target).value)" aria-label="Custom color" />
              <app-icon name="plus" [size]="14" />
            </label>
          </div>
        </div>
        <div class="field">
          <label for="font">Font</label>
          <select id="font" class="input" (change)="theme('font', $any($event.target).value)" [style.font-family]="stack(res.theme.font)">
            @for (f of fonts; track f.name) { <option [value]="f.name" [selected]="res.theme.font === f.name">{{ f.name }} ({{ f.kind }})</option> }
          </select>
        </div>
        <div class="field">
          <span class="label">Font size</span>
          <div class="seg">
            @for (s of sizes; track s.v) { <button [class.on]="res.theme.fontSize === s.v" (click)="theme('fontSize', s.v)">{{ s.l }}</button> }
          </div>
        </div>
        <div class="field">
          <span class="label">Paper size</span>
          <div class="seg">
            @for (p of pages; track p) { <button [class.on]="res.theme.pageSize === p" (click)="theme('pageSize', p)">{{ p }}</button> }
          </div>
        </div>
      </div>
    </div>

    <!-- Job match -->
    <div class="panel match">
      <h3><app-icon name="target" [size]="18" /> Job match <span class="badge">ATS check</span></h3>
      <p class="sub">Paste a job description to see how well your resume matches and which keywords to add.</p>
      <textarea class="input" rows="5" placeholder="Paste the job posting here..." [value]="jd()" (input)="jd.set($any($event.target).value)"></textarea>
      <div class="match-actions">
        <button class="btn btn-ai" (click)="analyze()" [disabled]="jd().trim().length < 40 || !!ai.busy()">
          <app-icon [name]="ai.busy() === 'tailor' ? 'loader' : 'sparkles'" [class.spin]="ai.busy() === 'tailor'" [size]="16" /> Analyze match
        </button>
        @if (jd().trim().length < 40 && jd().trim().length) { <span class="hint">Paste a bit more of the posting.</span> }
      </div>
      @if (result(); as m) {
        <div class="result">
          <div class="ring" [style.--p]="m.score" [class]="'ring ' + level(m.score)"><span>{{ m.score }}%</span><small>match</small></div>
          <div class="kw">
            @if (m.matched.length) {
              <strong>Found in your resume</strong>
              <div class="kw-list">@for (k of m.matched; track k) { <span class="kw-ok"><app-icon name="check" [size]="12" />{{ k }}</span> }</div>
            }
            @if (m.missing.length) {
              <strong>Missing keywords <small>— click to add as a skill (only if you have it)</small></strong>
              <div class="kw-list">@for (k of m.missing; track k) { <button class="kw-miss" (click)="addSkill(k)"><app-icon name="plus" [size]="12" />{{ k }}</button> }</div>
            }
          </div>
        </div>
        @if (m.tips.length) {
          <ul class="tips">@for (t of m.tips; track t) { <li><app-icon name="idea" [size]="15" />{{ t }}</li> }</ul>
        }
        @if (m.summary) {
          <div class="tailored">
            <strong><app-icon name="wand" [size]="15" /> Tailored summary</strong>
            <p>{{ m.summary }}</p>
            <button class="btn btn-primary sm" (click)="useSummary(m.summary)">Use this summary</button>
          </div>
        }
      }
    </div>

    <!-- Checklist -->
    <div class="panel">
      <h3><app-icon name="gauge" [size]="18" /> Resume strength: {{ score().score }}%</h3>
      <p class="sub">Complete these to make your resume stand out.</p>
      <ul class="checks">
        @for (c of score().checks; track c.label) {
          <li [class.done]="c.done">
            <app-icon [name]="c.done ? 'check-circle' : 'alert'" [size]="17" />
            <span>{{ c.label }}</span>
            @if (!c.done) { <button class="btn btn-ghost sm" (click)="go(c.step)">Fix</button> }
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .panel > h3 app-icon { color: var(--primary); }
    .dl-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .dl { display: flex; align-items: center; gap: 12px; text-align: left; padding: 12px; border-radius: 12px; border: 1px solid var(--border);
      background: #fff; cursor: pointer; transition: all .15s; font-family: var(--font); color: var(--text); }
    .dl:hover:not(:disabled) { border-color: var(--primary); box-shadow: var(--shadow); }
    .dl:disabled { opacity: .6; cursor: progress; }
    .dl-icon { width: 42px; height: 42px; border-radius: 10px; display: grid; place-items: center; color: #fff; flex: none; }
    .dl-icon.pdf { background: #dc2626; } .dl-icon.docx { background: #2563eb; } .dl-icon.print { background: #0f766e; } .dl-icon.json { background: #475569; }
    .dl-t { display: flex; flex-direction: column; }
    .dl-t strong { font-size: 14px; } .dl-t small { color: var(--text-muted); font-size: 12px; }
    .tpl-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .tpl { border: 0; background: none; padding: 0; cursor: pointer; text-align: center; font: 600 12.5px/1 var(--font); color: var(--text-2); }
    .tpl-thumb { border-radius: 8px; overflow: hidden; border: 2px solid var(--border); margin-bottom: 6px; transition: border-color .15s; }
    .tpl:hover .tpl-thumb { border-color: var(--border-strong); }
    .tpl.on .tpl-thumb { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-100); }
    .tpl.on { color: var(--primary); }
    .style-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .colors { display: flex; flex-wrap: wrap; gap: 8px; }
    .sw { width: 28px; height: 28px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 0 0 1px var(--border-strong); cursor: pointer; padding: 0; }
    .sw.on { box-shadow: 0 0 0 2px var(--text); }
    .sw.custom { display: grid; place-items: center; background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red); color: #fff; position: relative; overflow: hidden; }
    .sw.custom input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .match textarea { min-height: 110px; }
    .match-actions { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
    .hint { font-size: 12.5px; color: var(--text-muted); }
    .result { display: flex; gap: 20px; margin-top: 18px; align-items: flex-start; }
    .ring { --c: var(--success); width: 104px; height: 104px; flex: none; border-radius: 50%; display: grid; place-content: center; text-align: center;
      background: radial-gradient(closest-side, #fff 78%, transparent 80% 100%), conic-gradient(var(--c) calc(var(--p) * 1%), var(--border) 0); }
    .ring.low { --c: var(--danger); } .ring.mid { --c: var(--warning); }
    .ring span { font: 800 24px/1 var(--font-display); } .ring small { color: var(--text-muted); font-size: 12px; }
    .kw { flex: 1; display: flex; flex-direction: column; gap: 8px; }
    .kw strong { font-size: 13.5px; } .kw strong small { font-weight: 400; color: var(--text-muted); }
    .kw-list { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
    .kw-ok, .kw-miss { display: inline-flex; align-items: center; gap: 4px; padding: 4px 9px; border-radius: 999px; font: 500 12.5px/1.2 var(--font); }
    .kw-ok { background: #dcfce7; color: #166534; }
    .kw-miss { background: #fef3c7; color: #92400e; border: 0; cursor: pointer; }
    .kw-miss:hover { background: #fde68a; }
    .tips { list-style: none; padding: 0; margin: 16px 0 0; display: grid; gap: 8px; }
    .tips li { display: flex; gap: 8px; font-size: 13.5px; color: var(--text-2); }
    .tips app-icon { color: var(--warning); margin-top: 2px; }
    .tailored { margin-top: 16px; padding: 14px; border-radius: 12px; background: #f5f3ff; }
    .tailored strong { display: flex; gap: 6px; align-items: center; color: #6d28d9; font-size: 13.5px; }
    .tailored p { font-size: 14px; margin: 8px 0 12px; line-height: 1.6; }
    .checks { list-style: none; padding: 0; margin: 0; display: grid; gap: 4px; }
    .checks li { display: flex; align-items: center; gap: 10px; padding: 6px 4px; font-size: 14px; }
    .checks li app-icon { color: var(--warning); }
    .checks li.done { color: var(--text-muted); }
    .checks li.done app-icon { color: var(--success); }
    .checks li span { flex: 1; }
    @media (max-width: 640px) { .dl-grid, .style-grid { grid-template-columns: 1fr; } .tpl-grid { grid-template-columns: repeat(2, 1fr); } .result { flex-direction: column; } }
  `,
})
export class FinalizeStep {
  protected readonly ctx = inject(BuilderContext);
  protected readonly ai = inject(AiService);
  protected readonly r = computed(() => this.ctx.resume()!);
  protected readonly score = computed(() => scoreResume(this.r()));
  protected readonly jd = signal('');
  protected readonly result = signal<TailorResult | null>(null);

  protected readonly colors = ACCENT_COLORS;
  protected readonly fonts = FONTS;
  protected readonly sizes: { v: FontSize; l: string }[] = [{ v: 'sm', l: 'Small' }, { v: 'md', l: 'Medium' }, { v: 'lg', l: 'Large' }];
  protected readonly pages: PageSize[] = ['A4', 'Letter'];
  protected readonly thumbs = TEMPLATES.map((t) => ({ id: t.id, name: t.name, resume: sampleResume(t.id) }));
  protected readonly downloads: { kind: ExportKind; icon: string; title: string; text: string }[] = [
    { kind: 'pdf', icon: 'file-down', title: 'PDF', text: 'Pixel-perfect, ready to send' },
    { kind: 'docx', icon: 'file-type', title: 'Word (.docx)', text: 'Editable, ATS-friendly' },
    { kind: 'print', icon: 'printer', title: 'Print / Save as PDF', text: 'Selectable text PDF' },
    { kind: 'json', icon: 'json', title: 'Backup (.json)', text: 'Re-import later' },
  ];

  protected stack(name: string): string {
    return fontStack(name);
  }

  protected setTemplate(id: string): void {
    const t = defaultTheme(id);
    // Adopt the new template's typography, but keep the user's color if they changed it from the old default.
    this.ctx.update((d) => {
      const customColor = d.theme.accent !== defaultTheme(d.templateId).accent;
      d.templateId = id;
      d.theme.font = t.font;
      if (!customColor) d.theme.accent = t.accent;
    });
  }

  protected theme<K extends 'accent' | 'font' | 'fontSize' | 'pageSize'>(key: K, value: string): void {
    this.ctx.update((d) => ((d.theme as unknown as Record<string, string>)[key] = value));
  }

  protected level(s: number): string {
    return s < 50 ? 'low' : s < 75 ? 'mid' : 'high';
  }

  protected async analyze(): Promise<void> {
    const res = await this.ctx.runAi('tailor', (p) => p.tailor(this.r(), this.jd()));
    if (res) this.result.set(res);
  }

  protected addSkill(name: string): void {
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    if (this.r().skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    this.ctx.update((d) => d.skills.push({ id: uid(), name: label, level: 3 }));
    this.result.update((m) => (m ? { ...m, missing: m.missing.filter((k) => k !== name), matched: [...m.matched, name] } : m));
  }

  protected useSummary(text: string): void {
    this.ctx.update((d) => (d.summary = text));
  }

  protected go(step: string): void {
    this.ctx.step.set(step as StepId);
  }
}
