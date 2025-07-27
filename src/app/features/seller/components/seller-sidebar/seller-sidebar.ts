import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { CookieService } from 'ngx-cookie-service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  count?: number;
}
@Component({
  selector: 'app-seller-sidebar',
  imports: [CommonModule],
  templateUrl: './seller-sidebar.html',
  styleUrl: './seller-sidebar.css'
})
export class SellerSidebar {
  @Input() isCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();
   userInfo: any = null;
  username: string = '';

  constructor(
      private router: Router,
      private cookieService: CookieService,
      private authService: AuthService
    ) { }

  menuItems: MenuItem[] = [
    { icon: '📊', label: 'Dashboard', route: '/seller/dashboard' },
    { icon: '📈', label: 'Analytics', route: '/seller/analytics' },
    { icon: '📦', label: 'Orders', route: '/seller/orders'},
    { icon: '🛍️', label: 'Products', route: '/seller/products' },
    { icon: '🎯', label: 'Promotions', route: '/seller/promotions' }
  ];

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }
  // logout() {
  //   console.log('Logout clicked');
  //   this.router.navigate(['/home']);
  // }
  logout() {
  this.authService.logout().subscribe({
    next: () => {
      this.userInfo = null;
      this.username = '';
      this.cookieService.delete('UserInfo');
      this.router.navigate(['/home']);
    },
    error: (err) => {


      if(this.cookieService.get('UserInfo')) {
        this.cookieService.delete('UserInfo');
        this.router.navigate(['/home']);
      }else {
        this.router.navigate(['/home']);
        console.error('Logout failed', err);
      }



    }
  });
}
}
