import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, inject, input, signal, viewChild,
} from '@angular/core';
import { Resume } from '../core/models/resume.model';
import { PAGE_PX } from '../core/data/templates';
import { ResumeRendererComponent } from './resume-renderer.component';

/** Fits a true-size resume into its container width. `clip` limits it to the first page (thumbnails). */
@Component({
  selector: 'app-resume-preview',
  imports: [ResumeRendererComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="frame" [style.height.px]="frameHeight()" [style.width.px]="page().w * scale()">
      <div class="scaler" [style.width.px]="page().w" [style.transform]="'scale(' + scale() + ')'">
        <div #content><app-resume-renderer [resume]="resume()" /></div>
        @if (showBreaks()) {
          @for (p of breaks(); track p) {
            <div class="break" [style.top.px]="p * page().h"><span>Page {{ p + 1 }}</span></div>
          }
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; width: 100%; }
    .frame { position: relative; overflow: hidden; margin-inline: auto; }
    .scaler { position: absolute; top: 0; left: 0; transform-origin: top left; }
    .break { position: absolute; left: 0; right: 0; border-top: 2px dashed rgb(47 84 235 / .45); pointer-events: none; }
    .break span { position: absolute; right: 10px; top: -12px; background: #2f54eb; color: #fff; font: 600 11px/1 var(--font);
      padding: 5px 8px; border-radius: 6px; }
  `,
})
export class ResumePreviewComponent {
  readonly resume = input.required<Resume>();
  readonly clip = input(false);
  readonly showBreaks = input(false);
  /** Extra zoom multiplier applied on top of fit-to-width. */
  readonly zoom = input(1);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');
  private readonly width = signal(0);
  private readonly contentHeight = signal(0);

  protected readonly page = computed(() => PAGE_PX[this.resume().theme.pageSize]);
  protected readonly scale = computed(() => (this.width() ? (this.width() / this.page().w) * this.zoom() : 0));
  protected readonly frameHeight = computed(() => {
    const h = this.clip() ? this.page().h : Math.max(this.contentHeight(), this.page().h);
    return h * this.scale();
  });
  protected readonly breaks = computed(() => {
    const pages = Math.ceil(this.contentHeight() / this.page().h - 0.01);
    return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => i + 1);
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const ro = new ResizeObserver(() => {
        this.width.set(this.host.nativeElement.clientWidth);
        this.contentHeight.set(this.content().nativeElement.offsetHeight);
      });
      ro.observe(this.host.nativeElement);
      ro.observe(this.content().nativeElement);
      destroyRef.onDestroy(() => ro.disconnect());
    });
  }
}
