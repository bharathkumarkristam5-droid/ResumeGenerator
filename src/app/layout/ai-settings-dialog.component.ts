import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AiEngine, AiService, describeAiError } from '../core/ai/ai.service';
import { CLAUDE_MODEL } from '../core/ai/claude-ai';
import { ToastService } from '../core/services/toast.service';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'app-ai-settings-dialog',
  imports: [FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'close()' },
  template: `
    @if (ai.dialogOpen()) {
      <div class="backdrop" (click)="close()">
        <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="ai-title" (click)="$event.stopPropagation()">
          <div class="head">
            <div class="spark"><app-icon name="sparkles" [size]="20" /></div>
            <div>
              <h2 id="ai-title">AI writing assistant</h2>
              <p>Choose how resume content is enhanced.</p>
            </div>
            <button class="icon-btn" (click)="close()" aria-label="Close"><app-icon name="x" /></button>
          </div>

          <div class="body">
            <label class="opt" [class.sel]="engine() === 'builtin'">
              <input type="radio" name="engine" value="builtin" [ngModel]="engine()" (ngModelChange)="engine.set($event)" />
              <div>
                <strong>Built-in assistant <span class="badge">Free · Private</span></strong>
                <p>Runs entirely in your browser: role-based phrase library, action-verb rewriting, summary generator and job-match keyword analysis. No account or key needed.</p>
              </div>
            </label>
            <label class="opt" [class.sel]="engine() === 'claude'">
              <input type="radio" name="engine" value="claude" [ngModel]="engine()" (ngModelChange)="engine.set($event)" />
              <div>
                <strong>Claude by Anthropic <span class="badge ai">Advanced</span></strong>
                <p>Context-aware rewriting and tailoring using <code>{{ model }}</code>. Bring your own API key — requests go straight from your browser to Anthropic.</p>
              </div>
            </label>

            @if (engine() === 'claude') {
              <div class="field key">
                <label for="key">Anthropic API key</label>
                <div class="key-row">
                  <input id="key" class="input" [type]="show() ? 'text' : 'password'" placeholder="sk-ant-..." autocomplete="off"
                    [ngModel]="key()" (ngModelChange)="key.set($event)" />
                  <button class="icon-btn" type="button" (click)="show.set(!show())" [attr.aria-label]="show() ? 'Hide key' : 'Show key'"><app-icon name="eye" /></button>
                </div>
                <span class="hint">Create a key at console.anthropic.com. Usage is billed to your Anthropic account.</span>
                <label class="check"><input type="checkbox" [ngModel]="remember()" (ngModelChange)="remember.set($event)" /> Remember on this device</label>
              </div>
              <div class="note"><app-icon name="lock" [size]="15" /><span>Your key is stored only in this browser ({{ remember() ? 'until you clear it' : 'for this tab session' }}) and is never sent to our servers.</span></div>
            }
          </div>

          <div class="foot">
            @if (engine() === 'claude') {
              <button class="btn btn-secondary" (click)="test()" [disabled]="!key() || testing()">
                @if (testing()) { <app-icon name="loader" class="spin" [size]="16" /> } Test connection
              </button>
            }
            <span class="grow"></span>
            <button class="btn btn-ghost" (click)="close()">Cancel</button>
            <button class="btn btn-primary" (click)="save()" [disabled]="engine() === 'claude' && !key()">Save settings</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .head { display: flex; align-items: flex-start; gap: 14px; padding: 22px 22px 6px; }
    .head > div:nth-child(2) { flex: 1; }
    .head h2 { font-size: 19px; }
    .head p { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
    .spark { width: 42px; height: 42px; border-radius: 12px; background: var(--ai-gradient); color: #fff; display: grid; place-items: center; flex: none; }
    .body { padding: 16px 22px; display: flex; flex-direction: column; gap: 12px; }
    .opt { display: flex; gap: 12px; padding: 14px 16px; border: 1.5px solid var(--border); border-radius: 12px; cursor: pointer; transition: all .15s; }
    .opt:hover { border-color: var(--border-strong); }
    .opt.sel { border-color: var(--primary); background: var(--primary-50); }
    .opt input { margin-top: 4px; accent-color: var(--primary); }
    .opt strong { display: flex; align-items: center; gap: 8px; font-size: 15px; }
    .opt p { font-size: 13.5px; color: var(--text-2); margin-top: 4px; }
    .badge.ai { background: #f3e8ff; color: #7c3aed; }
    code { background: #fff; border: 1px solid var(--border); border-radius: 5px; padding: 0 5px; font-size: 12.5px; }
    .key { margin-top: 4px; gap: 8px; }
    .key-row { display: flex; gap: 6px; align-items: center; }
    .note { display: flex; gap: 8px; font-size: 12.5px; color: var(--text-muted); background: var(--surface-2); padding: 10px 12px; border-radius: 10px; }
    .note app-icon { color: var(--success); margin-top: 2px; }
    .foot { display: flex; gap: 8px; padding: 14px 22px 20px; border-top: 1px solid var(--border); flex-wrap: wrap; }
    .grow { flex: 1; }
  `,
})
export class AiSettingsDialogComponent {
  protected readonly ai = inject(AiService);
  private readonly toast = inject(ToastService);
  protected readonly model = CLAUDE_MODEL;

  protected readonly engine = signal<AiEngine>('builtin');
  protected readonly key = signal('');
  protected readonly remember = signal(true);
  protected readonly show = signal(false);
  protected readonly testing = signal(false);

  constructor() {
    // Reset the form from saved settings every time the dialog opens.
    effect(() => {
      if (this.ai.dialogOpen()) {
        this.engine.set(this.ai.engine());
        this.key.set(this.ai.apiKey());
      }
    });
  }

  close(): void {
    this.ai.dialogOpen.set(false);
  }

  async test(): Promise<void> {
    this.testing.set(true);
    try {
      await this.ai.test(this.key());
      this.toast.success('Connected to Claude successfully.');
    } catch (e) {
      this.toast.error(await describeAiError(e));
    } finally {
      this.testing.set(false);
    }
  }

  save(): void {
    this.ai.save(this.engine(), this.key(), this.remember());
    this.toast.success(this.engine() === 'claude' ? 'Claude AI enabled.' : 'Using the built-in assistant.');
    this.close();
  }
}
