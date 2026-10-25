import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { BuilderContext } from '../builder-context.service';
import { AiService } from '../../../core/ai/ai.service';
import { IconComponent } from '../../../shared/icon.component';

@Component({
  selector: 'app-summary-step',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="step-head">
      <h2>Write your professional summary</h2>
      <p>2–4 sentences that sell your experience, top skills and what you bring to the role. This is the first thing recruiters read.</p>
    </div>

    <div class="ai-cta">
      <div class="spark"><app-icon name="sparkles" [size]="20" /></div>
      <div class="txt">
        <strong>Let AI write it for you</strong>
        <span>Uses your title, experience and skills{{ summary().trim() ? ' — and polishes your current draft' : '' }}.</span>
      </div>
      <button class="btn btn-ai" (click)="generate()" [disabled]="!!ai.busy()">
        <app-icon [name]="ai.busy() === 'summary' ? 'loader' : 'wand'" [class.spin]="ai.busy() === 'summary'" [size]="16" />
        {{ options().length ? 'Regenerate' : 'Generate summary' }}
      </button>
    </div>

    @if (options().length) {
      <div class="options">
        @for (o of options(); track $index) {
          <div class="option" [class.picked]="summary() === o">
            <p>{{ o }}</p>
            <button class="btn sm" [class.btn-primary]="summary() !== o" [class.btn-secondary]="summary() === o" (click)="use(o)">
              <app-icon [name]="summary() === o ? 'check' : 'plus'" [size]="14" /> {{ summary() === o ? 'In use' : 'Use this' }}
            </button>
          </div>
        }
      </div>
    }

    <div class="field">
      <label for="summary">Summary</label>
      <textarea id="summary" class="input" rows="7" placeholder="e.g. Customer-focused software engineer with 5+ years of experience building scalable web applications..."
        [value]="summary()" (input)="set($any($event.target).value)"></textarea>
      <div class="counter" [class.good]="words() >= 40 && words() <= 90">
        <span>{{ words() }} words</span><span>Recommended: 40–90 words</span>
      </div>
    </div>
  `,
  styles: `
    .ai-cta { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border-radius: 16px; margin-bottom: 18px;
      background: linear-gradient(#fff, #fff) padding-box, var(--ai-gradient) border-box; border: 1.5px solid transparent; }
    .spark { width: 42px; height: 42px; border-radius: 12px; background: var(--ai-gradient); color: #fff; display: grid; place-items: center; flex: none; }
    .txt { flex: 1; display: flex; flex-direction: column; }
    .txt span { font-size: 13px; color: var(--text-muted); }
    .options { display: grid; gap: 10px; margin-bottom: 20px; }
    .option { padding: 14px 16px; border-radius: 14px; border: 1px solid var(--border); background: #fff; display: flex; gap: 14px; align-items: flex-start; }
    .option p { flex: 1; font-size: 14px; line-height: 1.6; color: var(--text-2); }
    .option.picked { border-color: var(--primary); background: var(--primary-50); }
    .counter { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--warning); }
    .counter.good { color: var(--success); }
    .counter span:last-child { color: var(--text-muted); }
    @media (max-width: 560px) { .ai-cta { flex-wrap: wrap; } .option { flex-direction: column; } }
  `,
})
export class SummaryStep {
  private readonly ctx = inject(BuilderContext);
  protected readonly ai = inject(AiService);
  protected readonly summary = computed(() => this.ctx.resume()!.summary);
  protected readonly words = computed(() => this.summary().trim().split(/\s+/).filter(Boolean).length);
  protected readonly options = signal<string[]>([]);

  protected set(v: string): void {
    this.ctx.update((d) => (d.summary = v));
  }

  protected use(v: string): void {
    this.set(v);
  }

  protected async generate(): Promise<void> {
    const res = await this.ctx.runAi('summary', (p) => p.writeSummary(this.ctx.resume()!));
    if (res) this.options.set(res);
  }
}
