import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BuilderContext } from '../builder-context.service';
import { Contact } from '../../../core/models/resume.model';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/icon.component';

/** Downscales a photo to a small JPEG data URL so it fits comfortably in localStorage. */
async function toAvatar(file: File, size = 320): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const s = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  canvas.getContext('2d')!.drawImage(bitmap, (bitmap.width - s) / 2, (bitmap.height - s) / 2, s, s, 0, 0, size, size);
  return canvas.toDataURL('image/jpeg', 0.85);
}

@Component({
  selector: 'app-heading-step',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let ct = c();
    <div class="step-head">
      <h2>Let's start with your heading</h2>
      <p>Recruiters use this to contact you. Include your target job title so they know what you're applying for.</p>
    </div>

    <div class="photo-row">
      <div class="avatar">
        @if (ct.photo) { <img [src]="ct.photo" alt="Profile photo" /> } @else { <app-icon name="camera" [size]="26" /> }
      </div>
      <div>
        <strong>Profile photo <span class="opt">(optional)</span></strong>
        <p>Shown on templates that support photos. Leave it out for markets like the US and UK.</p>
        <div class="photo-actions">
          <label class="btn btn-secondary sm">
            <app-icon name="upload" [size]="14" /> {{ ct.photo ? 'Change' : 'Upload' }}
            <input type="file" accept="image/*" class="sr-only" (change)="photo($event)" />
          </label>
          @if (ct.photo) { <button class="btn btn-danger sm" (click)="set('photo', '')">Remove</button> }
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="field"><label for="fn">First name</label><input id="fn" class="input" placeholder="e.g. Priya" autocomplete="given-name" [value]="ct.firstName" (input)="set('firstName', $any($event.target).value)" /></div>
      <div class="field"><label for="ln">Last name</label><input id="ln" class="input" placeholder="e.g. Sharma" autocomplete="family-name" [value]="ct.lastName" (input)="set('lastName', $any($event.target).value)" /></div>
      <div class="field span-2"><label for="jt">Desired job title</label><input id="jt" class="input" placeholder="e.g. Senior Software Engineer" autocomplete="organization-title" [value]="ct.title" (input)="set('title', $any($event.target).value)" /></div>
      <div class="field"><label for="city">City</label><input id="city" class="input" placeholder="e.g. Hyderabad" autocomplete="address-level2" [value]="ct.city" (input)="set('city', $any($event.target).value)" /></div>
      <div class="field"><label for="country">Country</label><input id="country" class="input" placeholder="e.g. India" autocomplete="country-name" [value]="ct.country" (input)="set('country', $any($event.target).value)" /></div>
      <div class="field"><label for="phone">Phone</label><input id="phone" class="input" type="tel" placeholder="e.g. +91 98765 43210" autocomplete="tel" [value]="ct.phone" (input)="set('phone', $any($event.target).value)" /></div>
      <div class="field"><label for="email">Email</label><input id="email" class="input" type="email" placeholder="e.g. priya@example.com" autocomplete="email" [value]="ct.email" (input)="set('email', $any($event.target).value)" /></div>
      <div class="field"><label for="li">LinkedIn</label><input id="li" class="input" placeholder="linkedin.com/in/your-name" [value]="ct.linkedin" (input)="set('linkedin', $any($event.target).value)" /></div>
      <div class="field"><label for="web">Website / portfolio</label><input id="web" class="input" placeholder="yourname.dev" autocomplete="url" [value]="ct.website" (input)="set('website', $any($event.target).value)" /></div>
    </div>
  `,
  styles: `
    .photo-row { display: flex; gap: 18px; align-items: center; padding: 16px; border: 1px solid var(--border); border-radius: 14px; background: var(--surface); margin-bottom: 22px; }
    .avatar { width: 84px; height: 84px; border-radius: 50%; overflow: hidden; background: var(--surface-2); border: 2px dashed var(--border-strong);
      display: grid; place-items: center; color: var(--text-muted); flex: none; }
    .avatar img { width: 100%; height: 100%; object-fit: cover; }
    .photo-row strong { font-size: 15px; }
    .opt { color: var(--text-muted); font-weight: 400; }
    .photo-row p { color: var(--text-muted); font-size: 13px; margin: 3px 0 10px; }
    .photo-actions { display: flex; gap: 8px; }
  `,
})
export class HeadingStep {
  private readonly ctx = inject(BuilderContext);
  private readonly toast = inject(ToastService);
  protected readonly c = computed(() => this.ctx.resume()!.contact);

  protected set(key: keyof Contact, value: string): void {
    this.ctx.update((d) => (d.contact[key] = value));
  }

  protected async photo(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      this.set('photo', await toAvatar(file));
    } catch {
      this.toast.error('That image could not be read. Try a JPG or PNG.');
    }
  }
}
