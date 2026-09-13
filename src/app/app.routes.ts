import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Para Astrid ♥',
    loadComponent: () =>
      import('./pages/expediente/expediente.component').then((m) => m.ExpedienteComponent),
  },
  { path: '**', redirectTo: '' },
];
