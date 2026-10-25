import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { BuilderContext } from '../builder-context.service';
import { Education, dateRange, emptyEducation } from '../../../core/models/resume.model';
import { IconComponent } from '../../../shared/icon.component';
import { MonthPickerComponent } from '../../../shared/month-picker.component';

@Component({
  selector: 'app-education-step',
  imports: [IconComponent, MonthPickerComponent, CdkDropList, CdkDrag, CdkDragHandle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="step-head">
      <h2>Tell us about your education</h2>
      <p>Add degrees, diplomas or relevant courses. Include honours or a strong GPA in the details.</p>
    </div>

    <div cdkDropList (cdkDropListDropped)="drop($event)">
      @for (e of list(); track e.id) {
        <div class="entry" cdkDrag [class.open]="open() === e.id">
          <div class="entry-top" (click)="open.set(open() === e.id ? null : e.id)">
            <span class="grip" cdkDragHandle (click)="$event.stopPropagation()" aria-label="Drag to reorder"><app-icon name="grip" [size]="18" /></span>
            <div class="t">
              <strong>{{ heading(e) }}</strong>
              <span>{{ e.school }}{{ e.school && range(e) ? ' · ' : '' }}{{ range(e) }}</span>
            </div>
            <button class="icon-btn danger" (click)="remove(e.id); $event.stopPropagation()" aria-label="Delete education"><app-icon name="trash" [size]="16" /></button>
            <app-icon class="chev" name="chevron-down" [size]="18" />
          </div>
          @if (open() === e.id) {
            <div class="entry-body">
              <div class="grid-2">
                <div class="field span-2"><label>School / university</label><input class="input" placeholder="e.g. Osmania University" [value]="e.school" (input)="patch(e.id, { school: $any($event.target).value })" /></div>
                <div class="field">
                  <label>Degree</label>
                  <input class="input" list="degrees" placeholder="e.g. Bachelor of Technology" [value]="e.degree" (input)="patch(e.id, { degree: $any($event.target).value })" />
                </div>
                <div class="field"><label>Field of study</label><input class="input" placeholder="e.g. Computer Science" [value]="e.field" (input)="patch(e.id, { field: $any($event.target).value })" /></div>
                <div class="field span-2"><label>Location</label><input class="input" placeholder="e.g. Hyderabad, India" [value]="e.city" (input)="patch(e.id, { city: $any($event.target).value })" /></div>
                <div class="field"><span class="label">Start date</span><app-month-picker label="Start" [value]="e.startDate" (valueChange)="patch(e.id, { startDate: $event })" /></div>
                <div class="field">
                  <span class="label">Graduation date (or expected)</span>
                  <app-month-picker label="End" [value]="e.endDate" [disabled]="e.current" (valueChange)="patch(e.id, { endDate: $event })" />
                  <label class="check"><input type="checkbox" [checked]="e.current" (change)="patch(e.id, { current: $any($event.target).checked })" /> Currently studying</label>
                </div>
                <div class="field span-2"><label>Details <span class="hint">(optional — honours, GPA, coursework)</span></label>
                  <textarea class="input" rows="3" placeholder="e.g. First class with distinction, GPA 8.9/10" [value]="e.details" (input)="patch(e.id, { details: $any($event.target).value })"></textarea></div>
              </div>
            </div>
          }
        </div>
      }
    </div>
    <datalist id="degrees">
      @for (d of degrees; track d) { <option [value]="d"></option> }
    </datalist>
    <button class="add-btn" (click)="add()"><app-icon name="plus" [size]="18" /> Add {{ list().length ? 'another' : '' }} education</button>
  `,
})
export class EducationStep {
  private readonly ctx = inject(BuilderContext);
  protected readonly list = computed(() => this.ctx.resume()!.education);
  protected readonly open = signal<string | null>(this.list()[0]?.id ?? null);
  protected readonly degrees = [
    'High School Diploma', 'Associate Degree', 'Bachelor of Arts', 'Bachelor of Science', 'Bachelor of Technology',
    'Bachelor of Engineering', 'Bachelor of Commerce', 'Master of Arts', 'Master of Science', 'Master of Technology',
    'Master of Business Administration', 'Master of Computer Applications', 'Doctor of Philosophy', 'Diploma', 'Certificate',
  ];

  protected heading(e: Education): string {
    return [e.degree, e.field].filter(Boolean).join(', ') || e.school || 'Untitled education';
  }

  protected range(e: Education): string {
    return dateRange(e.startDate, e.endDate, e.current);
  }

  protected add(): void {
    const e = emptyEducation();
    this.ctx.update((d) => d.education.push(e));
    this.open.set(e.id);
  }

  protected remove(id: string): void {
    this.ctx.update((d) => (d.education = d.education.filter((x) => x.id !== id)));
  }

  protected patch(id: string, patch: Partial<Education>): void {
    this.ctx.update((d) => {
      const x = d.education.find((e) => e.id === id);
      if (x) Object.assign(x, patch);
    });
  }

  protected drop(ev: CdkDragDrop<unknown>): void {
    this.ctx.update((d) => moveItemInArray(d.education, ev.previousIndex, ev.currentIndex));
  }
}
