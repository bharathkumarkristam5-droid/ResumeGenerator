import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TemplateBase } from '../template-base';

@Component({
  selector: 'rs-nordic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @let res = r();
    <div class="no">
      <header class="no-head">
        <h1><span>{{ firstName() }}</span> {{ lastName() }}</h1>
        @if (title()) { <p class="no-title">{{ title() }}</p> }
        <div class="no-contact">@for (i of contactItems(); track i.icon) { <span>{{ i.text }}</span> }</div>
      </header>
      @if (res.summary.trim()) {
        <section class="no-row"><h2>Profile</h2><div><p class="rs-pre">{{ res.summary }}</p></div></section>
      }
      @if (res.experience.length) {
        <section class="no-row">
          <h2>Experience</h2>
          <div>
            @for (e of res.experience; track e.id) {
              <div class="rs-entry">
                <div class="rs-entry-head"><h3>{{ e.title }}</h3><span class="rs-date">{{ range(e.startDate, e.endDate, e.current) }}</span></div>
                <div class="rs-sub">{{ join(e.employer, e.city) }}</div>
                <ul class="rs-bullets">@for (b of bullets(e.description); track $index) { <li>{{ b }}</li> }</ul>
              </div>
            }
          </div>
        </section>
      }
      @if (res.education.length) {
        <section class="no-row">
          <h2>Education</h2>
          <div>
            @for (e of res.education; track e.id) {
              <div class="rs-entry">
                <div class="rs-entry-head"><h3>{{ join(e.degree, e.field) || e.school }}</h3><span class="rs-date">{{ range(e.startDate, e.endDate, e.current) }}</span></div>
                <div class="rs-sub">{{ join(e.school, e.city) }}</div>
                @if (e.details) { <p class="no-note">{{ e.details }}</p> }
              </div>
            }
          </div>
        </section>
      }
      @if (res.skills.length) {
        <section class="no-row">
          <h2>Skills</h2>
          <div class="no-skills">@for (s of res.skills; track s.id) { <span>{{ s.name }}</span> }</div>
        </section>
      }
      @if (res.projects.length) {
        <section class="no-row">
          <h2>Projects</h2>
          <div>
            @for (p of res.projects; track p.id) {
              <div class="rs-entry">
                <div class="rs-entry-head"><h3>{{ p.name }}</h3><span class="rs-date">{{ p.link }}</span></div>
                <ul class="rs-bullets">@for (b of bullets(p.description); track $index) { <li>{{ b }}</li> }</ul>
              </div>
            }
          </div>
        </section>
      }
      @if (res.certifications.length) {
        <section class="no-row">
          <h2>Certifications</h2>
          <div>@for (x of res.certifications; track x.id) { <p class="no-line"><strong>{{ x.name }}</strong><span>{{ join(x.issuer, month(x.date)) }}</span></p> }</div>
        </section>
      }
      @if (res.languages.length) {
        <section class="no-row">
          <h2>Languages</h2>
          <div>@for (l of res.languages; track l.id) { <p class="no-line"><strong>{{ l.name }}</strong><span>{{ l.level }}</span></p> }</div>
        </section>
      }
      @if (res.awards.trim()) {
        <section class="no-row"><h2>Awards</h2><div><ul class="rs-bullets">@for (b of bullets(res.awards); track $index) { <li>{{ b }}</li> }</ul></div></section>
      }
      @if (res.interests.trim()) {
        <section class="no-row"><h2>Interests</h2><div><p>{{ res.interests }}</p></div></section>
      }
    </div>
  `,
  styles: `
    .no { padding: 56px 58px; }
    .no-head { margin-bottom: 30px; }
    .no-head h1 { font-size: 2.7em; font-weight: 300; color: #111827; letter-spacing: -.01em; }
    .no-head h1 span { font-weight: 700; }
    .no-title { font-size: 1.1em; color: var(--rs-accent); margin-top: 4px !important; letter-spacing: .05em; }
    .no-contact { display: flex; flex-wrap: wrap; gap: 4px 22px; color: var(--rs-muted); font-size: .9em; margin-top: 12px; }
    .no-row { display: grid; grid-template-columns: 130px 1fr; gap: 24px; padding: 16px 0; border-top: 1px solid var(--rs-line); }
    .no-row h2 { font-size: .8em; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--rs-accent); padding-top: 3px; }
    .no .rs-bullets li::before { border-radius: 0; width: .5em; height: 1px; top: .78em; }
    .no-skills { display: flex; flex-wrap: wrap; gap: 6px 18px; }
    .no-line { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 4px !important; }
    .no-line span, .no-note { color: var(--rs-muted); }
  `,
})
export class NordicTemplate extends TemplateBase {}
