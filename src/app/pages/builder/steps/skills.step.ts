import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { BuilderContext } from '../builder-context.service';
import { SKILL_LEVELS, uid } from '../../../core/models/resume.model';
import { AiService } from '../../../core/ai/ai.service';
import { IconComponent } from '../../../shared/icon.component';

@Component({
  selector: 'app-skills-step',
  imports: [IconComponent, CdkDropList, CdkDrag, CdkDragHandle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="step-head">
      <h2>What skills would you like to highlight?</h2>
      <p>Aim for 6–12 skills that match the jobs you want. Mix technical tools with soft skills.</p>
    </div>

    <div class="panel ai-panel">
      <h3><app-icon name="sparkles" [size]="17" /> Recommended for {{ ctx.resume()!.contact.title || 'you' }}</h3>
      <p class="sub">Based on your job title and work history. Click to add.</p>
      @if (suggestions().length) {
        <div class="chips">
          @for (s of suggestions(); track s) {
            <button class="chip" (click)="add(s)"><app-icon name="plus" [size]="13" />{{ s }}</button>
          }
        </div>
      }
      <button class="btn btn-ai-soft sm" (click)="load()" [disabled]="!!ai.busy()">
        <app-icon [name]="ai.busy() === 'skills' ? 'loader' : 'wand'" [class.spin]="ai.busy() === 'skills'" [size]="14" />
        {{ suggestions().length ? 'Refresh suggestions' : 'Get AI suggestions' }}
      </button>
    </div>

    <form class="add-row" (submit)="$event.preventDefault(); add(draft()); draft.set('')">
      <input class="input" placeholder="Type a skill and press Enter, e.g. Project Management" [value]="draft()" (input)="draft.set($any($event.target).value)" aria-label="New skill" />
      <button class="btn btn-primary" type="submit" [disabled]="!draft().trim()"><app-icon name="plus" [size]="16" /> Add</button>
    </form>

    <div cdkDropList class="skills" (cdkDropListDropped)="drop($event)">
      @for (s of list(); track s.id) {
        <div class="skill" cdkDrag>
          <span class="grip" cdkDragHandle aria-label="Drag to reorder"><app-icon name="grip" [size]="16" /></span>
          <input class="name" [value]="s.name" (input)="patch(s.id, 'name', $any($event.target).value)" aria-label="Skill name" />
          <div class="levels" role="radiogroup" aria-label="Skill level">
            @for (l of [1, 2, 3, 4, 5]; track l) {
              <button role="radio" [attr.aria-checked]="s.level === l" [class.on]="l <= s.level" [title]="levels[l - 1]" (click)="patch(s.id, 'level', l)"></button>
            }
          </div>
          <span class="lvl">{{ levels[s.level - 1] }}</span>
          <button class="icon-btn danger" (click)="remove(s.id)" aria-label="Remove skill"><app-icon name="x" [size]="15" /></button>
        </div>
      } @empty {
        <p class="empty">No skills yet — add your own or pick from the suggestions above.</p>
      }
    </div>
    <p class="hint">Skill levels appear as meters on templates such as Aurora and Meridian; other templates list the names only.</p>
  `,
  styles: `
    .ai-panel { border-color: #e9d5ff; background: linear-gradient(180deg, #faf5ff, #fff); }
    .ai-panel h3 app-icon { color: #7c3aed; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
    .add-row { display: flex; gap: 10px; margin-bottom: 16px; }
    .skills { display: flex; flex-direction: column; gap: 8px; }
    .skill { display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 6px; background: #fff; border: 1px solid var(--border); border-radius: 12px; }
    .skill.cdk-drag-preview { box-shadow: var(--shadow-lg); }
    .skill.cdk-drag-placeholder { opacity: .35; }
    .grip { cursor: grab; color: #94a3b8; display: inline-flex; }
    .name { flex: 1; min-width: 0; border: 0; font: 500 14.5px/1.3 var(--font); padding: 6px; border-radius: 6px; background: transparent; }
    .name:focus { outline: none; background: var(--surface-2); }
    .levels { display: flex; gap: 4px; }
    .levels button { width: 22px; height: 8px; border-radius: 4px; border: 0; background: var(--border); cursor: pointer; padding: 0; }
    .levels button.on { background: var(--primary); }
    .lvl { width: 82px; font-size: 12px; color: var(--text-muted); }
    .empty { color: var(--text-muted); text-align: center; padding: 24px; border: 1.5px dashed var(--border-strong); border-radius: 12px; }
    .hint { font-size: 12.5px; color: var(--text-muted); margin-top: 12px; }
    @media (max-width: 560px) { .lvl { display: none; } }
  `,
})
export class SkillsStep {
  protected readonly ctx = inject(BuilderContext);
  protected readonly ai = inject(AiService);
  protected readonly levels = SKILL_LEVELS;
  protected readonly list = computed(() => this.ctx.resume()!.skills);
  protected readonly draft = signal('');
  private readonly raw = signal<string[]>([]);
  protected readonly suggestions = computed(() => {
    const have = new Set(this.list().map((s) => s.name.toLowerCase()));
    return this.raw().filter((s) => !have.has(s.toLowerCase()));
  });

  constructor() {
    // Built-in suggestions are free and instant; paid Claude calls wait for an explicit click.
    if (this.ai.label() === 'Built-in AI') void this.load();
  }

  protected async load(): Promise<void> {
    const res = await this.ctx.runAi('skills', (p) => p.suggestSkills(this.ctx.resume()!));
    if (res) this.raw.set(res);
  }

  protected add(name: string): void {
    const n = name.trim();
    if (!n || this.list().some((s) => s.name.toLowerCase() === n.toLowerCase())) return;
    this.ctx.update((d) => d.skills.push({ id: uid(), name: n, level: 4 }));
  }

  protected patch(id: string, key: 'name' | 'level', value: string | number): void {
    this.ctx.update((d) => {
      const s = d.skills.find((x) => x.id === id);
      if (s) (s as unknown as Record<string, string | number>)[key] = value;
    });
  }

  protected remove(id: string): void {
    this.ctx.update((d) => (d.skills = d.skills.filter((s) => s.id !== id)));
  }

  protected drop(ev: CdkDragDrop<unknown>): void {
    this.ctx.update((d) => moveItemInArray(d.skills, ev.previousIndex, ev.currentIndex));
  }
}
