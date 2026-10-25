/**
 * Pre-written, role-specific content used by the built-in (offline) assistant.
 * All phrases are original text written for this project.
 */
export interface RolePack {
  role: string;
  keywords: string[];
  focus: string;
  bullets: string[];
  skills: string[];
}

export const ROLE_PACKS: RolePack[] = [
  {
    role: 'Software Engineer',
    keywords: ['software', 'developer', 'engineer', 'programmer', 'frontend', 'backend', 'full stack', 'fullstack', 'web', 'angular', 'react', 'java', '.net', 'devops', 'sre'],
    focus: 'building reliable, scalable software',
    bullets: [
      'Designed and shipped features used by 100K+ users, collaborating closely with product and design',
      'Reduced API response times by 40% by profiling bottlenecks and introducing caching',
      'Improved test coverage from 55% to 90%, cutting production incidents by a third',
      'Migrated legacy services to a cloud-native architecture with zero downtime',
      'Automated CI/CD pipelines, shortening release cycles from weekly to daily',
      'Led code reviews and mentored junior engineers on clean code and design patterns',
      'Built reusable component libraries that accelerated delivery across teams',
      'Partnered with stakeholders to translate business requirements into technical designs',
    ],
    skills: ['TypeScript', 'JavaScript', 'Angular', 'React', 'Node.js', 'Java', 'Python', 'SQL', 'REST APIs', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git', 'CI/CD', 'Unit Testing', 'Microservices', 'Agile / Scrum'],
  },
  {
    role: 'Data Analyst',
    keywords: ['data', 'analyst', 'analytics', 'bi', 'business intelligence', 'scientist', 'machine learning', 'ml'],
    focus: 'turning data into decisions',
    bullets: [
      'Built executive dashboards in Power BI that became the single source of truth for KPIs',
      'Automated weekly reporting with SQL and Python, saving 12 analyst hours per week',
      'Identified churn drivers through cohort analysis, informing a retention plan that cut churn by 15%',
      'Designed A/B tests and communicated statistically sound recommendations to leadership',
      'Cleaned and modelled data from 8+ sources into a reliable analytics warehouse',
      'Partnered with finance to build forecasting models with 95% accuracy',
    ],
    skills: ['SQL', 'Python', 'Power BI', 'Tableau', 'Excel', 'Statistics', 'A/B Testing', 'Data Modeling', 'ETL', 'pandas', 'Machine Learning', 'Data Visualization', 'Storytelling'],
  },
  {
    role: 'Product Manager',
    keywords: ['product manager', 'product owner', 'pm', 'product lead', 'product'],
    focus: 'delivering products customers love',
    bullets: [
      'Owned the roadmap for a product line generating $5M ARR, prioritising by customer impact',
      'Launched 3 major features that increased activation by 22% within one quarter',
      'Ran discovery interviews with 50+ customers to validate problems before building',
      'Aligned engineering, design, marketing and sales around clear goals and success metrics',
      'Defined OKRs and tracked product metrics to guide data-informed decisions',
      'Wrote clear PRDs and user stories that reduced rework and scope creep',
    ],
    skills: ['Product Strategy', 'Roadmapping', 'User Research', 'Agile / Scrum', 'Jira', 'OKRs', 'A/B Testing', 'Stakeholder Management', 'Analytics', 'Go-to-Market', 'Prioritization', 'Wireframing'],
  },
  {
    role: 'Designer',
    keywords: ['designer', 'ux', 'ui', 'graphic', 'visual', 'creative', 'art director', 'illustrator'],
    focus: 'crafting intuitive, accessible experiences',
    bullets: [
      'Redesigned core user journeys, improving task completion rates by 30%',
      'Created and maintained a design system that ensured consistency across products',
      'Conducted usability testing and translated insights into prioritised improvements',
      'Produced high-fidelity prototypes that aligned stakeholders early and reduced rework',
      'Collaborated with engineers to ship pixel-perfect, accessible interfaces',
      'Developed brand guidelines and visual assets for multi-channel campaigns',
    ],
    skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Systems', 'Wireframing', 'Accessibility (WCAG)', 'Interaction Design', 'Typography', 'Usability Testing', 'HTML & CSS'],
  },
  {
    role: 'Project Manager',
    keywords: ['project manager', 'program manager', 'scrum master', 'delivery manager', 'pmo', 'coordinator'],
    focus: 'delivering complex projects on time and on budget',
    bullets: [
      'Managed a portfolio of 10+ concurrent projects with combined budgets of $3M',
      'Delivered a company-wide ERP rollout two weeks ahead of schedule and 8% under budget',
      'Established risk registers and status reporting that improved executive visibility',
      'Facilitated sprint ceremonies for three cross-functional agile teams',
      'Negotiated scope and timelines with vendors and stakeholders to protect delivery',
      'Introduced project management tooling that increased on-time delivery by 25%',
    ],
    skills: ['Project Planning', 'Risk Management', 'Budgeting', 'Agile / Scrum', 'Waterfall', 'MS Project', 'Jira', 'Stakeholder Communication', 'Resource Planning', 'PMP', 'Change Management'],
  },
  {
    role: 'Sales',
    keywords: ['sales', 'account executive', 'business development', 'account manager', 'bdr', 'sdr', 'territory'],
    focus: 'building relationships and exceeding revenue targets',
    bullets: [
      'Exceeded annual quota by 132%, closing $2.4M in new business',
      'Built a qualified pipeline of 150+ prospects through targeted outbound campaigns',
      'Grew key account revenue by 45% through consultative upselling',
      'Shortened the average sales cycle by 20 days by refining discovery and demos',
      'Maintained 95% client retention by delivering proactive account reviews',
      'Collaborated with marketing to design campaigns that doubled inbound leads',
    ],
    skills: ['Consultative Selling', 'Prospecting', 'Negotiation', 'CRM (Salesforce)', 'Pipeline Management', 'Cold Calling', 'Account Management', 'Forecasting', 'Presentation Skills', 'Closing'],
  },
  {
    role: 'Marketing',
    keywords: ['marketing', 'seo', 'content', 'brand', 'growth', 'social media', 'digital', 'communications', 'pr'],
    focus: 'growing brands through data-driven campaigns',
    bullets: [
      'Planned and launched multi-channel campaigns that generated 5,000+ qualified leads',
      'Increased organic traffic by 120% through SEO strategy and content optimisation',
      'Managed a $500K annual paid media budget with a 4.2x return on ad spend',
      'Grew social media following by 60% in 12 months through a consistent content calendar',
      'Ran email nurture programs that lifted conversion rates by 18%',
      'Produced market research and competitor analysis to guide positioning',
    ],
    skills: ['Digital Marketing', 'SEO / SEM', 'Content Strategy', 'Google Analytics', 'Email Marketing', 'Social Media', 'Copywriting', 'HubSpot', 'Paid Advertising', 'Brand Management', 'Marketing Automation'],
  },
  {
    role: 'Customer Service',
    keywords: ['customer', 'support', 'service', 'call center', 'help desk', 'representative', 'receptionist', 'client'],
    focus: 'delivering outstanding customer experiences',
    bullets: [
      'Resolved 60+ customer inquiries daily across phone, email and chat with a 96% satisfaction score',
      'Reduced average handling time by 25% by creating a shared knowledge base',
      'Trained 10 new team members on products, tools and service standards',
      'Turned escalated complaints into retained accounts through empathy and follow-through',
      'Identified recurring issues and fed insights back to product teams',
    ],
    skills: ['Customer Service', 'Communication', 'Problem Solving', 'Conflict Resolution', 'Zendesk', 'CRM Software', 'Active Listening', 'Multitasking', 'Time Management', 'Data Entry'],
  },
  {
    role: 'Finance & Accounting',
    keywords: ['account', 'accountant', 'finance', 'financial', 'auditor', 'bookkeeper', 'controller', 'tax', 'payroll'],
    focus: 'ensuring accurate, compliant financial operations',
    bullets: [
      'Managed month-end close for a $50M business, reducing close time from 10 to 6 days',
      'Prepared GAAP-compliant financial statements and management reports',
      'Reconciled 30+ balance sheet accounts monthly with zero audit findings',
      'Built budget and forecast models that improved cost visibility for department heads',
      'Streamlined accounts payable processes, capturing $80K in early-payment discounts',
    ],
    skills: ['Financial Reporting', 'GAAP', 'Reconciliation', 'Budgeting & Forecasting', 'Excel (Advanced)', 'QuickBooks', 'SAP', 'Accounts Payable', 'Accounts Receivable', 'Auditing', 'Tax Preparation'],
  },
  {
    role: 'Healthcare',
    keywords: ['nurse', 'rn', 'medical', 'healthcare', 'clinical', 'patient', 'physician', 'pharmac', 'therapist', 'caregiver'],
    focus: 'providing safe, compassionate patient care',
    bullets: [
      'Provided direct care to 6–8 patients per shift in a fast-paced medical-surgical unit',
      'Administered medications and treatments accurately in line with care plans',
      'Educated patients and families on discharge plans, improving adherence',
      'Collaborated with physicians and multidisciplinary teams to coordinate care',
      'Maintained accurate electronic health records in compliance with HIPAA',
    ],
    skills: ['Patient Care', 'Medication Administration', 'Electronic Health Records', 'BLS / ACLS', 'Patient Education', 'Vital Signs Monitoring', 'HIPAA Compliance', 'Care Planning', 'Infection Control', 'Compassion'],
  },
  {
    role: 'Teacher',
    keywords: ['teacher', 'educator', 'tutor', 'instructor', 'professor', 'lecturer', 'teaching', 'trainer'],
    focus: 'inspiring learners and improving outcomes',
    bullets: [
      'Planned and delivered engaging lessons for classes of 30+ students',
      'Raised standardised test scores by 15% through differentiated instruction',
      'Integrated digital learning tools to increase student participation',
      'Communicated progress with parents through regular conferences and reports',
      'Led after-school clubs that grew enrolment by 40%',
    ],
    skills: ['Lesson Planning', 'Classroom Management', 'Curriculum Development', 'Differentiated Instruction', 'Student Assessment', 'Google Classroom', 'Communication', 'Mentoring', 'Special Education'],
  },
  {
    role: 'Operations',
    keywords: ['operations', 'logistics', 'supply chain', 'warehouse', 'procurement', 'manufacturing', 'production', 'inventory'],
    focus: 'optimising processes and operational efficiency',
    bullets: [
      'Optimised warehouse layout, improving pick rates by 28%',
      'Reduced inventory carrying costs by 15% through demand-driven replenishment',
      'Implemented lean practices that cut process waste and lead times',
      'Managed vendor relationships and negotiated contracts saving $200K annually',
      'Tracked KPIs and led continuous improvement initiatives across shifts',
    ],
    skills: ['Process Improvement', 'Lean / Six Sigma', 'Supply Chain Management', 'Inventory Control', 'Vendor Management', 'ERP Systems', 'Logistics', 'KPI Tracking', 'Forecasting', 'Safety Compliance'],
  },
  {
    role: 'Human Resources',
    keywords: ['hr', 'human resources', 'recruiter', 'talent', 'people', 'recruiting'],
    focus: 'attracting, developing and retaining talent',
    bullets: [
      'Managed full-cycle recruiting for 40+ roles per year, reducing time-to-hire by 30%',
      'Designed onboarding programs that raised 90-day retention to 94%',
      'Advised managers on employee relations, performance and policy',
      'Launched engagement surveys and action plans that improved scores by 12 points',
      'Administered benefits and HRIS data with full compliance',
    ],
    skills: ['Talent Acquisition', 'Onboarding', 'Employee Relations', 'HRIS', 'Performance Management', 'Compensation & Benefits', 'Labour Law Compliance', 'Interviewing', 'Workday', 'Training & Development'],
  },
  {
    role: 'Manager',
    keywords: ['manager', 'director', 'head of', 'lead', 'supervisor', 'vp', 'chief', 'executive', 'cto', 'ceo'],
    focus: 'leading high-performing teams and driving results',
    bullets: [
      'Led a team of 15 across three functions, consistently exceeding quarterly targets',
      'Defined strategy and OKRs that grew department revenue by 35% year over year',
      'Hired and developed talent, promoting 5 team members into leadership roles',
      'Managed a $4M budget with disciplined cost control and investment planning',
      'Championed process improvements that increased team productivity by 20%',
    ],
    skills: ['Leadership', 'Strategic Planning', 'Team Building', 'Budget Management', 'Coaching & Mentoring', 'Stakeholder Management', 'Decision Making', 'Change Management', 'Performance Management', 'Communication'],
  },
];

export const GENERIC_PACK: RolePack = {
  role: 'Professional',
  keywords: [],
  focus: 'delivering high-quality results',
  bullets: [
    'Delivered projects on time while maintaining high quality standards',
    'Collaborated with cross-functional teams to achieve shared goals',
    'Improved team processes, increasing efficiency by 20%',
    'Communicated progress and results clearly to stakeholders',
    'Trained and supported new colleagues to get up to speed quickly',
    'Recognised by leadership for reliability and initiative',
  ],
  skills: ['Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Microsoft Office', 'Adaptability', 'Attention to Detail', 'Leadership', 'Critical Thinking', 'Customer Focus'],
};

export function findRolePack(title: string): RolePack {
  const t = (title || '').toLowerCase();
  if (!t.trim()) return GENERIC_PACK;
  let best: RolePack | null = null;
  let bestScore = 0;
  for (const pack of ROLE_PACKS) {
    const score = pack.keywords.reduce((s, k) => (t.includes(k) ? s + k.length : s), 0);
    if (score > bestScore) {
      best = pack;
      bestScore = score;
    }
  }
  return best ?? GENERIC_PACK;
}

/** "-ing" forms that follow weak openings ("responsible for building…") → past-tense action verbs. */
export const GERUND_TO_PAST: Record<string, string> = {
  building: 'Built', managing: 'Managed', developing: 'Developed', leading: 'Led', creating: 'Created',
  designing: 'Designed', maintaining: 'Maintained', implementing: 'Implemented', coordinating: 'Coordinated',
  handling: 'Handled', supporting: 'Supported', writing: 'Wrote', testing: 'Tested', running: 'Ran',
  planning: 'Planned', training: 'Trained', organizing: 'Organized', organising: 'Organised', analyzing: 'Analyzed',
  analysing: 'Analysed', preparing: 'Prepared', monitoring: 'Monitored', overseeing: 'Oversaw', delivering: 'Delivered',
  improving: 'Improved', ensuring: 'Ensured', reviewing: 'Reviewed', deploying: 'Deployed', migrating: 'Migrated',
  automating: 'Automated', optimizing: 'Optimized', optimising: 'Optimised', resolving: 'Resolved', providing: 'Provided',
  conducting: 'Conducted', processing: 'Processed', tracking: 'Tracked', reporting: 'Reported', launching: 'Launched',
  mentoring: 'Mentored', collaborating: 'Collaborated', communicating: 'Communicated', negotiating: 'Negotiated',
  recruiting: 'Recruited', onboarding: 'Onboarded', selling: 'Sold', teaching: 'Taught', assisting: 'Assisted',
  establishing: 'Established', defining: 'Defined', producing: 'Produced', researching: 'Researched',
  integrating: 'Integrated', configuring: 'Configured', administering: 'Administered', scheduling: 'Scheduled',
};

/** Openings that, followed by a gerund, can become a direct action verb ("responsible for building" → "Built"). */
export const OWNERSHIP_OPENING =
  /^(?:i\s+)?(?:was\s+)?(?:responsible\s+for|in\s+charge\s+of|tasked\s+with|worked\s+on|charged\s+with)\s+(\w+ing)\b\s*/i;

/** Base verbs after "helped" — "helped build" is kept as-is, "helped customers" becomes "Supported customers". */
export const HELP_VERBS = new Set(
  'build create develop design implement launch improve reduce increase manage deliver plan organize organise run write migrate automate grow drive lead set establish define streamline cut boost raise secure'.split(' '),
);

/** Lower-case technology and business terms → their standard spelling. */
export const TERM_CASE: Record<string, string> = {
  api: 'API', apis: 'APIs', angular: 'Angular', aws: 'AWS', azure: 'Azure', gcp: 'GCP', sql: 'SQL', nosql: 'NoSQL',
  ui: 'UI', ux: 'UX', javascript: 'JavaScript', typescript: 'TypeScript', react: 'React', 'node.js': 'Node.js',
  nodejs: 'Node.js', html: 'HTML', css: 'CSS', 'ci/cd': 'CI/CD', kpi: 'KPI', kpis: 'KPIs', crm: 'CRM', seo: 'SEO',
  python: 'Python', java: 'Java', docker: 'Docker', kubernetes: 'Kubernetes', github: 'GitHub', jira: 'Jira',
  salesforce: 'Salesforce', excel: 'Excel', 'power bi': 'Power BI', tableau: 'Tableau', sap: 'SAP', erp: 'ERP',
  b2b: 'B2B', b2c: 'B2C', saas: 'SaaS', ios: 'iOS', android: 'Android', mongodb: 'MongoDB', postgresql: 'PostgreSQL',
  mysql: 'MySQL', graphql: 'GraphQL', '.net': '.NET', 'c#': 'C#', qa: 'QA', hr: 'HR', roi: 'ROI', okrs: 'OKRs',
};

/** Weak openings → strong action verbs. Ordered longest-first so multi-word phrases match before single words. */
export const WEAK_PHRASES: [RegExp, string][] = [
  [/^(i\s+)?was\s+responsible\s+for\s+/i, 'Owned '],
  [/^responsible\s+for\s+/i, 'Owned '],
  [/^(i\s+)?was\s+in\s+charge\s+of\s+/i, 'Directed '],
  [/^in\s+charge\s+of\s+/i, 'Directed '],
  [/^(i\s+)?(was\s+)?involved\s+in\s+/i, 'Contributed to '],
  [/^(i\s+)?participated\s+in\s+/i, 'Contributed to '],
  [/^(i\s+)?assisted\s+(with|in)\s+/i, 'Supported '],
  [/^(i\s+)?worked\s+on\s+/i, 'Contributed to '],
  [/^(i\s+)?worked\s+with\s+/i, 'Partnered with '],
  [/^(i\s+)?dealt\s+with\s+/i, 'Resolved '],
  [/^(i\s+)?handled\s+/i, 'Managed '],
  [/^(i\s+)?did\s+/i, 'Executed '],
  [/^(i\s+)?made\s+/i, 'Created '],
  [/^(i\s+)?used\s+/i, 'Leveraged '],
  [/^(i\s+)?tasked\s+with\s+/i, 'Delivered '],
  [/^duties\s+included\s+/i, 'Performed '],
  [/^(i\s+)?worked\s+as\s+/i, 'Served as '],
];

/** Present-tense verbs to past tense for previous roles. */
export const PRESENT_TO_PAST: Record<string, string> = {
  manage: 'Managed', lead: 'Led', develop: 'Developed', build: 'Built', create: 'Created', design: 'Designed',
  implement: 'Implemented', coordinate: 'Coordinated', support: 'Supported', maintain: 'Maintained', drive: 'Drove',
  own: 'Owned', deliver: 'Delivered', analyze: 'Analyzed', analyse: 'Analysed', write: 'Wrote', train: 'Trained',
  oversee: 'Oversaw', run: 'Ran', plan: 'Planned', improve: 'Improved', handle: 'Handled', prepare: 'Prepared',
  ensure: 'Ensured', monitor: 'Monitored', collaborate: 'Collaborated', organize: 'Organized', organise: 'Organised',
};

export const FILLER_WORDS = /\b(very|really|basically|actually|various|successfully|effectively|in order to)\b\s*/gi;

export const STOP_WORDS = new Set(
  ('a an and are as at be by for from has have in is it its of on or that the to was were will with you your our we ' +
    'they this these those their about into who what when where which while within without also can able must should ' +
    'may per across over under such than then them there here more most other some any each every all not no yes ' +
    'job role team work working company candidate candidates experience years year strong excellent good great new ' +
    'ability skills required preferred plus including include etc using use well highly responsibilities requirements ' +
    'qualifications position looking join us opportunity environment based help make ensure support').split(' '),
);
