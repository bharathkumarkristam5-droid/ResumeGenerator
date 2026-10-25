import { Injectable } from '@angular/core';
import {
  Resume, dateRange, formatMonth, fullName, toBullets,
} from '../models/resume.model';
import { FONTS, PAGE_PX } from '../data/templates';

const PT = { A4: { w: 595.28, h: 841.89 }, Letter: { w: 612, h: 792 } } as const;
/** Top margin (CSS px) added to continuation pages so text doesn't touch the edge. */
const CONTINUATION_MARGIN = 36;

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function fileBase(r: Resume): string {
  const name = fullName(r.contact).replace(/[^\p{L}\p{N}]+/gu, '_') || 'My';
  return `${name}_Resume`;
}

@Injectable({ providedIn: 'root' })
export class ExportService {
  /**
   * Renders the unscaled resume element to a high-resolution PDF.
   * Page breaks are moved up to the nearest block boundary so lines are never cut in half.
   */
  async pdf(el: HTMLElement, r: Resume): Promise<void> {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas-pro'), import('jspdf')]);
    await document.fonts.ready;

    const page = PAGE_PX[r.theme.pageSize];
    const scale = 2;
    const canvas = await html2canvas(el, { scale, backgroundColor: '#ffffff', useCORS: true, logging: false, windowWidth: page.w });
    const totalH = el.scrollHeight;
    const cuts = this.pageCuts(el, totalH, page.h);

    const pt = PT[r.theme.pageSize];
    const doc = new jsPDF({ unit: 'pt', format: r.theme.pageSize === 'A4' ? 'a4' : 'letter', compress: true });
    doc.setProperties({ title: `${fullName(r.contact)} – Resume`, creator: 'Resume Studio' });

    for (let i = 0; i < cuts.length - 1; i++) {
      const top = cuts[i];
      const bottom = cuts[i + 1];
      const margin = i === 0 ? 0 : CONTINUATION_MARGIN;
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = page.w * scale;
      pageCanvas.height = page.h * scale;
      const ctx = pageCanvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      const sliceH = (bottom - top) * scale;
      // The resume's last pixel row is pure background (sidebar colors + white), so stretching it
      // into the margins makes sidebars and spines continue across pages without copying any text.
      // Sample a few rows above the edge (the last row is anti-aliased) and stretch without smoothing.
      const bgRow = canvas.height - 4;
      ctx.imageSmoothingEnabled = false;
      if (margin) ctx.drawImage(canvas, 0, bgRow, canvas.width, 1, 0, 0, pageCanvas.width, margin * scale);
      ctx.drawImage(canvas, 0, top * scale, canvas.width, sliceH, 0, margin * scale, pageCanvas.width, sliceH);
      const filled = margin * scale + sliceH;
      if (filled < pageCanvas.height) {
        ctx.drawImage(canvas, 0, bgRow, canvas.width, 1, 0, filled, pageCanvas.width, pageCanvas.height - filled);
      }
      if (i > 0) doc.addPage();
      doc.addImage(pageCanvas.toDataURL('image/jpeg', 0.94), 'JPEG', 0, 0, pt.w, pt.h, undefined, 'FAST');
    }
    doc.save(`${fileBase(r)}.pdf`);
  }

  /** Computes y offsets (CSS px) where each PDF page starts, avoiding cutting through text blocks. */
  private pageCuts(el: HTMLElement, totalH: number, pageH: number): number[] {
    const origin = el.getBoundingClientRect().top;
    const rects = (selector: string) =>
      [...el.querySelectorAll<HTMLElement>(selector)]
        .map((n) => {
          const b = n.getBoundingClientRect();
          return { top: b.top - origin, bottom: b.bottom - origin };
        })
        .filter((b) => b.bottom - b.top > 0);
    const blocks = rects('li, p, h1, h2, h3, h4, .rs-entry-head, .rs-sub, .rs-avoid');
    // Headings must stay with the content that follows them.
    const keepWithNext = rects('h2, h3, .rs-entry-head, .rs-sub');

    const cuts = [0];
    let start = 0;
    while (totalH - start > (cuts.length === 1 ? pageH : pageH - CONTINUATION_MARGIN) + 1) {
      const avail = cuts.length === 1 ? pageH : pageH - CONTINUATION_MARGIN;
      let cut = start + avail;
      let moved = true;
      while (moved) {
        moved = false;
        for (const b of blocks) {
          if (b.top < cut && b.bottom > cut && b.top > start + 60 && b.bottom - b.top < avail / 2) {
            cut = b.top - 6;
            moved = true;
          }
        }
        for (const h of keepWithNext) {
          if (h.bottom <= cut && h.bottom > cut - 48 && h.top > start + 60) {
            cut = h.top - 6;
            moved = true;
          }
        }
      }
      cuts.push(cut);
      start = cut;
    }
    cuts.push(totalH);
    return cuts;
  }

  /**
   * Opens the browser print dialog with only the resume on the page.
   * "Save as PDF" here produces a vector PDF with selectable text — the most ATS-friendly option.
   */
  print(el: HTMLElement, r: Resume): void {
    const root = document.createElement('div');
    root.id = 'print-root';
    root.innerHTML = el.outerHTML;
    const style = document.createElement('style');
    style.textContent = `@page { size: ${r.theme.pageSize === 'A4' ? 'A4' : 'letter'}; margin: 0; }`;
    document.body.append(root, style);
    document.body.classList.add('printing');
    const prevTitle = document.title;
    document.title = fileBase(r);
    const cleanup = () => {
      root.remove();
      style.remove();
      document.body.classList.remove('printing');
      document.title = prevTitle;
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(() => window.print(), 50);
  }

  json(r: Resume): void {
    download(new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' }), `${fileBase(r)}.json`);
  }

  /** Builds a clean, ATS-friendly Word document from the resume data. */
  async docx(r: Resume): Promise<void> {
    const d = await import('docx');
    const { Document, Packer, Paragraph, TextRun, AlignmentType, TabStopType, BorderStyle, ExternalHyperlink } = d;
    const accent = r.theme.accent.replace('#', '');
    const serif = FONTS.find((f) => f.name === r.theme.font)?.kind === 'Serif';
    const font = serif ? 'Georgia' : 'Calibri';
    const c = r.contact;
    const RIGHT = 10_000;

    const heading = (text: string) =>
      new Paragraph({
        spacing: { before: 260, after: 100 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: accent, space: 2 } },
        children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: accent, characterSpacing: 30 })],
      });
    const line = (left: string, right: string, bold = true) =>
      new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: RIGHT }],
        spacing: { before: 120 },
        children: [new TextRun({ text: left, bold }), new TextRun({ text: `\t${right}`, color: '555555' })],
      });
    const sub = (text: string) => new Paragraph({ children: [new TextRun({ text, italics: true, color: '444444' })] });
    const bullet = (text: string) => new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 40 } });
    const plain = (text: string) => new Paragraph({ text, spacing: { after: 60 } });

    const contactBits = [c.email, c.phone, [c.city, c.country].filter(Boolean).join(', '), c.linkedin, c.website].filter(Boolean);
    const children: InstanceType<typeof Paragraph>[] = [
      new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text: fullName(c) || 'Your Name', bold: true, size: 44, color: accent })] }),
    ];
    if (c.title) children.push(new Paragraph({ children: [new TextRun({ text: c.title, size: 26, color: '333333' })] }));
    if (contactBits.length) {
      children.push(new Paragraph({
        spacing: { before: 80 },
        children: contactBits.flatMap((t, i) => {
          const isLink = t === c.linkedin || t === c.website;
          const run = isLink
            ? new ExternalHyperlink({ link: t.startsWith('http') ? t : `https://${t}`, children: [new TextRun({ text: t, style: 'Hyperlink', size: 19 })] })
            : new TextRun({ text: t, size: 19, color: '444444' });
          return i ? [new TextRun({ text: '  |  ', size: 19, color: '999999' }), run] : [run];
        }),
      }));
    }
    if (r.summary.trim()) children.push(heading('Professional Summary'), plain(r.summary.trim()));
    if (r.experience.length) {
      children.push(heading('Experience'));
      for (const e of r.experience) {
        children.push(line(e.title || 'Role', dateRange(e.startDate, e.endDate, e.current)));
        const where = [e.employer, e.city].filter(Boolean).join(', ');
        if (where) children.push(sub(where));
        toBullets(e.description).forEach((b) => children.push(bullet(b)));
      }
    }
    if (r.education.length) {
      children.push(heading('Education'));
      for (const e of r.education) {
        children.push(line([e.degree, e.field].filter(Boolean).join(', ') || e.school, dateRange(e.startDate, e.endDate, e.current)));
        const where = [e.school, e.city].filter(Boolean).join(', ');
        if (where && (e.degree || e.field)) children.push(sub(where));
        toBullets(e.details).forEach((b) => children.push(bullet(b)));
      }
    }
    if (r.skills.length) {
      children.push(heading('Skills'), plain(r.skills.map((s) => s.name).join('  •  ')));
    }
    if (r.projects.length) {
      children.push(heading('Projects'));
      for (const p of r.projects) {
        children.push(line(p.name, p.link, true));
        toBullets(p.description).forEach((b) => children.push(bullet(b)));
      }
    }
    if (r.certifications.length) {
      children.push(heading('Certifications'));
      r.certifications.forEach((x) => children.push(line([x.name, x.issuer].filter(Boolean).join(' — '), formatMonth(x.date), false)));
    }
    if (r.languages.length) {
      children.push(heading('Languages'), plain(r.languages.map((l) => `${l.name} (${l.level})`).join('  •  ')));
    }
    if (r.awards.trim()) {
      children.push(heading('Awards'));
      toBullets(r.awards).forEach((b) => children.push(bullet(b)));
    }
    if (r.interests.trim()) children.push(heading('Interests'), plain(r.interests.trim()));

    const doc = new Document({
      creator: 'Resume Studio',
      title: `${fullName(c)} – Resume`,
      styles: { default: { document: { run: { font, size: 21 } } } },
      sections: [{ properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } }, children }],
    });
    download(await Packer.toBlob(doc), `${fileBase(r)}.docx`);
  }
}

