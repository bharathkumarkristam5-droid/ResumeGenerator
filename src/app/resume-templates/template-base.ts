import { Directive, computed, input } from '@angular/core';
import { Resume, SKILL_LEVELS, dateRange, formatMonth, fullName, initials, toBullets } from '../core/models/resume.model';

export interface ContactItem {
  icon: string;
  text: string;
}

/** Shared inputs and helpers for every resume template. */
@Directive()
export abstract class TemplateBase {
  readonly r = input.required<Resume>();

  protected readonly c = computed(() => this.r().contact);
  protected readonly name = computed(() => fullName(this.c()) || 'Your Name');
  protected readonly firstName = computed(() => this.c().firstName || 'Your');
  protected readonly lastName = computed(() => this.c().lastName || (this.c().firstName ? '' : 'Name'));
  protected readonly title = computed(() => this.c().title || (fullName(this.c()) ? '' : 'Professional Title'));
  protected readonly initials = computed(() => initials(this.c()) || 'YN');
  protected readonly location = computed(() => [this.c().city, this.c().country].filter(Boolean).join(', '));

  protected readonly contactItems = computed<ContactItem[]>(() => {
    const c = this.c();
    return [
      { icon: 'mail', text: c.email },
      { icon: 'phone', text: c.phone },
      { icon: 'pin', text: this.location() },
      { icon: 'link', text: c.linkedin },
      { icon: 'globe', text: c.website },
    ].filter((x) => x.text);
  });

  protected readonly hasExtras = computed(() => {
    const r = this.r();
    return r.projects.length + r.certifications.length + r.languages.length > 0 || !!r.awards.trim() || !!r.interests.trim();
  });

  protected bullets(text: string): string[] {
    return toBullets(text);
  }

  protected range(start: string, end: string, current: boolean): string {
    return dateRange(start, end, current);
  }

  protected month(v: string): string {
    return formatMonth(v);
  }

  protected skillLevel(level: number): string {
    return SKILL_LEVELS[Math.min(Math.max(level, 1), 5) - 1];
  }

  protected join(...parts: string[]): string {
    return parts.filter(Boolean).join(', ');
  }
}
