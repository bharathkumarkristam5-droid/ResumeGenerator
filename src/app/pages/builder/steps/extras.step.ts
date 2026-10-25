import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { BuilderContext } from '../builder-context.service';
import {
  Certification, LANGUAGE_LEVELS, Language, Project, Resume, emptyCertification, emptyLanguage, emptyProject,
} from '../../../core/models/resume.model';
import { IconComponent } from '../../../shared/icon.component';
import { MonthPickerComponent } from '../../../shared/month-picker.component';

type ListKey = 'projects' | 'certifications' | 'languages';
type Section = ListKey | 'awards' | 'interests';

@Component({
  selector: 'app-extras-step',
  imports: [IconComponent, MonthPickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let res = r();
    <div class="step-head">
      <h2>Add sections that make you stand out</h2>
      <p>Optional, but valuable: projects, certifications, languages, awards and interests. Empty sections are hidden on your resume.</p>
    </div>

    <!-- Projects -->
    <div class="entry" [class.open]="open() === 'projects'">
      <div class="entry-top" (click)="toggle('projects')">
        <span class="sec-icon"><app-icon name="folder" [size]="18" /></span>
        <div class="t"><strong>Projects</strong><span>{{ res.projects.length || 'No' }} item{{ res.projects.length === 1 ? '' : 's' }}</span></div>
        <app-icon class="chev" name="chevron-down" [size]="18" />
      </div>
      @if (open() === 'projects') {
        <div class="entry-body">
          @for (p of res.projects; track p.id) {
            <div class="sub-item grid-2">
              <div class="field"><label>Project name</label><input class="input" [value]="p.name" placeholder="e.g. Inventory Tracker App" (input)="patch('projects', p.id, { name: $any($event.target).value })" /></div>
              <div class="field"><label>Link</label><input class="input" [value]="p.link" placeholder="github.com/you/project" (input)="patch('projects', p.id, { link: $any($event.target).value })" /></div>
              <div class="field span-2"><label>Description</label><textarea class="input" rows="3" [value]="p.description" placeholder="What it does, your role, tech used and results" (input)="patch('projects', p.id, { description: $any($event.target).value })"></textarea></div>
              <button class="btn btn-danger sm rm" (click)="remove('projects', p.id)"><app-icon name="trash" [size]="14" /> Remove</button>
            </div>
          }
          <button class="add-btn" (click)="add('projects')"><app-icon name="plus" [size]="16" /> Add project</button>
        </div>
      }
    </div>

    <!-- Certifications -->
    <div class="entry" [class.open]="open() === 'certifications'">
      <div class="entry-top" (click)="toggle('certifications')">
        <span class="sec-icon"><app-icon name="badge" [size]="18" /></span>
        <div class="t"><strong>Certifications & licences</strong><span>{{ res.certifications.length || 'No' }} item{{ res.certifications.length === 1 ? '' : 's' }}</span></div>
        <app-icon class="chev" name="chevron-down" [size]="18" />
      </div>
      @if (open() === 'certifications') {
        <div class="entry-body">
          @for (x of res.certifications; track x.id) {
            <div class="sub-item grid-2">
              <div class="field"><label>Certification</label><input class="input" [value]="x.name" placeholder="e.g. AWS Certified Developer" (input)="patch('certifications', x.id, { name: $any($event.target).value })" /></div>
              <div class="field"><label>Issuer</label><input class="input" [value]="x.issuer" placeholder="e.g. Amazon Web Services" (input)="patch('certifications', x.id, { issuer: $any($event.target).value })" /></div>
              <div class="field"><span class="label">Date earned</span><app-month-picker label="Earned" [value]="x.date" (valueChange)="patch('certifications', x.id, { date: $event })" /></div>
              <div class="field rm-cell"><button class="btn btn-danger sm" (click)="remove('certifications', x.id)"><app-icon name="trash" [size]="14" /> Remove</button></div>
            </div>
          }
          <button class="add-btn" (click)="add('certifications')"><app-icon name="plus" [size]="16" /> Add certification</button>
        </div>
      }
    </div>

    <!-- Languages -->
    <div class="entry" [class.open]="open() === 'languages'">
      <div class="entry-top" (click)="toggle('languages')">
        <span class="sec-icon"><app-icon name="languages" [size]="18" /></span>
        <div class="t"><strong>Languages</strong><span>{{ res.languages.length || 'No' }} item{{ res.languages.length === 1 ? '' : 's' }}</span></div>
        <app-icon class="chev" name="chevron-down" [size]="18" />
      </div>
      @if (open() === 'languages') {
        <div class="entry-body">
          @for (l of res.languages; track l.id) {
            <div class="lang-row">
              <input class="input" [value]="l.name" placeholder="e.g. Telugu" (input)="patch('languages', l.id, { name: $any($event.target).value })" aria-label="Language" />
              <select class="input" (change)="patch('languages', l.id, { level: $any($event.target).value })" aria-label="Proficiency">
                @for (lv of levels; track lv) { <option [value]="lv" [selected]="l.level === lv">{{ lv }}</option> }
              </select>
              <button class="icon-btn danger" (click)="remove('languages', l.id)" aria-label="Remove language"><app-icon name="trash" [size]="16" /></button>
            </div>
          }
          <button class="add-btn" (click)="add('languages')"><app-icon name="plus" [size]="16" /> Add language</button>
        </div>
      }
    </div>

    <!-- Awards -->
    <div class="entry" [class.open]="open() === 'awards'">
      <div class="entry-top" (click)="toggle('awards')">
        <span class="sec-icon"><app-icon name="award" [size]="18" /></span>
        <div class="t"><strong>Awards & achievements</strong><span>{{ res.awards.trim() ? 'Added' : 'Optional' }}</span></div>
        <app-icon class="chev" name="chevron-down" [size]="18" />
      </div>
      @if (open() === 'awards') {
        <div class="entry-body">
          <div class="field"><label>One award per line</label>
            <textarea class="input" rows="4" [value]="res.awards" placeholder="e.g. Employee of the Year, Acme Corp (2024)" (input)="setText('awards', $any($event.target).value)"></textarea></div>
        </div>
      }
    </div>

    <!-- Interests -->
    <div class="entry" [class.open]="open() === 'interests'">
      <div class="entry-top" (click)="toggle('interests')">
        <span class="sec-icon"><app-icon name="heart" [size]="18" /></span>
        <div class="t"><strong>Interests & hobbies</strong><span>{{ res.interests.trim() ? 'Added' : 'Optional' }}</span></div>
        <app-icon class="chev" name="chevron-down" [size]="18" />
      </div>
      @if (open() === 'interests') {
        <div class="entry-body">
          <div class="field"><label>Interests</label>
            <input class="input" [value]="res.interests" placeholder="e.g. Chess, marathon running, volunteering" (input)="setText('interests', $any($event.target).value)" /></div>
        </div>
      }
    </div>
  `,
  styles: `
    .sec-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--primary-50); color: var(--primary); display: grid; place-items: center; margin-left: 6px; }
    .sub-item { padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px dashed var(--border); position: relative; }
    .rm { justify-self: start; }
    .rm-cell { justify-content: flex-end; align-items: flex-start; }
    .lang-row { display: grid; grid-template-columns: 1fr 180px auto; gap: 10px; margin-bottom: 10px; align-items: center; }
    .add-btn { height: 44px; }
  `,
})
export class ExtrasStep {
  private readonly ctx = inject(BuilderContext);
  protected readonly r = computed(() => this.ctx.resume()!);
  protected readonly open = signal<Section | null>('projects');
  protected readonly levels = LANGUAGE_LEVELS;

  protected toggle(s: Section): void {
    this.open.set(this.open() === s ? null : s);
  }

  protected add(key: ListKey): void {
    const factory: Record<ListKey, () => Project | Certification | Language> = {
      projects: emptyProject, certifications: emptyCertification, languages: emptyLanguage,
    };
    this.ctx.update((d) => (d[key] as unknown[]).push(factory[key]()));
  }

  protected remove(key: ListKey, id: string): void {
    this.ctx.update((d) => {
      const list = d[key] as { id: string }[];
      const i = list.findIndex((x) => x.id === id);
      if (i >= 0) list.splice(i, 1);
    });
  }

  protected patch(key: ListKey, id: string, patch: Record<string, string>): void {
    this.ctx.update((d) => {
      const item = (d[key] as { id: string }[]).find((x) => x.id === id);
      if (item) Object.assign(item, patch);
    });
  }

  protected setText(key: keyof Pick<Resume, 'awards' | 'interests'>, value: string): void {
    this.ctx.update((d) => (d[key] = value));
  }
}
