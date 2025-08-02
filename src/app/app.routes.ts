import { Routes } from '@angular/router';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { SimpleLayout } from './shared/layouts/simple-layout/simple-layout';
import { SellerWelcome } from './features/seller-auth/seller-welcome/seller-welcome';
import { RoleGuard } from './core/guards/roles-guard-guard';
import { sellerGuard } from './core/guards/seller-guard';
import { SearchProducts } from './features/search-products/search-products';
import { ProductByBrand } from './features/products/components/product-by-brand/product-by-brand';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home-container/home-container').then(m => m.HomeContainer),
        pathMatch: 'full',
        canActivate: [RoleGuard],
        data: { roles: ['none', 'customer'] }
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'categories/:id',
        loadComponent: () => import('./features/categories/category-container/category-container').then(m => m.CategoryContainer),
        canActivate: [RoleGuard],
        data: { preload: true, roles: ['none', 'customer'] },
      },
      {
        path: 'user',
        loadChildren: () => import('./features/user/user.routes').then(m => m.routes),
        data: { roles: ['customer']},
        canActivate: [RoleGuard]
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/components/cart-items/cart-items').then(m => m.CartItems),
        data: { preload: true, roles: ['customer'] },
        canActivate: [RoleGuard]
      },
      {
        path: 'products-brand/:id',
        component: ProductByBrand,
        canActivate: [RoleGuard],
        data: { preload: true, roles: ['none', 'customer'] }

      },
      {
        path: 'search-products',
        component: SearchProducts,
        canActivate: [RoleGuard],
        data: { preload: true, roles: ['none', 'customer'] }
      },
      {
        path: 'vendor',
        loadChildren: () =>
          import('./features/vendor/vendor.routes').then((m) => m.routes),
      },
      {
        path: 'Products/:id',
        loadComponent: () => import('./features/products/components/product-detail/product-detail').then(m => m.ProductDetailC),
        data: { roles: ['none', 'customer'] },
        canActivate: [RoleGuard],

      },
      {
        path: 'success',
        loadComponent: () => import('./shared/components/order-success/order-success').then(m => m.OrderSuccess)
      },
      {
        path: 'Products/:id/reviews',
        loadComponent: () => import('./features/products/components/product-review-show-all/product-review-show-all').then(m => m.ProductReviewShowAll),
        canActivate: [RoleGuard],
        data: { preload: true, roles: ['none', 'customer'] }

      },
      {
        path: 'place-order',
        loadComponent: () => import('./features/checkout/place-order/place-order').then(m => m.PlaceOrder),
        canActivate: [RoleGuard],
        data: { roles: ['customer'] }
      },
    ]
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
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.routes),
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'seller',
    component: SimpleLayout,
    loadChildren: () => import('./features/seller/seller.routes').then(m => m.routes),
    canActivate: [RoleGuard, sellerGuard],
    data: { roles: ['seller'] }
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized').then(m => m.Unauthorized)
  },
  {
    path: 'rejected',
    loadComponent: () => import('./features/seller/components/rejected-request/rejected-request').then(m => m.RejectedRequest),
    canActivate: [RoleGuard],
    data: { roles: ['seller'] }
  },
  {
    path: 'pending-review',
    loadComponent: () => import('./features/seller/components/pending-review/pending-review').then(m => m.PendingReview),
    canActivate: [RoleGuard],
    data: { roles: ['seller'] }
  },
  {
    path: 'SellerAuth',
    component: SellerWelcome,
    loadChildren: () =>
      import('./features/seller-auth/seller-auth.routes').then((m) => m.routes),
  },
  // {
  //   path: 'Products',
  //   loadChildren: () =>
  //     import('./features/products/product.routes').then((m) => m.routes),
  // },
  // {
  //   path: 'address',
  //   loadChildren: () =>
  //     import('../app/features/address/address.routes').then((m) => m.routes),
  // },
  { path: '**', redirectTo: '', pathMatch: 'full'}
];
