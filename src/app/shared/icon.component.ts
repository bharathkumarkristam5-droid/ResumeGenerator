import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ArrowRight, Award, BadgeCheck, Briefcase, Camera, Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert,
  CircleCheck, Copy, Download, Eye, FileBraces, FileDown, FileText, FileType, Flag, FolderKanban, Gauge, Globe,
  GraduationCap, GripVertical, Heart, Image, Info, KeyRound, Languages, LayoutGrid, LayoutTemplate, Lightbulb, Link,
  LoaderCircle, Lock, Mail, MapPin, Menu, Palette, Pencil, Phone, Plus, Printer, Rocket, Settings, ShieldCheck,
  Sparkles, Star, Target, TextAlignStart, Trash, Type, Upload, User, Users, WandSparkles, Wrench, X, Zap, ZoomIn,
  ZoomOut, type IconNode,
} from 'lucide';

/** Lucide icons (ISC licence) rendered inline. Only the icons listed here end up in the bundle. */
const ICONS: Record<string, IconNode> = {
  'arrow-right': ArrowRight, award: Award, badge: BadgeCheck, briefcase: Briefcase, camera: Camera, check: Check,
  'chevron-down': ChevronDown, 'chevron-left': ChevronLeft, 'chevron-right': ChevronRight, alert: CircleAlert,
  'check-circle': CircleCheck, copy: Copy, download: Download, eye: Eye, json: FileBraces, 'file-down': FileDown,
  file: FileText, 'file-type': FileType, flag: Flag, folder: FolderKanban, gauge: Gauge, globe: Globe,
  education: GraduationCap, grip: GripVertical, heart: Heart, image: Image, info: Info, key: KeyRound,
  languages: Languages, grid: LayoutGrid, template: LayoutTemplate, idea: Lightbulb, link: Link,
  loader: LoaderCircle, lock: Lock, mail: Mail, pin: MapPin, menu: Menu, palette: Palette, pencil: Pencil,
  phone: Phone, plus: Plus, printer: Printer, rocket: Rocket, settings: Settings, shield: ShieldCheck,
  sparkles: Sparkles, star: Star, target: Target, text: TextAlignStart, trash: Trash, type: Type, upload: Upload,
  user: User, users: Users, wand: WandSparkles, wrench: Wrench, x: X, zap: Zap, 'zoom-in': ZoomIn, 'zoom-out': ZoomOut,
};

const esc = (v: unknown) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon', '[style.width.px]': 'size()', '[style.height.px]': 'size()', 'aria-hidden': 'true' },
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    [attr.stroke-width]="stroke()" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="svg()"></svg>`,
  styles: `:host{display:inline-flex;flex:none;line-height:0} svg{width:100%;height:100%}`,
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input(18);
  readonly stroke = input(2);

  private readonly sanitizer = inject(DomSanitizer);

  // Safe: markup is generated only from the static Lucide icon definitions above.
  protected readonly svg = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      (ICONS[this.name()] ?? []).map(([tag, attrs]) =>
        `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')}/>`,
      ).join(''),
    ),
  );
}
