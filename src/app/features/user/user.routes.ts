import { Routes } from '@angular/router';
import { UserContainer } from './user-container/user-container';

export const routes: Routes = [
  {
    path: '',
    component: UserContainer,
    children: [
      { path: 'profile', loadComponent: () => import('./components/profile/profile').then(m => m.Profile) },
      { path: 'orders', loadComponent: () => import('./components/orders//user-order-container/user-order-container').then(m => m.UserOrderContainer) },
      {path: 'order-details/:orderId', loadComponent: () => import('./components/orders/user-order-details/user-order-details').then(m => m.UserOrderDetails) },
      { path: 'wishlist', loadComponent: () => import('./components/wishlist/wishlist').then(m => m.Wishlist) },
      { path: 'account-details', loadComponent: () => import('./components/account-details/account-details').then(m => m.AccountDetails) },
      { path: 'addresses', loadComponent: () => import('./components/addresses/addresses').then(m => m.Addresses) },
      { path: 'followed-sellers', loadComponent: () => import('./components/followed-sellers/followed-sellers').then(m => m.FollowedSellers) },
      { path: 'inbox', loadComponent: () => import('./components/inbox/inbox').then(m => m.Inbox) },
      { path: 'notifications', loadComponent: () => import('./components/notifications/notifications').then(m => m.Notifications) },
      { path: 'recently-viewed', loadComponent: () => import('./components/recently-viewed/recently-viewed').then(m => m.RecentlyViewed) },
      { path: 'newsletter-preferences', loadComponent: () => import('./components/newsletter-preferences/newsletter-preferences').then(m => m.NewsletterPreferences) },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  }
];
