import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { IconComponent } from '../../shared/icon.component';
import { TemplateBase } from '../template-base';

@Component({
  selector: 'rs-meridian',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @let res = r();
    <div class="me">
      <header class="me-band">
        @if (c().photo) { <img class="rs-photo me-photo" [src]="c().photo" alt="" /> }
        <div>
          <h1>{{ name() }}</h1>
          @if (title()) { <p class="me-title">{{ title() }}</p> }
        </div>
      </header>
      @if (contactItems().length) {
        <div class="me-contact">
          @for (i of contactItems(); track i.icon) { <span><app-icon [name]="i.icon" [size]="12" />{{ i.text }}</span> }
        </div>
      }
      <div class="me-body">
        <main>
          @if (res.summary.trim()) {
            <section><h2 class="me-h">Professional Summary</h2><p class="rs-pre">{{ res.summary }}</p></section>
          }
          @if (res.experience.length) {
            <section>
              <h2 class="me-h">Work History</h2>
              @for (e of res.experience; track e.id) {
                <div class="rs-entry">
                  <div class="rs-entry-head"><h3>{{ e.title }}</h3><span class="rs-date">{{ range(e.startDate, e.endDate, e.current) }}</span></div>
                  <div class="rs-sub me-emp">{{ join(e.employer, e.city) }}</div>
                  <ul class="rs-bullets">@for (b of bullets(e.description); track $index) { <li>{{ b }}</li> }</ul>
                </div>
              }
            </section>
          }
          @if (res.projects.length) {
            <section>
              <h2 class="me-h">Projects</h2>
              @for (p of res.projects; track p.id) {
                <div class="rs-entry">
                  <div class="rs-entry-head"><h3>{{ p.name }}</h3><span class="rs-date">{{ p.link }}</span></div>
                  <ul class="rs-bullets">@for (b of bullets(p.description); track $index) { <li>{{ b }}</li> }</ul>
                </div>
              }
            </section>
          }
        </main>
        <aside>
          @if (res.skills.length) {
            <section>
              <h2 class="me-h">Skills</h2>
              @for (s of res.skills; track s.id) {
                <div class="me-skill rs-avoid"><span>{{ s.name }}</span>
                  <span class="me-dots">@for (d of [1,2,3,4,5]; track d) { <i [class.on]="d <= s.level"></i> }</span></div>
              }
            </section>
          }
          @if (res.education.length) {
            <section>
              <h2 class="me-h">Education</h2>
              @for (e of res.education; track e.id) {
                <div class="rs-entry rs-avoid">
                  <h3 class="me-small-h">{{ join(e.degree, e.field) || e.school }}</h3>
                  <div class="rs-sub">{{ e.school }}</div>
                  <div class="rs-date">{{ range(e.startDate, e.endDate, e.current) }}</div>
                  @if (e.details) { <p class="me-note">{{ e.details }}</p> }
                </div>
              }
            </section>
          }
          @if (res.certifications.length) {
            <section>
              <h2 class="me-h">Certifications</h2>
              @for (x of res.certifications; track x.id) {
                <div class="rs-entry rs-avoid"><h3 class="me-small-h">{{ x.name }}</h3><div class="rs-sub">{{ join(x.issuer, month(x.date)) }}</div></div>
              }
            </section>
          }
          @if (res.languages.length) {
            <section>
              <h2 class="me-h">Languages</h2>
              @for (l of res.languages; track l.id) { <p class="me-lang"><span>{{ l.name }}</span><em>{{ l.level }}</em></p> }
            </section>
          }
          @if (res.awards.trim()) {
            <section><h2 class="me-h">Awards</h2>@for (b of bullets(res.awards); track $index) { <p class="me-note">{{ b }}</p> }</section>
          }
          @if (res.interests.trim()) {
            <section><h2 class="me-h">Interests</h2><p class="me-note">{{ res.interests }}</p></section>
          }
        </aside>
      </div>
    </div>
  `,
  styles: `
    .me-band { background: var(--rs-accent); color: #fff; padding: 36px 44px 30px; display: flex; align-items: center; gap: 24px; }
    .me-photo { width: 96px; height: 96px; border: 3px solid rgb(255 255 255 / .4); flex: none; }
    .me-band h1 { font-size: 2.5em; font-weight: 800; letter-spacing: -.01em; }
    .me-title { font-size: 1.15em; opacity: .9; margin-top: 4px !important; font-weight: 500; }
    .me-contact { background: var(--rs-tint); padding: 10px 44px; display: flex; flex-wrap: wrap; gap: 6px 20px; font-size: .9em; color: #374151; }
    .me-contact span { display: inline-flex; align-items: center; gap: 6px; }
    .me-contact app-icon { color: var(--rs-accent); }
    .me-body { display: grid; grid-template-columns: 1fr 34%; gap: 30px; padding: 26px 44px 36px; }
    .me-body section { margin-bottom: 18px; }
    .me-h { font-size: .9em; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; color: var(--rs-accent); margin-bottom: 10px !important; }
    .me-emp { color: var(--rs-accent); }
    .me-skill { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 6px; }
    .me-dots { display: inline-flex; gap: 3px; flex: none; }
    .me-dots i { width: 8px; height: 8px; border-radius: 50%; background: var(--rs-line); }
    .me-dots i.on { background: var(--rs-accent); }
    .me-small-h { font-size: 1em; font-weight: 700; }
    .me-note { font-size: .92em; color: #4b5563; margin-top: 2px !important; }
    .me-lang { display: flex; justify-content: space-between; margin-bottom: 4px !important; }
    .me-lang em { color: var(--rs-muted); font-style: normal; font-size: .92em; }
  `,
})
export class MeridianTemplate extends TemplateBase {}
