import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from './logo.component';
import { APP_NAME } from '../app.constants';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="ft">
      <div class="container grid">
        <div class="about">
          <app-logo [light]="true" />
          <p>A free, open-source resume builder. Your data stays in your browser — no sign-up, no tracking, no paywall at download.</p>
        </div>
        <div>
          <h4>Product</h4>
          <a routerLink="/templates">Resume templates</a>
          <a routerLink="/resumes">My resumes</a>
          <a routerLink="/" fragment="features">Features</a>
        </div>
        <div>
          <h4>Help</h4>
          <a routerLink="/" fragment="faq">FAQ</a>
          <a routerLink="/" fragment="how">How it works</a>
        </div>
        <div>
          <h4>Privacy</h4>
          <p class="small">Resumes are saved in your browser's local storage. Export a JSON backup to move them between devices.</p>
        </div>
      </div>
      <div class="container legal">
        <span>© {{ year }} {{ name }}. Built with open-source software (MIT / ISC / OFL licences).</span>
      </div>
    </footer>
  `,
  styles: `
    .ft { background: var(--navy); color: #cbd5e1; padding: 56px 0 24px; margin-top: 40px; }
    .grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.4fr; gap: 32px; }
    .about p { margin-top: 14px; font-size: 14px; max-width: 360px; line-height: 1.6; }
    h4 { color: #fff; font: 700 13px/1 var(--font); letter-spacing: .08em; text-transform: uppercase; margin-bottom: 14px; }
    a { display: block; color: #cbd5e1; font-size: 14px; margin-bottom: 9px; }
    a:hover { color: #fff; }
    .small { font-size: 13.5px; line-height: 1.6; }
    .legal { border-top: 1px solid rgb(255 255 255 / .1); margin-top: 36px; padding-top: 20px; font-size: 13px; color: #94a3b8; }
    @media (max-width: 760px) { .grid { grid-template-columns: 1fr 1fr; } .about { grid-column: 1 / -1; } }
  `,
})
export class SiteFooterComponent {
  protected readonly year = new Date().getFullYear();
  protected readonly name = APP_NAME;
}
