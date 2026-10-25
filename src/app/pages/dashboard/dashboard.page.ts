import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../layout/site-header.component';
import { SiteFooterComponent } from '../../layout/site-footer.component';
import { IconComponent } from '../../shared/icon.component';
import { ResumePreviewComponent } from '../../resume-templates/resume-preview.component';
import { ResumeStore } from '../../core/services/resume-store.service';
import { ExportService } from '../../core/services/export.service';
import { ToastService } from '../../core/services/toast.service';
import { templateById } from '../../core/data/templates';
import { scoreResume } from '../../core/services/resume-score';
import { Resume } from '../../core/models/resume.model';

@Component({
  selector: 'app-dashboard-page',
  imports: [SiteHeaderComponent, SiteFooterComponent, IconComponent, ResumePreviewComponent, RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-site-header />
    <section class="container page">
      <div class="head">
        <div>
          <h1>My resumes</h1>
          <p>Saved privately in this browser. Export a backup to use them on another device.</p>
        </div>
        <div class="head-actions">
          <label class="btn btn-secondary">
            <app-icon name="upload" [size]="16" /> Import JSON
            <input type="file" accept="application/json,.json" class="sr-only" (change)="import($event)" />
          </label>
          <button class="btn btn-secondary" (click)="example()"><app-icon name="eye" [size]="16" /> Try an example</button>
          <a class="btn btn-primary" routerLink="/templates"><app-icon name="plus" [size]="16" /> New resume</a>
        </div>
      </div>

      @if (store.sorted().length) {
        <div class="grid">
          @for (r of store.sorted(); track r.id) {
            <article class="item card">
              <a class="thumb" [routerLink]="['/builder', r.id]" [attr.aria-label]="'Edit ' + r.name">
                <app-resume-preview [resume]="r" [clip]="true" />
              </a>
              <div class="info">
                <h3 [title]="r.name">{{ r.name }}</h3>
                <p>{{ tplName(r) }} · Edited {{ r.updatedAt | date: 'MMM d, y, h:mm a' }}</p>
                <div class="score"><div class="bar"><i [style.width.%]="score(r)" [class]="level(score(r))"></i></div><span>{{ score(r) }}%</span></div>
              </div>
              <div class="actions">
                <a class="btn btn-primary sm" [routerLink]="['/builder', r.id]"><app-icon name="pencil" [size]="14" /> Edit</a>
                <button class="icon-btn" (click)="duplicate(r)" title="Duplicate" aria-label="Duplicate"><app-icon name="copy" [size]="17" /></button>
                <button class="icon-btn" (click)="exporter.json(r)" title="Export JSON" aria-label="Export JSON"><app-icon name="json" [size]="17" /></button>
                @if (confirmId() === r.id) {
                  <button class="btn btn-danger sm" (click)="remove(r)">Confirm delete</button>
                } @else {
                  <button class="icon-btn danger" (click)="confirmId.set(r.id)" title="Delete" aria-label="Delete"><app-icon name="trash" [size]="17" /></button>
                }
              </div>
            </article>
          }
        </div>
      } @else {
        <div class="empty card">
          <div class="empty-icon"><app-icon name="file" [size]="34" /></div>
          <h2>No resumes yet</h2>
          <p>Pick a template to start, or explore a fully filled-in example.</p>
          <div class="empty-actions">
            <a class="btn btn-primary lg" routerLink="/templates">Create my first resume</a>
            <button class="btn btn-secondary lg" (click)="example()">See an example</button>
          </div>
        </div>
      }
    </section>
    <app-site-footer />
  `,
  styles: `
    .page { padding-top: 44px; min-height: 60vh; }
    .head { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap; margin-bottom: 30px; }
    h1 { font-size: 34px; color: var(--navy); }
    .head p { color: var(--text-muted); margin-top: 6px; }
    .head-actions { display: flex; gap: 10px; flex-wrap: wrap; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; }
    .item { overflow: hidden; display: flex; flex-direction: column; transition: box-shadow .2s, transform .2s; }
    .item:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
    .thumb { display: block; height: 300px; overflow: hidden; background: var(--surface-2); border-bottom: 1px solid var(--border); padding: 16px 22px 0; }
    .thumb app-resume-preview { box-shadow: var(--shadow); }
    .info { padding: 14px 16px 6px; }
    .info h3 { font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .info p { font-size: 12.5px; color: var(--text-muted); margin-top: 3px; }
    .score { display: flex; align-items: center; gap: 8px; margin-top: 10px; font-size: 12px; font-weight: 600; color: var(--text-2); }
    .bar { flex: 1; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
    .bar i { display: block; height: 100%; border-radius: 3px; }
    .bar i.low { background: var(--danger); } .bar i.mid { background: var(--warning); } .bar i.high { background: var(--success); }
    .actions { display: flex; align-items: center; gap: 4px; padding: 8px 12px 14px 16px; margin-top: auto; }
    .actions .btn-primary { margin-right: auto; }
    .empty { text-align: center; padding: 64px 24px; }
    .empty-icon { width: 76px; height: 76px; border-radius: 22px; margin: 0 auto 18px; display: grid; place-items: center; background: var(--primary-50); color: var(--primary); }
    .empty h2 { font-size: 24px; }
    .empty p { color: var(--text-muted); margin: 8px 0 24px; }
    .empty-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  `,
})
export class DashboardPage {
  protected readonly store = inject(ResumeStore);
  protected readonly exporter = inject(ExportService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  protected readonly confirmId = signal<string | null>(null);

  protected tplName(r: Resume): string {
    return templateById(r.templateId).name;
  }

  protected score(r: Resume): number {
    return scoreResume(r).score;
  }

  protected level(s: number): string {
    return s < 50 ? 'low' : s < 80 ? 'mid' : 'high';
  }

  protected duplicate(r: Resume): void {
    this.store.duplicate(r.id);
    this.toast.success('Resume duplicated.');
  }

  protected remove(r: Resume): void {
    this.store.remove(r.id);
    this.confirmId.set(null);
    this.toast.info(`Deleted “${r.name}”.`);
  }

  protected example(): void {
    const r = this.store.create('aurora', true);
    this.router.navigate(['/builder', r.id]);
  }

  protected async import(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const r = this.store.importJson(await file.text());
      this.toast.success(`Imported “${r.name}”.`);
    } catch (e) {
      this.toast.error(e instanceof Error ? e.message : 'Could not import this file.');
    }
  }
}
