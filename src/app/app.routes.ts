import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Para Dyane ♥',
    loadComponent: () =>
      import('./pages/expediente/expediente.component').then((m) => m.ExpedienteComponent),
  },
  { path: '**', redirectTo: '' },
];
