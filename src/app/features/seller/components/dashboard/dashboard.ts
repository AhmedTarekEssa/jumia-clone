import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OrderService, SubOrder } from '../../../../core/services/orders-services/orders-user';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductUi } from '../../../products/product-models';

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

  recentOrders!: SubOrder[];
  products: ProductUi[] = [];
  showItemsModal: boolean = false;
  selectedOrderForItems: SubOrder | null = null;

  ngOnInit(): void {
    this.orderService.getSubOrdersBySellerId(1).subscribe({
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

    this.productService.getBySellerIdUi(1, "Seller").subscribe({
      next: (data) => {
        this.stats.totalProducts = data.length;
        this.cdr.detectChanges();
      }
    });
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
}
