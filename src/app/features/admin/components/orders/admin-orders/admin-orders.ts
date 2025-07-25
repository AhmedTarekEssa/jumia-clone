import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Order {
  id: number;
  customer: string;
  products: string[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
  shippingAddress: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css'
})
export class AdminOrders {

   searchTerm = '';
  statusFilter = '';

  orders: Order[] = [
    { id: 1847, customer: 'Ahmed Hassan', products: ['iPhone 14 Pro', 'AirPods'], total: 1189, status: 'Delivered', orderDate: '2024-07-20', shippingAddress: 'Cairo, Egypt' },
    { id: 1848, customer: 'Fatima Ali', products: ['Samsung Galaxy S23'], total: 799, status: 'Shipped', orderDate: '2024-07-22', shippingAddress: 'Alexandria, Egypt' },
    { id: 1849, customer: 'Mohamed Omar', products: ['Nike Air Max', 'Adidas T-Shirt'], total: 159, status: 'Processing', orderDate: '2024-07-23', shippingAddress: 'Giza, Egypt' },
    { id: 1850, customer: 'Amira Mahmoud', products: ['Coffee Maker'], total: 89, status: 'Pending', orderDate: '2024-07-24', shippingAddress: 'Mansoura, Egypt' }
  ];

  get filteredOrders(): Order[] {
    return this.orders.filter(order => {
      const matchesSearch = order.customer.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           order.id.toString().includes(this.searchTerm);
      const matchesStatus = !this.statusFilter || order.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  getOrdersByStatus(status: string): Order[] {
    return this.orders.filter(order => order.status === status);
  }


}
