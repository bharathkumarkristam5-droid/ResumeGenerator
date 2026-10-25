import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TemplateBase } from '../template-base';

@Component({
  selector: 'rs-executive',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @let res = r();
    <div class="ex">
      <header class="ex-head">
        <h1>{{ name() }}</h1>
        @if (title()) { <p class="ex-title">{{ title() }}</p> }
        <div class="ex-rule"><span></span><i></i><span></span></div>
        <p class="ex-contact">@for (i of contactItems(); track i.icon; let last = $last) { {{ i.text }}@if (!last) { <b>|</b> } }</p>
      </header>
      @if (res.summary.trim()) {
        <section><h2 class="ex-h">Executive Profile</h2><p class="rs-pre ex-summary">{{ res.summary }}</p></section>
      }
      @if (res.skills.length) {
        <section>
          <h2 class="ex-h">Areas of Expertise</h2>
          <ul class="ex-skills">@for (s of res.skills; track s.id) { <li>{{ s.name }}</li> }</ul>
        </section>
      }
      @if (res.experience.length) {
        <section>
          <h2 class="ex-h">Professional Experience</h2>
          @for (e of res.experience; track e.id) {
            <div class="rs-entry">
              <div class="rs-entry-head"><h3 class="ex-emp">{{ e.employer || e.title }}</h3><span class="rs-date">{{ e.city }}</span></div>
              <div class="rs-entry-head ex-role"><em>{{ e.employer ? e.title : '' }}</em><span class="rs-date">{{ range(e.startDate, e.endDate, e.current) }}</span></div>
              <ul class="rs-bullets">@for (b of bullets(e.description); track $index) { <li>{{ b }}</li> }</ul>
            </div>
          }
        </section>
      }
      @if (res.education.length) {
        <section>
          <h2 class="ex-h">Education</h2>
          @for (e of res.education; track e.id) {
            <div class="rs-entry">
              <div class="rs-entry-head"><h3>{{ join(e.degree, e.field) || e.school }}</h3><span class="rs-date">{{ range(e.startDate, e.endDate, e.current) }}</span></div>
              <div class="rs-sub"><em>{{ join(e.school, e.city) }}</em></div>
              @if (e.details) { <p>{{ e.details }}</p> }
            </div>
          }
        </section>
      }
      @if (res.projects.length) {
        <section>
          <h2 class="ex-h">Key Projects</h2>
          @for (p of res.projects; track p.id) {
            <div class="rs-entry">
              <div class="rs-entry-head"><h3>{{ p.name }}</h3><span class="rs-date">{{ p.link }}</span></div>
              <ul class="rs-bullets">@for (b of bullets(p.description); track $index) { <li>{{ b }}</li> }</ul>
            </div>
          }
        </section>
      }
      @if (res.certifications.length || res.languages.length || res.awards.trim()) {
        <section>
          <h2 class="ex-h">Credentials & Recognition</h2>
          <ul class="rs-bullets">
            @for (x of res.certifications; track x.id) { <li><strong>{{ x.name }}</strong>{{ x.issuer ? ', ' + x.issuer : '' }}{{ x.date ? ' (' + month(x.date) + ')' : '' }}</li> }
            @for (b of bullets(res.awards); track $index) { <li>{{ b }}</li> }
            @if (res.languages.length) { <li><strong>Languages:</strong> @for (l of res.languages; track l.id; let last = $last) { {{ l.name }} ({{ l.level }}){{ last ? '' : ', ' }} }</li> }
          </ul>
        </section>
      }
      @if (res.interests.trim()) {
        <section><h2 class="ex-h">Interests</h2><p>{{ res.interests }}</p></section>
      }
    </div>
  `,
  styles: `
    .ex { padding: 50px 60px; }
    .ex-head { text-align: center; margin-bottom: 22px; }
    .ex-head h1 { font-size: 2.6em; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #1c1917; }
    .ex-title { font-style: italic; font-size: 1.15em; color: var(--rs-accent); margin-top: 6px !important; }
    .ex-rule { display: flex; align-items: center; gap: 10px; justify-content: center; margin: 12px auto 10px; width: 60%; }
    .ex-rule span { flex: 1; height: 1px; background: var(--rs-accent); opacity: .5; }
    .ex-rule i { width: 7px; height: 7px; background: var(--rs-accent); transform: rotate(45deg); }
    .ex-contact { color: #57534e; font-size: .92em; }
    .ex-contact b { color: var(--rs-accent); font-weight: 400; margin: 0 8px; }
    .ex section { margin-bottom: 18px; }
    .ex-h { font-size: 1.02em; font-variant: small-caps; letter-spacing: .14em; font-weight: 700; color: var(--rs-accent);
      text-align: center; margin-bottom: 10px !important; display: flex; align-items: center; gap: 14px; }
    .ex-h::before, .ex-h::after { content: ''; flex: 1; height: 1px; background: var(--rs-line); }
    .ex-summary { text-align: justify; }
    .ex-skills { list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px 16px; text-align: center; }
    .ex-skills li { padding: 3px 0; border-bottom: 1px dotted var(--rs-line); }
    .ex-emp { text-transform: uppercase; letter-spacing: .06em; font-size: 1em !important; }
    .ex-role em { color: var(--rs-accent); font-weight: 600; }
    .ex .rs-bullets li::before { border-radius: 0; transform: rotate(45deg); width: .32em; height: .32em; }
  `,
})
export class ExecutiveTemplate extends TemplateBase {}
