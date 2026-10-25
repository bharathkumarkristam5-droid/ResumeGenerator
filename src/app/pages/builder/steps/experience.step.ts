import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { BuilderContext } from '../builder-context.service';
import { Experience, dateRange, emptyExperience, toBullets } from '../../../core/models/resume.model';
import { AiService } from '../../../core/ai/ai.service';
import { IconComponent } from '../../../shared/icon.component';
import { MonthPickerComponent } from '../../../shared/month-picker.component';

@Component({
  selector: 'app-experience-step',
  imports: [IconComponent, MonthPickerComponent, CdkDropList, CdkDrag, CdkDragHandle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="step-head">
      <h2>Tell us about your work history</h2>
      <p>Start with your most recent job. Use bullet points that show impact — the AI assistant can help you write them.</p>
    </div>

    <div cdkDropList (cdkDropListDropped)="drop($event)">
      @for (e of list(); track e.id) {
        <div class="entry" cdkDrag [class.open]="open() === e.id">
          <div class="entry-top" (click)="toggle(e.id)">
            <span class="grip" cdkDragHandle (click)="$event.stopPropagation()" aria-label="Drag to reorder"><app-icon name="grip" [size]="18" /></span>
            <div class="t">
              <strong>{{ e.title || 'Untitled position' }}{{ e.employer ? ' · ' + e.employer : '' }}</strong>
              <span>{{ range(e) || 'Add dates' }}</span>
            </div>
            <button class="icon-btn danger" (click)="remove(e.id); $event.stopPropagation()" aria-label="Delete position"><app-icon name="trash" [size]="16" /></button>
            <app-icon class="chev" name="chevron-down" [size]="18" />
          </div>
          @if (open() === e.id) {
            <div class="entry-body">
              <div class="grid-2">
                <div class="field"><label>Job title</label><input class="input" placeholder="e.g. Software Engineer" [value]="e.title" (input)="patch(e.id, { title: $any($event.target).value })" /></div>
                <div class="field"><label>Employer</label><input class="input" placeholder="e.g. Acme Corp" [value]="e.employer" (input)="patch(e.id, { employer: $any($event.target).value })" /></div>
                <div class="field span-2"><label>Location</label><input class="input" placeholder="e.g. Bengaluru, India or Remote" [value]="e.city" (input)="patch(e.id, { city: $any($event.target).value })" /></div>
                <div class="field"><span class="label">Start date</span><app-month-picker label="Start" [value]="e.startDate" (valueChange)="patch(e.id, { startDate: $event })" /></div>
                <div class="field">
                  <span class="label">End date</span>
                  <app-month-picker label="End" [value]="e.endDate" [disabled]="e.current" (valueChange)="patch(e.id, { endDate: $event })" />
                  <label class="check"><input type="checkbox" [checked]="e.current" (change)="patch(e.id, { current: $any($event.target).checked })" /> I currently work here</label>
                </div>
                <div class="field span-2">
                  <label [for]="'desc-' + e.id">Responsibilities & achievements</label>
                  <div class="ai-bar">
                    <button class="btn btn-ai sm" (click)="enhance(e)" [disabled]="!e.description.trim() || !!ai.busy()">
                      <app-icon [name]="busyFor() === 'enhance-' + e.id ? 'loader' : 'wand'" [class.spin]="busyFor() === 'enhance-' + e.id" [size]="14" /> Enhance with AI
                    </button>
                    <button class="btn btn-ai-soft sm" (click)="suggest(e)" [disabled]="!!ai.busy()">
                      <app-icon [name]="busyFor() === 'suggest-' + e.id ? 'loader' : 'idea'" [class.spin]="busyFor() === 'suggest-' + e.id" [size]="14" /> Suggest bullet points
                    </button>
                    @if (undo()[e.id] !== undefined) {
                      <button class="btn btn-ghost sm" (click)="revert(e.id)">Undo</button>
                    }
                    <span class="meta">{{ count(e.description) }} bullets · one per line</span>
                  </div>
                  <textarea [id]="'desc-' + e.id" class="input" rows="7" placeholder="• Led a team of 5 to deliver...&#10;• Increased sales by 20%..."
                    [value]="e.description" (input)="patch(e.id, { description: $any($event.target).value })"></textarea>
                  @if (suggestFor() === e.id) {
                    <div class="suggest">
                      <div class="suggest-head"><app-icon name="sparkles" [size]="15" /> Expert-written examples for “{{ e.title || 'your role' }}” — click to add
                        <button class="icon-btn x" (click)="suggestFor.set(null)" aria-label="Close suggestions"><app-icon name="x" [size]="15" /></button></div>
                      <div class="suggest-list">
                        @for (s of suggestions(); track s) {
                          <button class="suggest-item" [class.used]="e.description.includes(s)" (click)="addBullet(e, s)"><app-icon name="plus" [size]="15" />{{ s }}</button>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
    <button class="add-btn" (click)="add()"><app-icon name="plus" [size]="18" /> Add {{ list().length ? 'another' : 'a' }} position</button>
  `,
})
export class ExperienceStep {
  private readonly ctx = inject(BuilderContext);
  protected readonly ai = inject(AiService);

  protected readonly list = computed(() => this.ctx.resume()!.experience);
  protected readonly open = signal<string | null>(this.list()[0]?.id ?? null);
  protected readonly suggestFor = signal<string | null>(null);
  protected readonly suggestions = signal<string[]>([]);
  protected readonly undo = signal<Record<string, string>>({});
  protected readonly busyFor = computed(() => this.ai.busy());

  protected range(e: Experience): string {
    return dateRange(e.startDate, e.endDate, e.current);
  }

  protected count(text: string): number {
    return toBullets(text).length;
  }

  protected toggle(id: string): void {
    this.open.set(this.open() === id ? null : id);
  }

  protected add(): void {
    const e = emptyExperience();
    this.ctx.update((d) => d.experience.push(e));
    this.open.set(e.id);
  }

  protected remove(id: string): void {
    this.ctx.update((d) => (d.experience = d.experience.filter((x) => x.id !== id)));
  }

  protected patch(id: string, patch: Partial<Experience>): void {
    this.ctx.update((d) => {
      const x = d.experience.find((e) => e.id === id);
      if (x) Object.assign(x, patch);
    });
  }

  protected drop(ev: CdkDragDrop<unknown>): void {
    this.ctx.update((d) => moveItemInArray(d.experience, ev.previousIndex, ev.currentIndex));
  }

  /** Latest copy from the store — the template's loop variable can lag behind the last keystroke. */
  private current(id: string): Experience | undefined {
    return this.ctx.resume()!.experience.find((x) => x.id === id);
  }

  protected async enhance(stale: Experience): Promise<void> {
    const e = this.current(stale.id);
    if (!e) return;
    const before = e.description;
    const result = await this.ctx.runAi(`enhance-${e.id}`, (p) => p.enhanceBullets(this.ctx.resume()!, e));
    if (result) {
      this.undo.update((u) => ({ ...u, [e.id]: before }));
      this.patch(e.id, { description: result });
    }
  }

  protected revert(id: string): void {
    const prev = this.undo()[id];
    if (prev === undefined) return;
    this.patch(id, { description: prev });
    this.undo.update(({ [id]: _, ...rest }) => rest);
  }

  protected async suggest(stale: Experience): Promise<void> {
    const e = this.current(stale.id);
    if (!e) return;
    const result = await this.ctx.runAi(`suggest-${e.id}`, (p) => p.suggestBullets(this.ctx.resume()!, e));
    if (result) {
      this.suggestions.set(result);
      this.suggestFor.set(e.id);
    }
  }

  protected addBullet(e: Experience, text: string): void {
    const current = this.current(e.id)?.description.trimEnd() ?? '';
    if (current.includes(text)) return;
    this.patch(e.id, { description: current ? `${current}\n${text}` : text });
  }
}
