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

  constructor(private orderservice: OrderService, private cdr: ChangeDetectorRef, private router: Router) { }

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

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 3;

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
  redirect(id: number) {
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


    const nextStatus = this.getNextStatusLabel(currentStatus).toLowerCase();
    if (nextStatus === 'delivered') {
      order.paymentStatus = 'Paid';
      this.cdr.detectChanges(); // Automatically mark as refunded if cancelled
      // Automatically mark as paid if delivered
    }
    // if(nextStatus === 'cancelled') {
    //   order.paymentStatus = 'Refunded';
    //   this.cdr.detectChanges(); // Automatically mark as refunded if cancelled
    // }
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

  // Pagination methods
  get paginatedOrders(): typeof this.Orders {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOrders?.slice(startIndex, endIndex);
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5; // Show maximum 5 page numbers
    let startPage = 1;
    let endPage = this.totalPages;

    if (this.totalPages > maxVisiblePages) {
      const half = Math.floor(maxVisiblePages / 2);
      startPage = Math.max(1, this.currentPage - half);
      endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;

  }



  cancelOrder(order: any): void {
    if (order.status.toLowerCase() === 'delivered') return;

    this.orderservice.CancelOrder(order.id, 'Cancelled by admin').subscribe({
      next: (res) => {
        order.status = 'Cancelled';
        order.paymentStatus = 'Refunded';

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
