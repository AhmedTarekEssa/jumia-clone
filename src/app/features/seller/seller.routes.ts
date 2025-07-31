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
      { path: 'product-edit/:id', loadComponent: () => import('./components/add-product/add-product').then(m => m.AddProduct) },
      { path: 'orders', loadComponent: () => import('./components/orders/orders').then(m => m.Orders) },
      { path: 'promotions', loadComponent: () => import('./components/promotions/promotions').then(m => m.Promotions) },
      { path: 'analytics', loadComponent: () => import('./components/analytics/analytics').then(m => m.Analytics) },
      { path: 'chat', loadComponent: () => import('./components/seller-live-chat/seller-live-chat').then(m => m.SellerLiveChat) },
      {path:'add-product', loadComponent:()=>import('./components/add-product/add-product').then(m=>m.AddProduct)},
      {path: 'details', loadComponent: () => import('./components/seller-details/seller-details').then(m => m.SellerDetailsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
