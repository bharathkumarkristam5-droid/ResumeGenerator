import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { APP_NAME } from '../app.constants';

@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#7c3aed" /><stop offset=".55" stop-color="#2f54eb" /><stop offset="1" stop-color="#06b6d4" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#lg)" />
      <rect x="9" y="7" width="14" height="18" rx="2.5" fill="#fff" />
      <rect x="12" y="11" width="8" height="1.8" rx=".9" fill="#2f54eb" />
      <rect x="12" y="15" width="8" height="1.4" rx=".7" fill="#c7d2fe" />
      <rect x="12" y="18" width="6" height="1.4" rx=".7" fill="#c7d2fe" />
      <path d="M24.5 4.5l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z" fill="#fff" />
    </svg>
    <span [class.light]="light()">{{ name }}</span>
  `,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 10px; }
    span { font: 800 19px/1 var(--font-display); letter-spacing: -.03em; color: var(--navy); }
    span.light { color: #fff; }
  `,
})
export class LogoComponent {
  readonly light = input(false);
  protected readonly name = APP_NAME;
}
