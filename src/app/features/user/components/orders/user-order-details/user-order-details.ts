import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../../../core/services/orders-services/orders-user';
import { Order, OrderItem, SubOrder } from '../../../../../shared/models/order';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../../environments/environment.development';

@Component({
  selector: 'app-user-order-details',
  imports: [CommonModule],
  templateUrl: './user-order-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './user-order-details.css'
})
export class UserOrderDetails implements OnInit {
  orderData = {
    orderNumber: 0,
    itemCount: 0,
    placedDate: '',
    total: 0,
    items: [] as {
      name: string;
      quantity: number;
      currentPrice: number;
      originalPrice: number;
      image: string;
      status: string;
      statusDate: string;
    }[],
  };

  paymentInfo = {
    method: '',
    itemsTotal: 0,
    deliveryFees: 0,
    total: 0,
  };

  deliveryInfo = {
    method: '',
    address: {
      name: 'John Doe',
      street: '123 Example St',
      area: 'Downtown',
      city: 'Cairo',
    },
    details: 'Standard delivery',
    schedule: '2–5 business days',
  };

  baseImageUrl=environment.ImageUrlBase;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('orderId'));
    if (id) this.loadOrder(id);
  }

  loadOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe({
      next: (order: Order) => {
        const items = order.subOrders.flatMap((sub) =>
          sub.orderItems.map((item) => ({
            name: item.productName,
            quantity: item.quantity,
            currentPrice: item.totalPrice,
            originalPrice: item.priceAtPurchase,
            image: item.mainImageUrl ?? 'assets/images/placeholder.png',
            status: sub.status.toLowerCase(),
            statusDate: new Date(sub.statusUpdatedAt).toDateString(),
          }))
        );

        this.orderData = {
          orderNumber: order.orderId,
          placedDate: new Date(order.createdAt).toDateString(),
          total: order.finalAmount,
          itemCount: items.length,
          items,
        };

        this.paymentInfo = {
          method: order.paymentMethod,
          itemsTotal: order.totalAmount,
          deliveryFees: order.shippingFee,
          total: order.finalAmount,
        };

        this.deliveryInfo.method =
          order.subOrders[0]?.shippingProvider ?? 'N/A';

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Order load failed', err);
        this.cdr.markForCheck();
      },
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'cancelled':
        return 'Cancelled';
      case 'returned':
        return 'Returned';
      case 'ongoing':
        return 'Ongoing';
      case 'shipped':
        return 'Shipped';
      case 'pending':
        return 'Pending';
      case 'delivered':
        return 'Delivered';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  }

  getActionButtonText(status: string): string {
    switch (status) {
      case 'cancelled':
        return 'Reorder';
      case 'returned':
        return 'Buy Again';
      case 'ongoing':
      case 'pending':
        return 'Cancel';
      case 'shipped':
        return 'Track';
      case 'delivered':
        return 'Buy Again';
      default:
        return 'Action';
    }
  }

  onActionButtonClick(item: any): void {
    console.log('Action clicked:', item);
    // Add further logic as needed
  }

  onStatusHistoryClick(item: any): void {
    console.log('Show status history for:', item);
    // Add modal or router logic if needed
  }
}
