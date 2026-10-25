import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { IconComponent } from '../../shared/icon.component';
import { TemplateBase } from '../template-base';

@Component({
  selector: 'rs-aurora',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @let res = r();
    <div class="au">
      <aside class="au-side">
        @if (c().photo) {
          <img class="rs-photo au-photo" [src]="c().photo" alt="" />
        } @else {
          <div class="au-mono">{{ initials() }}</div>
        }
        @if (contactItems().length) {
          <h2 class="au-h">Contact</h2>
          <ul class="au-contact">
            @for (i of contactItems(); track i.icon) {
              <li><app-icon [name]="i.icon" [size]="13" /><span>{{ i.text }}</span></li>
            }
          </ul>
        }
        @if (res.skills.length) {
          <h2 class="au-h">Skills</h2>
          @for (s of res.skills; track s.id) {
            <div class="au-skill rs-avoid">
              <span>{{ s.name }}</span>
              <div class="au-bar"><i [style.width.%]="s.level * 20"></i></div>
            </div>
          }
        }
        @if (res.languages.length) {
          <h2 class="au-h">Languages</h2>
          @for (l of res.languages; track l.id) {
            <p class="au-lang"><strong>{{ l.name }}</strong><span>{{ l.level }}</span></p>
          }
        }
        @if (res.certifications.length) {
          <h2 class="au-h">Certifications</h2>
          @for (x of res.certifications; track x.id) {
            <p class="au-cert"><strong>{{ x.name }}</strong><span>{{ join(x.issuer, month(x.date)) }}</span></p>
          }
        }
        @if (res.interests.trim()) {
          <h2 class="au-h">Interests</h2>
          <p class="au-small">{{ res.interests }}</p>
        }
      </aside>
      <main class="au-main">
        <header class="au-head">
          <h1>{{ name() }}</h1>
          @if (title()) { <p class="au-title">{{ title() }}</p> }
        </header>
        @if (res.summary.trim()) {
          <section><h2 class="au-mh">Profile</h2><p class="rs-pre">{{ res.summary }}</p></section>
        }
        @if (res.experience.length) {
          <section>
            <h2 class="au-mh">Experience</h2>
            @for (e of res.experience; track e.id) {
              <div class="rs-entry">
                <div class="rs-entry-head"><h3>{{ e.title }}</h3><span class="rs-date">{{ range(e.startDate, e.endDate, e.current) }}</span></div>
                <div class="rs-sub">{{ join(e.employer, e.city) }}</div>
                <ul class="rs-bullets">@for (b of bullets(e.description); track $index) { <li>{{ b }}</li> }</ul>
              </div>
            }
          </section>
        }
        @if (res.education.length) {
          <section>
            <h2 class="au-mh">Education</h2>
            @for (e of res.education; track e.id) {
              <div class="rs-entry">
                <div class="rs-entry-head"><h3>{{ join(e.degree, e.field) || e.school }}</h3><span class="rs-date">{{ range(e.startDate, e.endDate, e.current) }}</span></div>
                <div class="rs-sub">{{ join(e.school, e.city) }}</div>
                @if (e.details) { <ul class="rs-bullets">@for (b of bullets(e.details); track $index) { <li>{{ b }}</li> }</ul> }
              </div>
            }
          </section>
        }
        @if (res.projects.length) {
          <section>
            <h2 class="au-mh">Projects</h2>
            @for (p of res.projects; track p.id) {
              <div class="rs-entry">
                <div class="rs-entry-head"><h3>{{ p.name }}</h3><span class="rs-date">{{ p.link }}</span></div>
                <ul class="rs-bullets">@for (b of bullets(p.description); track $index) { <li>{{ b }}</li> }</ul>
              </div>
            }
          </section>
        }
        @if (res.awards.trim()) {
          <section><h2 class="au-mh">Awards</h2><ul class="rs-bullets">@for (b of bullets(res.awards); track $index) { <li>{{ b }}</li> }</ul></section>
        }
      </main>
    </div>
  `,
  styles: `
    .au { display: grid; grid-template-columns: 33% 1fr; min-height: inherit; }
    .au-side { background: var(--rs-accent); color: #fff; padding: 40px 26px; }
    .au-photo, .au-mono { width: 120px; height: 120px; margin: 0 auto 26px; border: 4px solid rgb(255 255 255 / .25); }
    .au-mono { border-radius: 50%; display: grid; place-items: center; font-size: 2.6em; font-weight: 700; background: rgb(255 255 255 / .12); letter-spacing: .02em; }
    .au-h { font-size: .82em; letter-spacing: .16em; text-transform: uppercase; font-weight: 700; margin: 26px 0 12px !important;
      padding-bottom: 6px; border-bottom: 1px solid rgb(255 255 255 / .28); }
    .au-contact { list-style: none; }
    .au-contact li { display: flex; gap: 9px; align-items: flex-start; margin-bottom: 8px; font-size: .92em; word-break: break-word; }
    .au-contact app-icon { margin-top: 3px; opacity: .85; }
    .au-skill { margin-bottom: 9px; font-size: .93em; }
    .au-bar { height: 5px; border-radius: 3px; background: rgb(255 255 255 / .22); margin-top: 4px; overflow: hidden; }
    .au-bar i { display: block; height: 100%; background: #fff; border-radius: 3px; }
    .au-lang, .au-cert { display: flex; flex-direction: column; margin-bottom: 8px; font-size: .93em; }
    .au-lang span, .au-cert span, .au-small { opacity: .8; font-size: .92em; }
    .au-main { padding: 44px 38px 40px; }
    .au-head { margin-bottom: 22px; }
    .au-head h1 { font-size: 2.55em; font-weight: 800; color: #111827; line-height: 1.05; letter-spacing: -.01em; }
    .au-title { font-size: 1.18em; color: var(--rs-accent); font-weight: 600; margin-top: 6px !important; }
    .au-main section { margin-bottom: 20px; }
    .au-mh { font-size: .95em; letter-spacing: .14em; text-transform: uppercase; font-weight: 800; color: var(--rs-accent);
      display: flex; align-items: center; gap: 10px; margin-bottom: 10px !important; }
    .au-mh::after { content: ''; flex: 1; height: 1.5px; background: var(--rs-line); }
  `,
})
export class AuroraTemplate extends TemplateBase {}
