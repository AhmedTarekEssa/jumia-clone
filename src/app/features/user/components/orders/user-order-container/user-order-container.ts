import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { OrderService } from '../../../../../core/services/orders-services/orders-user';
import { Order } from '../../../../../shared/models/order';
import { ChangeDetectionStrategy } from '@angular/core';
import { UserNoOrders } from "../user-no-orders/user-no-orders";
import { OrderItem } from "../order-item/order-item";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-order-container',
  imports: [UserNoOrders, OrderItem, CommonModule],
  templateUrl: './user-order-container.html',
  styleUrl: './user-order-container.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserOrderContainer {

  allOrders: Order[] = [];
  currentOrders: Order[] = [];
  activeTab: 'ongoing' | 'closed' = 'ongoing';

  ongoingCount = 0;
  hasOrders = false;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.orderService.getCurrentUserOrders().subscribe({
      next: (orders: Order[]) => {
        this.allOrders = orders;
        console.log('All Orders:', this.allOrders);

        this.ongoingCount = this.allOrders.filter(o =>
          o.status !== 'cancelled'
        ).length;

        this.updateTabView(); // This will now update hasOrders based on current tab

        this.cdr.markForCheck(); // Needed because OnPush strategy
      },
      error: () => {
        this.allOrders = [];
        this.currentOrders = [];
        this.hasOrders = false;
        this.cdr.markForCheck();
      }
    });
  }

  setActiveTab(tab: 'ongoing' | 'closed'): void {
    this.activeTab = tab;
    this.updateTabView();
    this.cdr.markForCheck();
  }

  private updateTabView(): void {
    this.currentOrders = this.allOrders.filter(order => {
      if (this.activeTab === 'ongoing') {
        return order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered';
      } else {
        return order.status === 'cancelled';
      }
    });

    // Update hasOrders based on the filtered currentOrders
    this.hasOrders = this.currentOrders.length > 0;
  }
}
