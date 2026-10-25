import { Routes } from '@angular/router';
import { APP_NAME } from './app.constants';

export const routes: Routes = [
  {
    path: '',
    title: `${APP_NAME} — Free AI Resume Builder`,
    loadComponent: () => import('./pages/landing/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'templates',
    title: `Choose a template · ${APP_NAME}`,
    loadComponent: () => import('./pages/templates/templates.page').then((m) => m.TemplatesPage),
  },
  {
    path: 'resumes',
    title: `My resumes · ${APP_NAME}`,
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'builder/:id',
    title: `Resume builder · ${APP_NAME}`,
    loadComponent: () => import('./pages/builder/builder.page').then((m) => m.BuilderPage),
  },
  { path: '**', redirectTo: '' },
];
