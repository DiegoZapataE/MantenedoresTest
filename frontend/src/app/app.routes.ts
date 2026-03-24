import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/usuarios/usuarios').then((m) => m.UsuariosComponent),
  },

  {
    path: 'roles',
    loadComponent: () => import('./pages/roles/roles').then((m) => m.RolesComponent),
  },
  {
    path: 'variables',
    loadComponent: () => import('./pages/variables/variables').then((m) => m.VariablesComponent),
  },
];
