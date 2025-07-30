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
    { icon: 'fas fa-chart-line', label: 'Dashboard', route: '/seller/dashboard' },
    { icon: 'fas fa-chart-bar', label: 'Analytics', route: '/seller/analytics' },
    { icon: 'fas fa-box', label: 'Orders', route: '/seller/orders'},
    { icon: 'fas fa-shopping-bag', label: 'Products', route: '/seller/products' },
    { icon: 'fas fa-bullhorn', label: 'Promotions', route: '/seller/promotions' },
    { icon: 'fas fa-shopping-bag', label: 'chat', route: '/seller/chat' }
  ];

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

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
        } else {
          this.router.navigate(['/home']);
          console.error('Logout failed', err);
        }
      }
    });
  }
}
