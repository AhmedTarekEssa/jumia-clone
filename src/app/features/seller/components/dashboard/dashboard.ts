import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OrderService, SubOrder } from '../../../../core/services/orders-services/orders-user';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductUi } from '../../../products/product-models';
import { Campaign } from '../../../../core/services/campaignService/campaign';
import Swal from 'sweetalert2';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  constructor(private router: Router) {}

  stats: DashboardStats = {
    pendingOrders: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  };

  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private campaignService = inject(Campaign)

  recentOrders!: SubOrder[];
  products: ProductUi[] = [];
  showItemsModal: boolean = false;
  selectedOrderForItems: SubOrder | null = null;
  userInfoCookie!: string | null;

  ngOnInit(): void {
    this.userInfoCookie = this.getCookie('UserInfo');

    if (this.userInfoCookie) {
      const userInfo = JSON.parse(this.userInfoCookie);
      const userTypeId = userInfo.UserTypeId;
      console.log('UserTypeId:', userTypeId);
    this.orderService.getSubOrdersBySellerId().subscribe({
      next: (data) => {
        console.log(data);
        this.recentOrders = data.reverse().slice(0, 3);
        this.stats.totalRevenue = data.filter(o => o.status.toLowerCase() == 'shipped' || o.status.toLowerCase() == 'delivered'|| o.status.toLowerCase() == 'confirmed')
          .reduce((sum, order) => sum + order.subtotal, 0);
        this.stats.totalOrders = data.length;
        this.stats.pendingOrders = data.filter(o => o.status.toLowerCase() == 'pending').length;
        this.cdr.detectChanges();
      }
    });

    this.productService.getBySellerIdUi(userTypeId, "Seller").subscribe({
      next: (data) => {
        this.stats.totalProducts = data.length;
        this.cdr.detectChanges();
      }
    });
  }
  }
  requestreport(): void {
    if (this.userInfoCookie) {
      const userInfo = JSON.parse(this.userInfoCookie);
      const userTypeId = userInfo.UserTypeId;
    this.campaignService.requestMonthlyReport(Number(userTypeId)).subscribe({
      next:()=>
        Swal.fire('your request is under process.','check your email within 5 minutes','info'),

      error:()=>
        Swal.fire('your request is under process.','check your email within 5 minutes','info')


    })
  }
}
  requestcampain(): void {
    if (this.userInfoCookie) {
      const userInfo = JSON.parse(this.userInfoCookie);
      const userTypeId = userInfo.UserTypeId;
    this.campaignService.requestCampaign(Number(userTypeId)).subscribe({
      next:()=>
        Swal.fire('your request is under review.','info'),

      error:()=>
        Swal.fire('your request is under review.','info')


    })
  }
  }
  navigatetoorders(): void {
    this.router.navigate(['/seller/orders']);
  }

  openItemsModal(order: SubOrder): void {
    this.selectedOrderForItems = order;
    this.showItemsModal = true;
  }

  closeItemsModal(): void {
    this.showItemsModal = false;
    this.selectedOrderForItems = null;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'status-pending',
      'confirmed': 'status-confirmed',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return statusClasses[status] || '';
  }
  getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }
}
