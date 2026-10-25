import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastsComponent } from './shared/toasts.component';
import { AiSettingsDialogComponent } from './layout/ai-settings-dialog.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastsComponent, AiSettingsDialogComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <router-outlet />
    <app-ai-settings-dialog />
    <app-toasts />
  `,
})
export class App {}
