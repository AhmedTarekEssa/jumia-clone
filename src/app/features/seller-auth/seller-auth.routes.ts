import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Verification } from './components/verification/verification';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register',
    loadChildren: () => import('./components/register/seller-register.routes').then(m => m.routes)
  },
  { path: 'verification', component: Verification },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
