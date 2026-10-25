import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TemplateBase } from '../template-base';

@Component({
  selector: 'rs-summit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @let res = r();
    <div class="su">
      <header class="su-head">
        <h1>{{ name() }}</h1>
        @if (title()) { <p class="su-title">{{ title() }}</p> }
        @if (contactItems().length) {
          <p class="su-contact">
            @for (i of contactItems(); track i.icon; let last = $last) { <span>{{ i.text }}</span>@if (!last) { <b>•</b> } }
          </p>
        }
      </header>
      @if (res.summary.trim()) {
        <section><h2 class="su-h">Summary</h2><p class="rs-pre">{{ res.summary }}</p></section>
      }
      @if (res.skills.length) {
        <section>
          <h2 class="su-h">Skills</h2>
          <ul class="su-skills">@for (s of res.skills; track s.id) { <li>{{ s.name }}</li> }</ul>
        </section>
      }
      @if (res.experience.length) {
        <section>
          <h2 class="su-h">Experience</h2>
          @for (e of res.experience; track e.id) {
            <div class="rs-entry">
              <div class="rs-entry-head"><h3>{{ e.title }}@if (e.employer) {<span class="su-at">, {{ e.employer }}</span>}</h3><span class="rs-date">{{ range(e.startDate, e.endDate, e.current) }}</span></div>
              @if (e.city) { <div class="rs-sub">{{ e.city }}</div> }
              <ul class="rs-bullets">@for (b of bullets(e.description); track $index) { <li>{{ b }}</li> }</ul>
            </div>
          }
        </section>
      }
      @if (res.education.length) {
        <section>
          <h2 class="su-h">Education</h2>
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
          <h2 class="su-h">Projects</h2>
          @for (p of res.projects; track p.id) {
            <div class="rs-entry">
              <div class="rs-entry-head"><h3>{{ p.name }}</h3><span class="rs-date">{{ p.link }}</span></div>
              <ul class="rs-bullets">@for (b of bullets(p.description); track $index) { <li>{{ b }}</li> }</ul>
            </div>
          }
        </section>
      }
      @if (res.certifications.length || res.languages.length) {
        <section class="su-two">
          @if (res.certifications.length) {
            <div>
              <h2 class="su-h">Certifications</h2>
              @for (x of res.certifications; track x.id) { <p class="su-line"><strong>{{ x.name }}</strong> — {{ join(x.issuer, month(x.date)) }}</p> }
            </div>
          }
          @if (res.languages.length) {
            <div>
              <h2 class="su-h">Languages</h2>
              @for (l of res.languages; track l.id) { <p class="su-line"><strong>{{ l.name }}</strong> — {{ l.level }}</p> }
            </div>
          }
        </section>
      }
      @if (res.awards.trim()) {
        <section><h2 class="su-h">Awards</h2><ul class="rs-bullets">@for (b of bullets(res.awards); track $index) { <li>{{ b }}</li> }</ul></section>
      }
      @if (res.interests.trim()) {
        <section><h2 class="su-h">Interests</h2><p>{{ res.interests }}</p></section>
      }
    </div>
  `,
  styles: `
    .su { padding: 46px 54px; }
    .su-head { text-align: center; padding-bottom: 16px; margin-bottom: 18px; border-bottom: 3px solid var(--rs-accent); }
    .su-head h1 { font-size: 2.4em; font-weight: 700; letter-spacing: .02em; color: #111827; }
    .su-title { font-size: 1.12em; color: var(--rs-accent); font-weight: 600; margin-top: 4px !important; letter-spacing: .04em; }
    .su-contact { margin-top: 8px !important; color: var(--rs-muted); font-size: .92em; display: flex; flex-wrap: wrap; justify-content: center; gap: 4px 8px; }
    .su-contact b { color: var(--rs-accent); font-weight: 400; }
    .su section { margin-bottom: 16px; }
    .su-h { font-size: .98em; font-weight: 700; text-transform: uppercase; letter-spacing: .12em; color: var(--rs-accent);
      border-bottom: 1px solid var(--rs-line); padding-bottom: 4px; margin-bottom: 9px !important; }
    .su-at { font-weight: 500; color: #374151; }
    .su-skills { list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px 18px; }
    .su-skills li { position: relative; padding-left: 1em; }
    .su-skills li::before { content: '▸'; position: absolute; left: 0; color: var(--rs-accent); }
    .su-two { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
    .su-line { margin-bottom: 4px !important; }
  `,
})
export class SummitTemplate extends TemplateBase {}
