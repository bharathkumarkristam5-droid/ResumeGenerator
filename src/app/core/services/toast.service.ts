import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  kind: 'success' | 'error' | 'info';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private next = 1;

  show(text: string, kind: Toast['kind'] = 'info', ms = 3800): void {
    const id = this.next++;
    this.toasts.update((t) => [...t, { id, kind, text }]);
    setTimeout(() => this.dismiss(id), ms);
  }

  success(text: string): void {
    this.show(text, 'success');
  }

  info(text: string): void {
    this.show(text, 'info');
  }

  error(text: string): void {
    this.show(text, 'error', 6000);
  }

  dismiss(id: number): void {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }
}
