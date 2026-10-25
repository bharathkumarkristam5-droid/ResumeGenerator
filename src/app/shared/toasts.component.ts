import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../core/services/toast.service';
import { IconComponent } from './icon.component';

@Component({
  selector: 'app-toasts',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts" role="status" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class]="t.kind">
          <app-icon [name]="t.kind === 'error' ? 'alert' : t.kind === 'success' ? 'check-circle' : 'info'" [size]="18" />
          <span>{{ t.text }}</span>
          <button class="close" (click)="toast.dismiss(t.id)" aria-label="Dismiss"><app-icon name="x" [size]="14" /></button>
        </div>
      }
    </div>
  `,
  styles: `
    .toasts { position: fixed; bottom: 24px; right: 24px; z-index: 1000; display: flex; flex-direction: column; gap: 10px; max-width: min(420px, calc(100vw - 32px)); }
    .toast { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 12px; background: var(--surface);
      box-shadow: var(--shadow-lg); border: 1px solid var(--border); font-size: 14px; animation: slide .25s ease-out; }
    .toast.success app-icon { color: var(--success); }
    .toast.error app-icon { color: var(--danger); }
    .toast.info app-icon { color: var(--primary); }
    .toast span { flex: 1; line-height: 1.45; }
    .close { background: none; border: 0; color: var(--text-muted); cursor: pointer; padding: 2px; }
    @keyframes slide { from { transform: translateY(12px); opacity: 0; } }
  `,
})
export class ToastsComponent {
  protected readonly toast = inject(ToastService);
}
