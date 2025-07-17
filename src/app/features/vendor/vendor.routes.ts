import { Routes } from '@angular/router';
import { VendorContainer } from './vendor-container/vendor-container';

export const routes: Routes = [
  {
    path: '',
    component: VendorContainer,
    children: [
      {
        path: 'start-now',
        loadComponent: () => import('./components/start-now/start-now').then(m => m.StartNow)
      },
      {
        path: 'shipping-and-delivery',
        loadComponent: () => import('./components/shipping-and-delivery/shipping-and-delivery').then(m => m.ShippingAndDelivery)
      },
      {
        path: 'selling-expenses',
        loadComponent: () => import('./components/selling-expenses/selling-expenses').then(m => m.SellingExpenses)
      },
      {
        path: 'commission-schedule',
        loadComponent: () => import('./components/commission-schedule/commission-schedule').then(m => m.CommissionSchedule)
      },
      {
        path: '',
        redirectTo: 'start-now',
        pathMatch: 'full'
      }
    ]
  }
];
