import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input } from '@angular/core';
import { Resume } from '../core/models/resume.model';
import { PAGE_PX, fontStack } from '../core/data/templates';
import { AuroraTemplate } from './templates/aurora.template';
import { SummitTemplate } from './templates/summit.template';
import { MeridianTemplate } from './templates/meridian.template';
import { NordicTemplate } from './templates/nordic.template';
import { ExecutiveTemplate } from './templates/executive.template';
import { CatalystTemplate } from './templates/catalyst.template';
import { AtlasTemplate } from './templates/atlas.template';
import { HorizonTemplate } from './templates/horizon.template';

const FONT_SIZES = { sm: '12px', md: '13px', lg: '14px' } as const;

/** Renders a resume at true page size. Parents scale it with CSS transforms for previews. */
@Component({
  selector: 'app-resume-renderer',
  imports: [
    AuroraTemplate, SummitTemplate, MeridianTemplate, NordicTemplate,
    ExecutiveTemplate, CatalystTemplate, AtlasTemplate, HorizonTemplate,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="rs-page" [class]="'rs-page tpl-' + resume().templateId" [style]="vars()">
      @switch (resume().templateId) {
        @case ('summit') { <rs-summit [r]="resume()" /> }
        @case ('meridian') { <rs-meridian [r]="resume()" /> }
        @case ('nordic') { <rs-nordic [r]="resume()" /> }
        @case ('executive') { <rs-executive [r]="resume()" /> }
        @case ('catalyst') { <rs-catalyst [r]="resume()" /> }
        @case ('atlas') { <rs-atlas [r]="resume()" /> }
        @case ('horizon') { <rs-horizon [r]="resume()" /> }
        @default { <rs-aurora [r]="resume()" /> }
      }
    </div>
  `,
  styles: `
    app-resume-renderer { display: block; }
    .rs-page {
      --rs-ink: #1f2937; --rs-muted: #6b7280; --rs-line: #e5e7eb;
      --rs-tint: color-mix(in srgb, var(--rs-accent) 9%, white);
      width: var(--rs-w); min-height: var(--rs-h); background: #fff; color: var(--rs-ink);
      font-family: var(--rs-font); font-size: var(--rs-fs); line-height: 1.5;
      -webkit-font-smoothing: antialiased; text-align: left; position: relative;
      overflow-wrap: break-word;
    }
    .rs-page > * { display: block; min-height: inherit; }
    .rs-page h1, .rs-page h2, .rs-page h3, .rs-page h4 { font-family: inherit; letter-spacing: normal; margin: 0; line-height: 1.25; }
    .rs-page p { margin: 0; }
    .rs-page ul { margin: 0; padding: 0; }
    .rs-bullets { list-style: none; margin: 4px 0 0; }
    .rs-bullets li { position: relative; padding-left: 1.05em; margin: 2px 0; }
    .rs-bullets li::before { content: ''; position: absolute; left: 0.15em; top: 0.62em; width: 0.36em; height: 0.36em; border-radius: 50%; background: var(--rs-accent); }
    .rs-entry { margin-bottom: 1.05em; }
    .rs-entry:last-child { margin-bottom: 0; }
    .rs-entry-head { display: flex; justify-content: space-between; align-items: baseline; gap: 1em; }
    .rs-entry-head h3 { font-size: 1.08em; font-weight: 700; }
    .rs-sub { color: var(--rs-muted); font-weight: 500; }
    .rs-date { color: var(--rs-muted); font-size: 0.92em; white-space: nowrap; flex: none; }
    .rs-photo { object-fit: cover; border-radius: 50%; display: block; }
    .rs-pre { white-space: pre-line; }
  `,
})
export class ResumeRendererComponent {
  readonly resume = input.required<Resume>();

  protected readonly vars = computed(() => {
    const t = this.resume().theme;
    const page = PAGE_PX[t.pageSize];
    return {
      '--rs-accent': t.accent,
      '--rs-font': fontStack(t.font),
      '--rs-fs': FONT_SIZES[t.fontSize],
      '--rs-w': `${page.w}px`,
      '--rs-h': `${page.h}px`,
    };
  });
}
