import { Injectable, computed, signal } from '@angular/core';
import { AiProvider } from './ai-provider';
import { ClaudeAi } from './claude-ai';
import { OfflineAi } from './offline-ai';

export type AiEngine = 'builtin' | 'claude';

const ENGINE_KEY = 'rs.ai.engine';
const KEY_KEY = 'rs.ai.key';

function read(key: string): string {
  try {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key) ?? '';
  } catch {
    return '';
  }
}

/** Chooses the assistant engine and stores the user's own API key in this browser only. */
@Injectable({ providedIn: 'root' })
export class AiService {
  readonly engine = signal<AiEngine>((read(ENGINE_KEY) as AiEngine) || 'builtin');
  readonly apiKey = signal(read(KEY_KEY));
  readonly busy = signal<string | null>(null);
  readonly dialogOpen = signal(false);

  private readonly offline = new OfflineAi();
  private readonly claude = computed(() => (this.apiKey() ? new ClaudeAi(this.apiKey()) : null));

  readonly label = computed(() => (this.engine() === 'claude' && this.claude() ? 'Claude AI' : 'Built-in AI'));

  provider(): AiProvider {
    return (this.engine() === 'claude' && this.claude()) || this.offline;
  }

  save(engine: AiEngine, apiKey: string, remember: boolean): void {
    this.engine.set(engine);
    this.apiKey.set(apiKey.trim());
    try {
      localStorage.setItem(ENGINE_KEY, engine);
      localStorage.removeItem(KEY_KEY);
      sessionStorage.removeItem(KEY_KEY);
      if (apiKey.trim()) (remember ? localStorage : sessionStorage).setItem(KEY_KEY, apiKey.trim());
    } catch {
      /* storage unavailable – keep settings for this session only */
    }
  }

  async test(apiKey: string): Promise<void> {
    await new ClaudeAi(apiKey.trim()).ping();
  }

  /** Runs an AI task while exposing a busy flag for the UI. */
  async run<T>(task: string, fn: (p: AiProvider) => Promise<T>): Promise<T> {
    this.busy.set(task);
    try {
      return await fn(this.provider());
    } finally {
      this.busy.set(null);
    }
  }
}

/** Maps SDK and network errors to short, user-facing messages. */
export async function describeAiError(err: unknown): Promise<string> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  if (err instanceof Anthropic.AuthenticationError) return 'Your Claude API key was rejected. Check it in AI settings.';
  if (err instanceof Anthropic.PermissionDeniedError) return 'This API key does not have access to the model.';
  if (err instanceof Anthropic.RateLimitError) return 'Rate limit reached — please wait a moment and try again.';
  if (err instanceof Anthropic.BadRequestError) return `Request rejected: ${err.message}`;
  if (err instanceof Anthropic.APIConnectionError) return 'Could not reach the Claude API. Check your connection.';
  if (err instanceof Anthropic.APIError) return `Claude API error (${err.status ?? 'unknown'}). Please try again.`;
  return err instanceof Error ? err.message : 'Something went wrong.';
}
