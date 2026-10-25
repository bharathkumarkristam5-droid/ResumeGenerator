import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TemplateBase } from '../template-base';

/** Deliberately plain: single column, standard headings, no icons or graphics — parses cleanly in any ATS. */
@Component({
  selector: 'rs-atlas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @let res = r();
    <div class="at">
      <h1>{{ name() }}</h1>
      @if (title()) { <p class="at-title">{{ title() }}</p> }
      <p class="at-contact">@for (i of contactItems(); track i.icon; let last = $last) { {{ i.text }}{{ last ? '' : '  |  ' }} }</p>
      @if (res.summary.trim()) {
        <h2>Summary</h2><p class="rs-pre">{{ res.summary }}</p>
      }
      @if (res.experience.length) {
        <h2>Work Experience</h2>
        @for (e of res.experience; track e.id) {
          <div class="rs-entry">
            <div class="rs-entry-head"><h3>{{ e.title }}</h3><span class="rs-date">{{ range(e.startDate, e.endDate, e.current) }}</span></div>
            <div class="at-emp">{{ join(e.employer, e.city) }}</div>
            <ul class="at-list">@for (b of bullets(e.description); track $index) { <li>{{ b }}</li> }</ul>
          </div>
        }
      }
      @if (res.education.length) {
        <h2>Education</h2>
        @for (e of res.education; track e.id) {
          <div class="rs-entry">
            <div class="rs-entry-head"><h3>{{ join(e.degree, e.field) || e.school }}</h3><span class="rs-date">{{ range(e.startDate, e.endDate, e.current) }}</span></div>
            <div class="at-emp">{{ join(e.school, e.city) }}</div>
            @if (e.details) { <ul class="at-list">@for (b of bullets(e.details); track $index) { <li>{{ b }}</li> }</ul> }
          </div>
        }
      }
      @if (res.skills.length) {
        <h2>Skills</h2>
        <p>@for (s of res.skills; track s.id; let last = $last) { {{ s.name }}{{ last ? '' : ', ' }} }</p>
      }
      @if (res.projects.length) {
        <h2>Projects</h2>
        @for (p of res.projects; track p.id) {
          <div class="rs-entry">
            <div class="rs-entry-head"><h3>{{ p.name }}</h3><span class="rs-date">{{ p.link }}</span></div>
            <ul class="at-list">@for (b of bullets(p.description); track $index) { <li>{{ b }}</li> }</ul>
          </div>
        }
      }
      @if (res.certifications.length) {
        <h2>Certifications</h2>
        <ul class="at-list">@for (x of res.certifications; track x.id) { <li>{{ x.name }}{{ x.issuer ? ', ' + x.issuer : '' }}{{ x.date ? ', ' + month(x.date) : '' }}</li> }</ul>
      }
      @if (res.languages.length) {
        <h2>Languages</h2>
        <p>@for (l of res.languages; track l.id; let last = $last) { {{ l.name }} ({{ l.level }}){{ last ? '' : ', ' }} }</p>
      }
      @if (res.awards.trim()) {
        <h2>Awards</h2><ul class="at-list">@for (b of bullets(res.awards); track $index) { <li>{{ b }}</li> }</ul>
      }
      @if (res.interests.trim()) {
        <h2>Interests</h2><p>{{ res.interests }}</p>
      }
    </div>
  `,
  styles: `
    .at { padding: 48px 56px; color: #111; }
    .at h1 { font-size: 2.1em; font-weight: 700; color: #000; }
    .at-title { font-size: 1.1em; margin-top: 2px !important; color: var(--rs-accent); font-weight: 500; }
    .at-contact { margin-top: 6px !important; font-size: .93em; color: #333; white-space: pre-wrap; }
    .at h2 { font-size: 1.05em; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--rs-accent);
      margin: 18px 0 8px !important; padding-bottom: 3px; border-bottom: 1.5px solid #111; }
    .at-emp { font-style: italic; color: #333; }
    .at-list { padding-left: 1.3em !important; margin-top: 3px !important; }
    .at-list li { margin: 1px 0; }
  `,
})
export class AtlasTemplate extends TemplateBase {}
