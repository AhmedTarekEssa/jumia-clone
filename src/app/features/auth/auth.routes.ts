import { Routes } from '@angular/router';
import { Login} from './components/login/login';
import { Register} from './components/register/register';
import { ForgotPassword} from './components/forgot-password/forgot-password';

export const routes: Routes = [
  { path: 'login', component: Login},
  { path: 'register', component: Register},
  { path: 'forgot-password', component: ForgotPassword},
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
