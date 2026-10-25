import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { IconComponent } from '../../shared/icon.component';
import { TemplateBase } from '../template-base';

@Component({
  selector: 'rs-catalyst',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @let res = r();
    <div class="ca">
      <div class="ca-spine"></div>
      <header class="ca-head">
        <div>
          <h1>{{ firstName() }}<br /><span>{{ lastName() }}</span></h1>
          @if (title()) { <p class="ca-title">{{ title() }}</p> }
        </div>
        @if (c().photo) { <img class="rs-photo ca-photo" [src]="c().photo" alt="" /> }
      </header>
      <div class="ca-contact">
        @for (i of contactItems(); track i.icon) { <span><app-icon [name]="i.icon" [size]="12" />{{ i.text }}</span> }
      </div>
      @if (res.summary.trim()) {
        <section class="ca-sec"><h2 class="ca-h">About me</h2><p class="rs-pre">{{ res.summary }}</p></section>
      }
      @if (res.experience.length) {
        <section class="ca-sec">
          <h2 class="ca-h">Experience</h2>
          <div class="ca-timeline">
            @for (e of res.experience; track e.id) {
              <div class="rs-entry ca-item">
                <span class="ca-dot"></span>
                <div class="ca-when">{{ range(e.startDate, e.endDate, e.current) }}</div>
                <h3>{{ e.title }}</h3>
                <div class="rs-sub">{{ join(e.employer, e.city) }}</div>
                <ul class="rs-bullets">@for (b of bullets(e.description); track $index) { <li>{{ b }}</li> }</ul>
              </div>
            }
          </div>
        </section>
      }
      @if (res.education.length) {
        <section class="ca-sec">
          <h2 class="ca-h">Education</h2>
          <div class="ca-timeline">
            @for (e of res.education; track e.id) {
              <div class="rs-entry ca-item">
                <span class="ca-dot"></span>
                <div class="ca-when">{{ range(e.startDate, e.endDate, e.current) }}</div>
                <h3>{{ join(e.degree, e.field) || e.school }}</h3>
                <div class="rs-sub">{{ join(e.school, e.city) }}</div>
                @if (e.details) { <p>{{ e.details }}</p> }
              </div>
            }
          </div>
        </section>
      }
      <div class="ca-grid">
        @if (res.skills.length) {
          <section class="ca-sec">
            <h2 class="ca-h">Skills</h2>
            <div class="ca-tags">@for (s of res.skills; track s.id) { <span>{{ s.name }}</span> }</div>
          </section>
        }
        @if (res.languages.length) {
          <section class="ca-sec">
            <h2 class="ca-h">Languages</h2>
            @for (l of res.languages; track l.id) { <p><strong>{{ l.name }}</strong> · {{ l.level }}</p> }
          </section>
        }
        @if (res.projects.length) {
          <section class="ca-sec">
            <h2 class="ca-h">Projects</h2>
            @for (p of res.projects; track p.id) {
              <div class="rs-entry"><h3>{{ p.name }}</h3>@if (p.link) { <div class="rs-sub">{{ p.link }}</div> }<p>{{ p.description }}</p></div>
            }
          </section>
        }
        @if (res.certifications.length) {
          <section class="ca-sec">
            <h2 class="ca-h">Certifications</h2>
            @for (x of res.certifications; track x.id) { <div class="rs-entry"><h3>{{ x.name }}</h3><div class="rs-sub">{{ join(x.issuer, month(x.date)) }}</div></div> }
          </section>
        }
        @if (res.awards.trim()) {
          <section class="ca-sec"><h2 class="ca-h">Awards</h2>@for (b of bullets(res.awards); track $index) { <p>{{ b }}</p> }</section>
        }
        @if (res.interests.trim()) {
          <section class="ca-sec"><h2 class="ca-h">Interests</h2><p>{{ res.interests }}</p></section>
        }
      </div>
    </div>
  `,
  styles: `
    .ca { padding: 46px 52px 44px 64px; position: relative; min-height: inherit; }
    .ca-spine { position: absolute; left: 0; top: 0; bottom: 0; width: 14px; background: var(--rs-accent); }
    .ca-head { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
    .ca-head h1 { font-size: 3em; font-weight: 800; line-height: .98; color: #111827; letter-spacing: -.02em; }
    .ca-head h1 span { color: var(--rs-accent); }
    .ca-title { margin-top: 10px !important; font-size: 1.1em; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: #4b5563; }
    .ca-photo { width: 110px; height: 110px; border-radius: 20px; box-shadow: 8px 8px 0 var(--rs-tint); }
    .ca-contact { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 18px 0 8px; padding: 12px 0; border-block: 1px solid var(--rs-line); font-size: .9em; color: #374151; }
    .ca-contact span { display: inline-flex; align-items: center; gap: 6px; }
    .ca-contact app-icon { color: var(--rs-accent); }
    .ca-sec { margin-top: 18px; }
    .ca-h { font-size: 1.15em; font-weight: 800; color: #111827; margin-bottom: 10px !important; display: inline-block;
      background: linear-gradient(transparent 60%, color-mix(in srgb, var(--rs-accent) 22%, white) 60%); padding: 0 4px; }
    .ca-timeline { border-left: 2px solid var(--rs-line); margin-left: 6px; padding-left: 22px; }
    .ca-item { position: relative; }
    .ca-dot { position: absolute; left: -29px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #fff; border: 3px solid var(--rs-accent); }
    .ca-when { font-size: .85em; font-weight: 700; color: var(--rs-accent); letter-spacing: .04em; text-transform: uppercase; }
    .ca-item h3 { font-size: 1.08em; font-weight: 700; }
    .ca-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px; }
    .ca-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .ca-tags span { padding: 3px 10px; border-radius: 6px; background: var(--rs-tint); color: var(--rs-accent); font-weight: 600; font-size: .9em; }
    .ca-grid p { margin-bottom: 4px !important; }
  `,
})
export class CatalystTemplate extends TemplateBase {}
