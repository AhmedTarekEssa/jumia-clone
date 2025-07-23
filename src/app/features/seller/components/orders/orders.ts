import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  items: number;
}


@Component({
  selector: 'app-orders',
  imports: [ CommonModule,FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders: Order[] = [
    {
      id: 'ORD-2024-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      amount: 299.99,
      status: 'pending',
      orderDate: new Date('2024-01-15'),
      items: 2
    },
    {
      id: 'ORD-2024-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      amount: 149.50,
      status: 'shipped',
      orderDate: new Date('2024-01-14'),
      items: 1
    },
    {
      id: 'ORD-2024-003',
      customerName: 'Mike Johnson',
      customerEmail: 'mike@example.com',
      amount: 89.99,
      status: 'delivered',
      orderDate: new Date('2024-01-13'),
      items: 3
    }
  ];

  filteredOrders: Order[] = [];
  selectedStatus: string = 'all';
  searchTerm: string = '';

  ngOnInit(): void {
    this.filteredOrders = [...this.orders];
  }

  filterOrders(): void {
    let filtered = [...this.orders];

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    if (this.searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredOrders = filtered;
  }

  updateOrderStatus(orderId: string, newStatus: Order['status']): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.filterOrders();
    }
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
