import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../../../../core/services/orders-services/orders-user';
import { Order } from '../../../../../shared/models/order';
import { NgClass } from '@angular/common';
import { environment } from '../../../../../../environments/environment.development';

@Component({
  selector: 'app-order-item',
  imports: [NgClass],
  templateUrl: './order-item.html',
  styleUrl: './order-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderItem {
    @Input() order!: Order;

    baseImageUrl = environment.ImageUrlBase
  productName = '';
  productImage = '';
  orderNumber = '';
  date = '';
  statusDisplayText = '';
  statusClass = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const firstSubOrder = this.order.subOrders[0];
    const firstItem = firstSubOrder?.orderItems[0];

    this.productName = firstItem?.productName || 'Unnamed Product';
    this.productImage = firstItem?.mainImageUrl || 'assets/images/placeholder.png';
    console.log(this.productImage)
    this.orderNumber = String(this.order.orderId);
    this.date = new Date(this.order.createdAt).toLocaleDateString();

    this.statusDisplayText = this.formatStatus(this.order.status);
    this.statusClass = `badge-${this.order.status.toLowerCase()}`;

    this.cdr.markForCheck();
  }

  onSeeDetails(): void {
    console.log('Navigating to order details for order:', this.order.orderId);
    this.router.navigate(['/user/order-details', this.order.orderId]);
  }

  private formatStatus(status: string): string {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  }


}


