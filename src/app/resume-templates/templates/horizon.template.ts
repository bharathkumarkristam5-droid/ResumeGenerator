import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { IconComponent } from '../../shared/icon.component';
import { TemplateBase } from '../template-base';

@Component({
  selector: 'rs-horizon',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @let res = r();
    <div class="ho">
      <header class="ho-head">
        <div class="ho-mono">{{ initials() }}</div>
        <div>
          <h1>{{ name() }}</h1>
          @if (title()) { <p class="ho-title">{{ title() }}</p> }
        </div>
      </header>
      <div class="ho-body">
        <main>
          @if (res.summary.trim()) {
            <section><h2 class="ho-h"><app-icon name="user" [size]="14" />Summary</h2><p class="rs-pre">{{ res.summary }}</p></section>
          }
          @if (res.experience.length) {
            <section>
              <h2 class="ho-h"><app-icon name="briefcase" [size]="14" />Experience</h2>
              @for (e of res.experience; track e.id) {
                <div class="rs-entry">
                  <div class="rs-entry-head"><h3>{{ e.title }}</h3>@if (range(e.startDate, e.endDate, e.current); as d) { <span class="ho-pill">{{ d }}</span> }</div>
                  <div class="rs-sub">{{ join(e.employer, e.city) }}</div>
                  <ul class="rs-bullets">@for (b of bullets(e.description); track $index) { <li>{{ b }}</li> }</ul>
                </div>
              }
            </section>
          }
          @if (res.education.length) {
            <section>
              <h2 class="ho-h"><app-icon name="education" [size]="14" />Education</h2>
              @for (e of res.education; track e.id) {
                <div class="rs-entry">
                  <div class="rs-entry-head"><h3>{{ join(e.degree, e.field) || e.school }}</h3>@if (range(e.startDate, e.endDate, e.current); as d) { <span class="ho-pill">{{ d }}</span> }</div>
                  <div class="rs-sub">{{ join(e.school, e.city) }}</div>
                  @if (e.details) { <p>{{ e.details }}</p> }
                </div>
              }
            </section>
          }
          @if (res.projects.length) {
            <section>
              <h2 class="ho-h"><app-icon name="folder" [size]="14" />Projects</h2>
              @for (p of res.projects; track p.id) {
                <div class="rs-entry">
                  <div class="rs-entry-head"><h3>{{ p.name }}</h3><span class="rs-date">{{ p.link }}</span></div>
                  <ul class="rs-bullets">@for (b of bullets(p.description); track $index) { <li>{{ b }}</li> }</ul>
                </div>
              }
            </section>
          }
        </main>
        <aside class="ho-side">
          @if (contactItems().length) {
            <section>
              <h2 class="ho-sh">Contact</h2>
              @for (i of contactItems(); track i.icon) { <p class="ho-ci"><app-icon [name]="i.icon" [size]="12" /><span>{{ i.text }}</span></p> }
            </section>
          }
          @if (res.skills.length) {
            <section>
              <h2 class="ho-sh">Skills</h2>
              <div class="ho-chips">@for (s of res.skills; track s.id) { <span>{{ s.name }}</span> }</div>
            </section>
          }
          @if (res.languages.length) {
            <section>
              <h2 class="ho-sh">Languages</h2>
              @for (l of res.languages; track l.id) { <p class="ho-kv"><span>{{ l.name }}</span><em>{{ l.level }}</em></p> }
            </section>
          }
          @if (res.certifications.length) {
            <section>
              <h2 class="ho-sh">Certifications</h2>
              @for (x of res.certifications; track x.id) { <div class="rs-avoid ho-cert"><strong>{{ x.name }}</strong><em>{{ join(x.issuer, month(x.date)) }}</em></div> }
            </section>
          }
          @if (res.awards.trim()) {
            <section><h2 class="ho-sh">Awards</h2>@for (b of bullets(res.awards); track $index) { <p class="ho-small">{{ b }}</p> }</section>
          }
          @if (res.interests.trim()) {
            <section><h2 class="ho-sh">Interests</h2><p class="ho-small">{{ res.interests }}</p></section>
          }
        </aside>
      </div>
    </div>
  `,
  styles: `
    .ho { padding: 40px 0 0; display: flex; flex-direction: column; min-height: inherit; }
    .ho-head { display: flex; align-items: center; gap: 22px; padding: 0 44px 26px; border-bottom: 1px solid var(--rs-line); }
    .ho-mono { width: 74px; height: 74px; flex: none; border-radius: 50%; display: grid; place-items: center; font-size: 1.7em; font-weight: 800;
      color: #fff; background: var(--rs-accent); box-shadow: 0 0 0 6px var(--rs-tint); }
    .ho-head h1 { font-size: 2.35em; font-weight: 800; color: #0f172a; letter-spacing: -.01em; }
    .ho-title { color: var(--rs-accent); font-weight: 600; font-size: 1.1em; margin-top: 2px !important; }
    .ho-body { display: grid; grid-template-columns: 1fr 30%; flex: 1; }
    .ho-body main { padding: 24px 30px 30px 44px; }
    .ho-side { background: var(--rs-tint); padding: 24px 26px 30px; }
    .ho section { margin-bottom: 18px; }
    .ho-h { display: flex; align-items: center; gap: 8px; font-size: 1.02em; font-weight: 800; color: #0f172a; margin-bottom: 10px !important; }
    .ho-h app-icon { color: #fff; background: var(--rs-accent); border-radius: 6px; padding: 4px; width: 22px !important; height: 22px !important; }
    .ho-pill { font-size: .82em; font-weight: 600; color: var(--rs-accent); background: var(--rs-tint); padding: 2px 9px; border-radius: 999px; white-space: nowrap; }
    .ho-sh { font-size: .8em; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--rs-accent); margin-bottom: 9px !important; }
    .ho-ci { display: flex; gap: 8px; align-items: flex-start; margin-bottom: 6px !important; font-size: .9em; word-break: break-word; }
    .ho-ci app-icon { margin-top: 3px; color: var(--rs-accent); }
    .ho-chips { display: flex; flex-wrap: wrap; gap: 5px; }
    .ho-chips span { background: #fff; border: 1px solid color-mix(in srgb, var(--rs-accent) 25%, white); padding: 2px 9px; border-radius: 999px; font-size: .88em; }
    .ho-kv { display: flex; justify-content: space-between; margin-bottom: 4px !important; font-size: .93em; }
    .ho-kv em, .ho-cert em { font-style: normal; color: var(--rs-muted); }
    .ho-cert { display: flex; flex-direction: column; margin-bottom: 8px; font-size: .92em; }
    .ho-small { font-size: .92em; margin-bottom: 4px !important; }
  `,
})
export class HorizonTemplate extends TemplateBase {}
