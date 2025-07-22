import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { sellerGuard } from './core/guards/seller-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./features/home/home-container/home-container').then(m => m.HomeContainer),
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
  },
  {
    path: 'categories',
    loadChildren: () => import('./features/categories/categories.routes').then(m => m.routes),
    data: { preload: true }
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.routes),
    canActivate: [adminGuard]
  },
  {
    path: 'seller',
    loadChildren: () => import('./features/seller/seller.routes').then(m => m.routes),
    canActivate: [sellerGuard]
  },
  {
    path: 'seller-auth',
    loadChildren: () => import('./features/seller-auth/seller-auth.routes').then(m => m.routes)
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.routes').then(m => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart-module').then(m => m.CartModule)
  },
  {
    path: 'vendor',
    loadChildren: () => import('./features/vendor/vendor.routes').then(m => m.routes)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
