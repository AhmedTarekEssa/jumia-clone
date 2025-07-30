import { Routes } from '@angular/router';
import { MainLayout } from './shared/layouts/main-layout/main-layout';
import { SimpleLayout } from './shared/layouts/simple-layout/simple-layout';
import { SellerWelcome } from './features/seller-auth/seller-welcome/seller-welcome';
import { RoleGuard } from './core/guards/roles-guard-guard';
import { AdminChat } from './features/admin/admin-chat/admin-chat';
import { SearchProducts } from './features/search-products/search-products';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home-container/home-container').then(m => m.HomeContainer),
        pathMatch: 'full',
        // canActivate: [RoleGuard],
        data: { role: ['none', 'customer'] }

      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'categories/:id',
        loadComponent: () => import('./features/categories/category-container/category-container').then(m => m.CategoryContainer),
        // canActivate: [RoleGuard],

        data: { preload: true, role: ['none', 'customer'] },

      },
      {
        path: 'user',
        loadChildren: () => import('./features/user/user.routes').then(m => m.routes),
        data: { role: [ 'customer']},
        canActivate: [RoleGuard]
      },
      {
        path: 'cart',
        loadComponent: () => import('./features/cart/components/cart-items/cart-items').then(m => m.CartItems),
        data: { preload: true, role: ['Customer'] },
        canActivate: [RoleGuard]
      },
      {
        path: 'search-products',
        component: SearchProducts,
      },
      {
        path: 'vendor',
        loadChildren: () =>
          import('./features/vendor/vendor.routes').then((m) => m.routes),
      },
      {
        path: 'Products/:id',
        loadComponent: () => import('./features/products/components/product-detail/product-detail').then(m => m.ProductDetailC),
        // canActivate: [RoleGuard],
        data: { role: ['none', 'customer'] }

      },
      {
        path: 'seccess',
        loadComponent:()=>import('./shared/components/order-success/order-success').then(m => m.OrderSuccess)
      },
      {
        path: 'Products/:id/reviews',
        loadComponent: () => import('./features/products/components/product-review-show-all/product-review-show-all').then(m => m.ProductReviewShowAll),
        // canActivate: [RoleGuard],
        data: { role: ['none', 'customer'] }

      },
      {
        path: 'place-order',
        loadComponent: () => import('./features/checkout/place-order/place-order').then(m => m.PlaceOrder),
        // canActivate: [RoleGuard],
        data: { role: ['customer'] }
      }
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
    // canActivate: [RoleGuard],
    data: { role: ['admin'] }


  },
  {
    path: 'seller',
    component: SimpleLayout, // or create a separate SellerLayoutComponent
    loadChildren: () => import('./features/seller/seller.routes').then(m => m.routes),
    // canActivate: [RoleGuard],
    data: { role: ['seller'] }


  },
  {
    path: 'unauthorized',
    loadComponent:()=>import('./shared/components/unauthorized/unauthorized').then(m => m.Unauthorized)
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
  // {
  //   path: 'chat-dashboard',
  //   component: AdminChat,
  //   // canActivate: [AuthGuard], // Apply an AuthGuard for admin role
  //   // data: { roles: ['Admin'] } // Pass role data for the guard
  // },
  {
    path: 'search-products',
    component: SearchProducts,
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
