import { Resume } from '../models/resume.model';
import { defaultTheme } from './templates';

/** Fictional demo content used for template thumbnails and the "fill with example" action. */
export function sampleResume(templateId = 'aurora'): Resume {
  return {
    id: 'sample',
    name: 'Sample resume',
    templateId,
    theme: defaultTheme(templateId),
    contact: {
      firstName: 'Jordan',
      lastName: 'Rivera',
      title: 'Senior Product Designer',
      email: 'jordan.rivera@example.com',
      phone: '+1 555 010 2030',
      city: 'Austin, TX',
      country: 'USA',
      linkedin: 'linkedin.com/in/jordan-rivera',
      website: 'jordanrivera.design',
      photo: '',
    },
    summary:
      'Product designer with 8+ years of experience shaping B2B and consumer products used by millions. ' +
      'Combines user research, systems thinking and hands-on prototyping to ship accessible, measurable experiences. ' +
      'Known for building design systems that cut delivery time and for mentoring high-performing teams.',
    experience: [
      {
        id: 'e1', title: 'Senior Product Designer', employer: 'Northwind Analytics', city: 'Austin, TX',
        startDate: '2021-03', endDate: '', current: true,
        description:
          'Led end-to-end redesign of the analytics dashboard, lifting weekly active usage by 34%\n' +
          'Built and scaled a 120-component design system adopted by 6 product squads\n' +
          'Partnered with PMs and engineers to define roadmap priorities using research insights\n' +
          'Mentored 4 designers through structured critiques and career plans',
      },
      {
        id: 'e2', title: 'Product Designer', employer: 'Bluebird Commerce', city: 'Denver, CO',
        startDate: '2017-06', endDate: '2021-02', current: false,
        description:
          'Redesigned checkout flow, reducing cart abandonment by 18%\n' +
          'Ran 40+ usability sessions and translated findings into actionable design changes\n' +
          'Introduced accessibility standards that brought the platform to WCAG 2.1 AA',
      },
      {
        id: 'e3', title: 'UI Designer', employer: 'Pixel & Pine Studio', city: 'Boulder, CO',
        startDate: '2015-09', endDate: '2017-05', current: false,
        description:
          'Delivered web and mobile interfaces for 15+ clients across retail and healthcare\n' +
          'Created interactive prototypes that shortened client approval cycles by two weeks',
      },
    ],
    education: [
      {
        id: 'ed1', school: 'University of Colorado', degree: 'B.A.', field: 'Interaction Design',
        city: 'Boulder, CO', startDate: '2011-09', endDate: '2015-05', current: false,
        details: 'Graduated magna cum laude',
      },
    ],
    skills: [
      { id: 's1', name: 'Figma', level: 5 },
      { id: 's2', name: 'Design Systems', level: 5 },
      { id: 's3', name: 'User Research', level: 4 },
      { id: 's4', name: 'Prototyping', level: 5 },
      { id: 's5', name: 'HTML & CSS', level: 4 },
      { id: 's6', name: 'Accessibility', level: 4 },
    ],
    projects: [
      {
        id: 'p1', name: 'Open Source Icon Kit', link: 'github.com/jrivera/icons',
        description: '300+ open icons used by 2,000+ developers',
      },
    ],
    certifications: [
      { id: 'c1', name: 'Certified Usability Analyst', issuer: 'Human Factors Intl.', date: '2019-04' },
    ],
    languages: [
      { id: 'l1', name: 'English', level: 'Native' },
      { id: 'l2', name: 'Spanish', level: 'Fluent' },
    ],
    awards: 'Design Excellence Award, Northwind Analytics (2023)',
    interests: 'Ceramics, trail running, open-source design',
    createdAt: 0,
    updatedAt: 0,
  };
}
