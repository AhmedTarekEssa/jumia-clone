import { Routes } from '@angular/router';
import { AdminContainer } from './admin-container/admin-container';

export const routes: Routes = [
  {
    path: '',
    component: AdminContainer,
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(m => m.DashboardComponent) , pathMatch:'full' },
      { path: 'products', loadComponent: () => import('./components/products/admin-products/admin-products').then(m => m.AdminProducts) , pathMatch:'full' },
      { path: 'categories', loadComponent: () => import('./components/categories/admin-categories/admin-categories').then(m => m.AdminCategories) , pathMatch:'full' },
      { path: 'orders', loadComponent: () => import('./components/orders/admin-orders/admin-orders').then(m => m.AdminOrders) },
      { path: 'orders/:id', loadComponent: () => import('./components/orders/admin-order-details/admin-order-details').then(m => m.AdminOrderDetails) },
      { path: 'sellers', loadComponent: () => import('./components/sellers/admin-sellers/admin-sellers').then(m => m.AdminSellers) },
      { path: 'customers', loadComponent: () => import('./components/customers/admin-customers/admin-customers').then(m => m.AdminCustomers) },
      { path: 'reviews', loadComponent: () => import('./components/reviews/admin-reviews/admin-reviews').then(m => m.AdminReviews) },
      { path: 'chats', loadComponent: () => import('./admin-chat/admin-chat').then(m => m.AdminChat) },
      { path: 'stats', loadComponent: () => import('./components/stats/admin-stats/admin-stats').then(m => m.AdminStats) },
      { path: 'settings', loadComponent: () => import('./components/settings/admin-settings/admin-settings').then(m => m.AdminSettings) },
      { path: 'Payments', loadComponent: () => import('./components/payments/payments').then(m => m.Payments)},
      {path: 'Coupons', loadComponent: () => import('./components/coupons/coupons').then(m => m.Coupons)},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
