import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Month + year selector that emits `YYYY-MM` (works in every browser, unlike `<input type="month">`). */
@Component({
  selector: 'app-month-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <select class="input" [attr.aria-label]="label() + ' month'" [disabled]="disabled()" (change)="emit($any($event.target).value, year())">
      <option value="" [selected]="!month()">Month</option>
      @for (m of months; track m; let i = $index) {
        <option [value]="pad(i + 1)" [selected]="month() === pad(i + 1)">{{ m }}</option>
      }
    </select>
    <select class="input" [attr.aria-label]="label() + ' year'" [disabled]="disabled()" (change)="emit(month(), $any($event.target).value)">
      <option value="" [selected]="!year()">Year</option>
      @for (y of years; track y) {
        <option [value]="y" [selected]="year() === '' + y">{{ y }}</option>
      }
    </select>
  `,
  styles: `
    :host { display: grid; grid-template-columns: 1.3fr 1fr; gap: 8px; }
    select { padding-right: 6px; }
  `,
})
export class MonthPickerComponent {
  readonly value = input('');
  readonly label = input('Date');
  readonly disabled = input(false);
  readonly valueChange = output<string>();

  protected readonly months = MONTHS;
  protected readonly years = Array.from({ length: 61 }, (_, i) => new Date().getFullYear() + 5 - i);
  protected readonly year = computed(() => this.value().split('-')[0] ?? '');
  /** Month chosen before a year exists; kept locally until the value is complete. */
  private readonly pendingMonth = signal('');
  protected readonly month = computed(() => this.value().split('-')[1] ?? this.pendingMonth());

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  protected emit(month: string, year: string): void {
    // Year alone is allowed (month defaults to January); month without year waits for a year.
    this.pendingMonth.set(month);
    if (!year) this.valueChange.emit('');
    else this.valueChange.emit(`${year}-${month || '01'}`);
  }
}
