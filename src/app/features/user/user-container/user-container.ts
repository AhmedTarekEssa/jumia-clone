import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';



interface MenuItem {
  icon: string;
  label: string;
  route: string;
  isSection?: boolean;
}


@Component({
  selector: 'app-user-container',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-container.html',
  styleUrl: './user-container.css'
})
export class UserContainer {
    mainMenuItems: MenuItem[] = [
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
               <path d="m9 9 5 12 1.774-5.226L21 14 9 9z"></path>
             </svg>`,
      label: 'Orders',
      route: '/user/orders'
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
               <polyline points="22,6 12,13 2,6"></polyline>
             </svg>`,
      label: 'Inbox',
      route: '/user/inbox'
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
               <polyline points="14,2 14,8 20,8"></polyline>
               <line x1="16" y1="13" x2="8" y2="13"></line>
               <line x1="16" y1="17" x2="8" y2="17"></line>
               <polyline points="10,9 9,9 8,9"></polyline>
             </svg>`,
      label: 'Pending Reviews',
      route: '/user/user-reviews'
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
               <line x1="8" y1="21" x2="16" y2="21"></line>
               <line x1="12" y1="17" x2="12" y2="21"></line>
             </svg>`,
      label: 'Vouchers',
      route: '/user/user-vouchers'
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
             </svg>`,
      label: 'Wishlist',
      route: '/user/wishlist'
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
               <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
             </svg>`,
      label: 'Followed Sellers',
      route: '/user/followed-sellers'
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <circle cx="12" cy="12" r="3"></circle>
               <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"></path>
             </svg>`,
      label: 'recently-viewed',
      route: '/user/recently-viewed'
    }
  ];

  accountMenuItems: MenuItem[] = [
    {
      icon: '',
      label: 'Account Management',
      route: '/user/account-management',
      isSection: true
    },
    {
      icon: '',
      label: 'Address Book',
      route: '/user/addresses',
      isSection: true
    },
    {
      icon: '',
      label: 'Newsletter Preferences',
      route: '/user/newsletter-preferences',
      isSection: true
    }
  ];

  constructor(private router: Router) {}

  onMenuClick(item: MenuItem) {
    console.log('Navigating to:', item.route);
  }

  onLogout() {
    console.log('Logging out...');
    // Implement logout logic here
    this.router.navigate(['/login']);
  }


}
