import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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
}
