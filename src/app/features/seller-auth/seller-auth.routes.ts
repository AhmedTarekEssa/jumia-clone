import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Verification } from './components/verification/verification';
import { SellerCheckEmail } from './components/check-email/check-email';
import { VendorCenter } from './components/vendor-center/vendor-center';
import { SellerRegister } from './components/seller-register/seller-register';
import { Welcome } from './components/welcome/welcome';

export const routes: Routes = [
  { path: 'login', component: Login ,pathMatch: 'full' },
  {path:'SellerRegister',component:SellerRegister,pathMatch: 'full'},
  {path:'welcome',component:Welcome,pathMatch: 'full'},
  // { path: 'register',
  //   loadChildren: () => import('./components/register/seller-register.routes').then(m => m.routes)
  // },
  /// register to sell on jumia second page 
  {path:'VendorCenter',component:VendorCenter,pathMatch: 'full'},
  { path: 'verification', component: Verification },
  {path: 'email-check', component: SellerCheckEmail},
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }
  // path '' redirect to welcome 
];
