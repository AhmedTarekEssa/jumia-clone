import { Routes } from '@angular/router';
import { SellerContainer} from './seller-container/seller-container';

export const routes: Routes = [
  {
    path: '',
    component: SellerContainer,
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard) },
      { path: 'products', loadComponent: () => import('./components/products/products').then(m => m.Products) },
      { path: 'manage-products', loadComponent: () => import('./components/seller-manageproducts/seller-manageproducts').then(m => m.SellerManageproducts) },
      { path: 'product-edit/:id', loadComponent: () => import('./components/seller-product-edit/seller-product-edit').then(m => m.SellerProductEdit) },
      { path: 'orders', loadComponent: () => import('./components/orders/orders').then(m => m.Orders) },
      { path: 'promotions', loadComponent: () => import('./components/promotions/promotions').then(m => m.Promotions) },
      { path: 'analytics', loadComponent: () => import('./components/analytics/analytics').then(m => m.Analytics) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
