import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../../../shared/models/order';
import { OrderService } from '../../../../../core/services/orders-services/orders-user';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-admin-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrders implements OnInit {

  constructor(private orderservice: OrderService, private cdr: ChangeDetectorRef, private router:Router) { }

  searchTerm = '';
  statusFilter = '';

  readonly statusSequence = ['pending', 'processing', 'shipped', 'delivered'];

  Orders: {
    id: number;
    customer: string;
    products: string[];
    total: number;
    status: string;
    paymentStatus: string; // Added payment status
    orderDate: string;
    raw: Order;
  }[] = [];

  ngOnInit(): void {
    this.getAllorders();
    this.cdr.detectChanges();
  }

  getAllorders(): void {
    this.orderservice.getAllOrders().subscribe((orders: Order[]) => {
      this.Orders = orders.map(order => ({
        id: order.orderId,
        customer: `#${order.customerId}`,
        products: order.subOrders.flatMap(sub =>
          sub.orderItems.map(item => item.productName)
        ),
        total: order.finalAmount,
        status: this.capitalize(order.status),
        paymentStatus: this.capitalize(order.paymentStatus), // Added payment status
        orderDate: new Date(order.createdAt).toLocaleDateString(),
        raw: order
      }));
      this.cdr.detectChanges();
    });
  }
  redirect(id:number){
    this.router.navigate([`admin/orders/${id}`]);

  }

  get filteredOrders(): typeof this.Orders {
    const search = this.searchTerm.toLowerCase().trim();
    const status = this.statusFilter.toLowerCase();

    return this.Orders.filter(order => {
      const matchesSearch =
        order.id.toString().includes(search) ||
        order.customer.toLowerCase().includes(search) ||
        order.products.some(p => p.toLowerCase().includes(search));

      const matchesStatus = !status || order.status.toLowerCase() === status;

      return matchesSearch && matchesStatus;
    });
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  getNextStatusLabel(currentStatus: string): string {
    const lower = currentStatus.toLowerCase();
    const index = this.statusSequence.indexOf(lower);
    if (index >= 0 && index < this.statusSequence.length - 1) {
      return this.capitalize(this.statusSequence[index + 1]);
    }
    return 'Delivered';
  }

  progressStatus(order: any): void {
    const currentStatus = order.status.toLowerCase();
    const index = this.statusSequence.indexOf(currentStatus);

    if (index >= 0 && index < this.statusSequence.length - 1) {
      const nextStatus = this.statusSequence[index + 1];

      this.orderservice.UpdateOrderStatus(order.id, nextStatus).subscribe({
        next: (res) => {
          if (res) {
            order.status = this.capitalize(nextStatus);
            this.cdr.detectChanges();
            order = { ...order }; // trigger UI update
            this.cdr.detectChanges(); // ensure view updates
          }
        },
        error: (err) => {
          console.error('Failed to update status:', err);
        }
      });
    }
  }



  cancelOrder(order: any): void {
    if (order.status.toLowerCase() === 'delivered') return;

    this.orderservice.CancelOrder(order.id, 'Cancelled by admin').subscribe({
      next: (res) => {
        order.status = 'Cancelled';
        order = { ...order }; 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to cancel order:', err);
      }
    });
  }


  getOrdersByStatus(status: string): typeof this.Orders {
    return this.Orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
  }
}
