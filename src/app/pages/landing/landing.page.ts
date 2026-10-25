import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../layout/site-header.component';
import { SiteFooterComponent } from '../../layout/site-footer.component';
import { IconComponent } from '../../shared/icon.component';
import { ResumePreviewComponent } from '../../resume-templates/resume-preview.component';
import { sampleResume } from '../../core/data/sample-resume';
import { TEMPLATES } from '../../core/data/templates';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, SiteHeaderComponent, SiteFooterComponent, IconComponent, ResumePreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing.page.html',
  styleUrl: './landing.page.scss',
})
export class LandingPage {
  protected readonly heroBack = sampleResume('meridian');
  protected readonly heroFront = sampleResume('aurora');
  protected readonly showcase = TEMPLATES.slice(0, 4).map((t) => ({ meta: t, resume: sampleResume(t.id) }));
  protected readonly templateCount = TEMPLATES.length;

  protected readonly features = [
    { icon: 'sparkles', title: 'AI writing assistant', text: 'Generate summaries, rewrite bullet points with strong action verbs and get role-specific suggestions in one click.' },
    { icon: 'template', title: 'Recruiter-approved templates', text: 'Modern, professional and ATS-friendly designs. Switch templates at any time without losing content.' },
    { icon: 'target', title: 'Job match analysis', text: 'Paste a job posting to see your keyword match score and exactly what to add to beat applicant tracking systems.' },
    { icon: 'gauge', title: 'Resume strength score', text: 'A live checklist tells you what is missing — from quantified achievements to the ideal summary length.' },
    { icon: 'file-down', title: 'PDF, Word & print', text: 'Download a pixel-perfect PDF, an editable .docx or a text-selectable print PDF. Free, always.' },
    { icon: 'shield', title: 'Private by design', text: 'No account required. Everything is saved in your own browser — nothing is uploaded to our servers.' },
  ];

  protected readonly steps = [
    { n: 1, title: 'Pick a template', text: 'Browse designs by style and choose your colors and fonts.' },
    { n: 2, title: 'Fill in with AI help', text: 'A guided step-by-step editor with expert suggestions for your role.' },
    { n: 3, title: 'Download & apply', text: 'Export to PDF or Word and start applying with confidence.' },
  ];

  protected readonly faqs = [
    { q: 'Is it really free?', a: 'Yes. Every template, the built-in AI assistant and all download formats are free with no watermark and no sign-up.' },
    { q: 'Where is my data stored?', a: 'Only in your browser (localStorage). We never receive your resume. Use “Export JSON” to back it up or move it to another device.' },
    { q: 'How does the AI work?', a: 'The built-in assistant runs locally using a curated phrase library and writing rules. For deeper, context-aware rewriting you can connect Claude by Anthropic with your own API key.' },
    { q: 'Are the templates ATS-friendly?', a: 'All templates use real text. Summit and Atlas are single-column designs built specifically for applicant tracking systems. For the best parsing, use “Print / Save as PDF” or the Word export.' },
    { q: 'Can I make more than one resume?', a: 'Absolutely — create tailored versions for each application, duplicate them, and manage them all from “My Resumes”.' },
  ];
}
