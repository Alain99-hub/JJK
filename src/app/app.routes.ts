import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Expediente clasificado — Departamento Técnico de Sentimientos No Controlados',
    loadComponent: () =>
      import('./pages/expediente/expediente.component').then((m) => m.ExpedienteComponent),
  },
  { path: '**', redirectTo: '' },
];
