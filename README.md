# Resume Studio — Free AI Resume Builder

A modern, privacy-first resume builder built with **Angular 22**. Pick a template, fill in a guided
step-by-step editor with AI help, and download a recruiter-ready **PDF** or **Word** file.
There is no backend: resumes are stored in the visitor's browser, so the app can be hosted on any
static web server for free.

## Features

| Area | What you get |
| --- | --- |
| **Templates** | 8 designs (Aurora, Summit, Meridian, Nordic, Executive, Catalyst, Atlas, Horizon) filtered by style, columns and photo support. 12 accent colors + custom color, 7 fonts, 3 font sizes, A4 / Letter. |
| **Guided builder** | Heading → Work history → Education → Skills → Summary → Additional → Design & download, with a live, zoomable preview showing page breaks. Drag-and-drop reordering, autosave, multiple resumes. |
| **AI assistant** | *Built-in (free, offline):* role-based phrase library for 14 job families, action-verb rewriting, summary generator, skill suggestions, job-description keyword match. *Claude (optional):* context-aware rewriting and tailoring using the visitor's own Anthropic API key. |
| **Quality checks** | Resume-strength score with a fix-it checklist; ATS job-match score with missing keywords. |
| **Export** | High-resolution PDF with smart page breaks, editable ATS-friendly `.docx`, browser print (vector PDF with selectable text), JSON backup/import. |
| **Privacy** | No sign-up, no tracking, no server. Data lives in `localStorage`. |

## Run locally

Requires Node.js 20.19+ (24 recommended).

```bash
npm install
npm start            # http://localhost:4200
npm run build        # production build → dist/resume-studio/browser
```

## Deploy to the public internet

The production build is a folder of static files (`dist/resume-studio/browser`). Any static host works;
ready-made configs are included:

| Host | How |
| --- | --- |
| **AWS** (S3 + CloudFront) | See [Deploy to AWS](#deploy-to-aws) below. `.github/workflows/deploy-aws.yml` builds and publishes on every push to `main`. |
| **GitHub Pages** (free) | *Settings → Pages → Source: GitHub Actions*, then run *Deploy to GitHub Pages* from the Actions tab (`.github/workflows/deploy-pages.yml`). |
| **Netlify** (free tier) | "Add new site → Import from Git", or drag-and-drop the build folder. `netlify.toml` sets the build command, SPA redirects and security headers. |
| **Vercel** (free tier) | "Add New → Project → Import" the repo. `vercel.json` handles the rest. |
| **Any server / cloud VM** | `docker build -t resume-studio . && docker run -p 80:80 resume-studio` (nginx, gzip, caching and SPA fallback configured in `nginx.conf`). |

All routes are client-side, so the host must serve `index.html` for unknown paths. Every config above does this.

### Deploy to AWS

The site is served from a private S3 bucket through CloudFront (HTTPS, HTTP/3, compression, security
headers, SPA fallback). GitHub Actions signs in to AWS over OIDC, so no AWS access keys are stored in GitHub.

1. **Create the AWS resources (once).** In the AWS console open *CloudFormation → Create stack → With new
   resources*, choose *Upload a template file* and select `aws/cloudformation.yml`. Name the stack
   (e.g. `resume-studio`) and keep the defaults. Set *CreateGitHubOIDCProvider* to `false` only if
   *IAM → Identity providers* already lists `token.actions.githubusercontent.com`. Tick the IAM
   acknowledgement and submit. The stack takes about 5 minutes, mostly for CloudFront.
2. **Connect the repository (once).** In GitHub open *Settings → Secrets and variables → Actions →
   Variables* and add four repository variables using the stack's *Outputs* tab:

   | Variable | Stack output |
   | --- | --- |
   | `AWS_REGION` | `AwsRegion` |
   | `AWS_ROLE_ARN` | `AwsRoleArn` |
   | `AWS_S3_BUCKET` | `AwsS3Bucket` |
   | `AWS_CLOUDFRONT_DISTRIBUTION_ID` | `AwsCloudFrontDistributionId` |

3. **Deploy.** Open *Actions → Deploy to AWS → Run workflow*. After that, every push to `main` deploys
   automatically. The site is at the stack's `SiteUrl` output (`https://<id>.cloudfront.net`).

For a custom domain, request a certificate in AWS Certificate Manager in **us-east-1**. Then add the domain
under *Alternate domain names* on the CloudFront distribution and point a DNS CNAME (or Route 53 alias) at
the CloudFront address.

## AI configuration

* **Built-in assistant** — on by default, free, runs entirely in the browser
  (`src/app/core/ai/offline-ai.ts`, content in `src/app/core/data/phrase-library.ts`).
* **Claude** — visitors open *AI settings* in the header, choose *Claude by Anthropic* and paste their own
  API key. Requests go directly from the browser to the Anthropic API with the official
  `@anthropic-ai/sdk` (model `claude-opus-5-5`). The key is stored only in that browser. No key is ever
  bundled into the site, so hosting it publicly costs you nothing.

## Project structure

```
src/app/
  core/
    ai/                 AI provider interface, built-in engine, Claude engine, service
    data/               templates registry, sample resume, phrase library
    models/             resume data model + helpers
    services/           storage, export (PDF/DOCX/print/JSON), scoring, toasts
  resume-templates/     renderer, scaled preview, 8 template components
  pages/                landing, templates gallery, my resumes, builder (+ steps)
  layout/ shared/       header, footer, logo, AI settings dialog, icons, month picker
```

### Adding a template

1. Create `src/app/resume-templates/templates/<name>.template.ts` extending `TemplateBase`
   (use the shared `rs-*` classes so page breaks work in PDF export).
2. Register it in `resume-renderer.component.ts` and add its metadata to `core/data/templates.ts`.

## Open-source licences

All runtime dependencies use permissive licences that allow commercial and public use:

| Package | Licence |
| --- | --- |
| Angular, Angular CDK | MIT |
| RxJS | Apache-2.0 |
| tslib | 0BSD |
| jsPDF, html2canvas-pro, docx | MIT |
| Lucide icons | ISC |
| @anthropic-ai/sdk | MIT |
| Inter, Manrope, Roboto, Lato, Source Serif 4, Merriweather, Playfair Display (via Fontsource) | SIL OFL 1.1 |

Template designs, copy and the phrase library are original to this project. The sample resume
uses a fictional person.

## License

MIT. See [LICENSE](LICENSE).
