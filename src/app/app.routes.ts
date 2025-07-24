import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { sellerGuard } from './core/guards/seller-guard';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { SimpleLayout } from './shared/layouts/simple-layout/simple-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home-container/home-container').then(m => m.HomeContainer),
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'categories/:id',
        loadComponent: () => import('./features/categories/category-container/category-container').then(m => m.CategoryContainer),
        data: { preload: true }
      },
      {
        path: 'user',
        loadChildren: () => import('./features/user/user.routes').then(m => m.routes),
        canActivate: [AuthGuard]
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/components/cart-items/cart-items').then(m => m.CartItems),
        data: { preload: true }
      },
      {
        path: 'vendor',
        loadChildren: () => import('./features/vendor/vendor.routes').then(m => m.routes)
      },
      {
        path: 'Products/:id',
        loadComponent:() => import('./features/products/components/product-detail/product-detail').then(m => m.ProductDetailC),
      }
    ]
  },
  {
    path: '',
    component: SimpleLayout,
    children: [
      {
        path: 'login-register',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
      },
      {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes)
      },
      {
        path: 'seller-auth',
        loadChildren: () => import('./features/seller-auth/seller-auth.routes').then(m => m.routes)
      }
    ]
  },
  {
    path: 'admin',
    component: SimpleLayout,
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.routes)
  },
  {
    path: 'seller',
    component: SimpleLayout, // or create a separate SellerLayoutComponent
    canActivate: [sellerGuard],
    loadChildren: () => import('./features/seller/seller.routes').then(m => m.routes)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }



];
