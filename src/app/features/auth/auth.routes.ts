import { Routes } from '@angular/router';
import { Login} from './components/login/login';
import { Register} from './components/register/register';
import { ForgotPassword} from './components/forgot-password/forgot-password';
import { CheckEmail } from './components/check-email/check-email';
import { VerifyEmail } from './components/verify-email/verify-email';
import { GetStarted } from './components/get-started/get-started';
import { ResetPassword } from './components/reset-password/reset-password';
import { SendEmail } from './components/send-email/send-email';

export const routes: Routes = [
  { path: 'login', component: Login},
  { path: 'register', component: Register},
  {path: 'email-check', component: CheckEmail},
  {path: 'verify-email', component: VerifyEmail},
  {path: 'get-started', component: GetStarted},
  { path: 'forgot-password', component: ForgotPassword},
  { path: 'reset-password', component: ResetPassword},
  { path: 'send-email', component: SendEmail},
  { path: '', redirectTo: 'email-check', pathMatch: 'full' }
];
