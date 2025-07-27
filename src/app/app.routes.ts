import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
import { sellerGuard } from './core/guards/seller-guard';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { SimpleLayout } from './shared/layouts/simple-layout/simple-layout';
import { SellerWelcome } from './features/seller-auth/seller-welcome/seller-welcome';
import { AdminChat } from './features/admin/admin-chat/admin-chat';
import { SearchProducts } from './features/search-products/search-products';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/home/home-container/home-container').then(
            (m) => m.HomeContainer
          ),
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'categories/:id',
        loadComponent: () =>
          import(
            './features/categories/category-container/category-container'
          ).then((m) => m.CategoryContainer),
        data: { preload: true },
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./features/user/user.routes').then((m) => m.routes),
        canActivate: [AuthGuard],
      },
      {
        path: 'search-products',
        component: SearchProducts,
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/cart/components/cart-items/cart-items').then(
            (m) => m.CartItems
          ),
        data: { preload: true },
      },
      {
        path: 'vendor',
        loadChildren: () =>
          import('./features/vendor/vendor.routes').then((m) => m.routes),
      },
      {
        path: 'Products/:id',
        loadComponent: () =>
          import(
            './features/products/components/product-detail/product-detail'
          ).then((m) => m.ProductDetailC),
      },
    ],
  },
  {
    path: '',
    component: SimpleLayout,
    children: [
      {
        path: 'login-register',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.routes),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.routes),
      },
      {
        path: 'seller-auth',
        loadChildren: () =>
          import('./features/seller-auth/seller-auth.routes').then(
            (m) => m.routes
          ),
      },
    ],
  },
  {
    path: 'admin',

    component: SimpleLayout,
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.routes),
  },
  {
    path: 'seller',
    component: SimpleLayout, // or create a separate SellerLayoutComponent
    canActivate: [sellerGuard],
    loadChildren: () =>
      import('./features/seller/seller.routes').then((m) => m.routes),
  },

  {
    path: 'SellerAuth',
    component: SellerWelcome,
    loadChildren: () =>
      import('./features/seller-auth/seller-auth.routes').then((m) => m.routes),
  },
  ///////
  // create new path called SellerAuth
  ///Component SellerWelcomeComponent
  //// LoadChildren      loadChildren: () => import('./features/seller/seller-auth.routes').then(m => m.routes)
  /// من غير  gard
  {
    path: 'Products',
    loadChildren: () =>
      import('./features/products/product.routes').then((m) => m.routes),
  },
  {
    path: 'address',
    loadChildren: () =>
      import('../app/features/address/address.routes').then((m) => m.routes),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'chat-dashboard',
    component: AdminChat,
    // canActivate: [AuthGuard], // Apply an AuthGuard for admin role
    // data: { roles: ['Admin'] } // Pass role data for the guard
  },
  {
    path: 'search-products',
    component: SearchProducts,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
