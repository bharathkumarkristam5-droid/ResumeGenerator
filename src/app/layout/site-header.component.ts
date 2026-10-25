import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AiService } from '../core/ai/ai.service';
import { IconComponent } from '../shared/icon.component';
import { LogoComponent } from './logo.component';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, IconComponent, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="hdr">
      <div class="container bar">
        <a routerLink="/" class="brand" aria-label="Home"><app-logo /></a>
        <nav class="nav" [class.open]="menu()">
          <a routerLink="/templates" routerLinkActive="active" (click)="menu.set(false)">Templates</a>
          <a routerLink="/resumes" routerLinkActive="active" (click)="menu.set(false)">My Resumes</a>
          <a routerLink="/" fragment="features" (click)="menu.set(false)">Features</a>
          <a routerLink="/" fragment="faq" (click)="menu.set(false)">FAQ</a>
        </nav>
        <div class="actions">
          <button class="ai-pill" (click)="ai.dialogOpen.set(true)" title="AI settings">
            <app-icon name="sparkles" [size]="15" /> {{ ai.label() }}
          </button>
          <a class="btn btn-primary sm cta" routerLink="/templates">Create resume</a>
          <button class="icon-btn menu-btn" (click)="menu.set(!menu())" aria-label="Menu"><app-icon name="menu" /></button>
        </div>
      </div>
    </header>
  `,
  styles: `
    .hdr { position: sticky; top: 0; z-index: 50; background: rgb(255 255 255 / .85); backdrop-filter: saturate(1.6) blur(12px);
      border-bottom: 1px solid var(--border); }
    .bar { height: var(--header-h); display: flex; align-items: center; gap: 28px; }
    .brand { display: flex; color: inherit; }
    .nav { display: flex; gap: 4px; flex: 1; }
    .nav a { color: var(--text-2); font-weight: 500; font-size: 14.5px; padding: 8px 12px; border-radius: 8px; }
    .nav a:hover, .nav a.active { color: var(--primary); background: var(--primary-50); }
    .actions { display: flex; align-items: center; gap: 10px; }
    .ai-pill { display: inline-flex; align-items: center; gap: 6px; height: 34px; padding: 0 12px; border-radius: 999px; cursor: pointer;
      font: 600 13px/1 var(--font); color: #5b21b6; background: linear-gradient(#faf5ff, #faf5ff) padding-box, var(--ai-gradient) border-box;
      border: 1.5px solid transparent; }
    .menu-btn { display: none; }
    @media (max-width: 860px) {
      .nav { display: none; position: absolute; top: var(--header-h); left: 0; right: 0; flex-direction: column; background: #fff;
        padding: 12px 16px; border-bottom: 1px solid var(--border); box-shadow: var(--shadow); }
      .nav.open { display: flex; }
      .menu-btn { display: inline-grid; }
      .bar { justify-content: space-between; }
    }
    @media (max-width: 520px) { .cta { display: none; } }
  `,
})
export class SiteHeaderComponent {
  protected readonly ai = inject(AiService);
  protected readonly menu = signal(false);
}
