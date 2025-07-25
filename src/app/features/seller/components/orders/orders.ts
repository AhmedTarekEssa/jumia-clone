import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService, SubOrder, OrderItem } from '../../../../core/services/orders-services/orders-user';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  items: number;
  trackingNumber?: string;
  shippingProvider?: string;
}


@Component({
  selector: 'app-orders',
  imports: [ CommonModule,FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);


  subOrders!: SubOrder[];
  loading: boolean = false;
  error: string | null = null;

  filteredOrders!: SubOrder[] 
  selectedStatus: string = 'all';
  searchTerm: string = '';

  sellerId: number = 1;
  showItemsModal: boolean = false;
  selectedOrderForItems: SubOrder | null = null;

  pending!:SubOrder[];
  confirmed!:SubOrder[];
  shipped!:SubOrder[];
  canceled!:SubOrder[];
  delivered!:SubOrder[];



  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;

    this.orderService.getSubOrdersBySellerId(this.sellerId).subscribe({
      next: (subOrders) => {
        this.subOrders = subOrders;
        // this.subOrders = this.transformSubOrdersToOrders(subOrders);
        this.filteredOrders = this.subOrders;
        this.pending = subOrders.filter(s=>s.status.toLowerCase()=='pending')
        this.delivered = subOrders.filter(s=>s.status.toLowerCase()=='delivered')
        this.confirmed = subOrders.filter(s=>s.status.toLowerCase()=='confirmed')
        this.canceled = subOrders.filter(s=>s.status.toLowerCase()=='canceled')
        this.shipped = subOrders.filter(s=>s.status.toLowerCase()=='shipped')
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Failed to load orders. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }



  

  filterOrders(): void {
    let filtered = [...this.subOrders];

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toString().toLowerCase().includes(this.searchTerm.toLowerCase()) 
       
      );
    }

    this.filteredOrders = filtered;
    this.cdr.detectChanges();
  }

  updateOrderStatus(orderId: number, newStatus: SubOrder['status']): void {
   

    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const order = this.subOrders.find(o => o.id === orderId);
        if (order) {
          order.status = newStatus;
          this.filterOrders();
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        this.error = 'Failed to update order status. Please try again.';
        this.cdr.detectChanges();
      }
    });
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

  refreshOrders(): void {
    this.loadOrders();
  }


  openItemsModal(order: SubOrder): void {
    this.selectedOrderForItems = order;
    this.showItemsModal = true;
  }

  closeItemsModal(): void {
    this.showItemsModal = false;
    this.selectedOrderForItems = null;
  }


}
