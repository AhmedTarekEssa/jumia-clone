import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

@Component({
  standalone: true ,
  selector: 'app-admin-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css'
})
export class AdminSettings {

  activeTab = 'general';
  
  tabs = [
    { id: 'general', label: 'General' },
    { id: 'payment', label: 'Payment' },
    { id: 'shipping', label: 'Shipping' }
  ];

  settings = {
    siteName: 'Jumia Admin',
    siteDescription: 'Jumia E-commerce Platform Administration',
    currency: 'USD',
    timezone: 'UTC',
    paymentMethods: {
      creditCard: true,
      paypal: true,
      bankTransfer: false,
      cashOnDelivery: true
    },
    defaultCommission: 15,
    freeShippingMinimum: 100,
    standardShippingCost: 5,
    expressShippingCost: 10
  };
// Static orders data
  orders: Order[] = [
    {
      id: 1001,
      customerName: 'Ahmed Mohamed',
      totalAmount: 245.99,
      date: '2023-05-15',
      status: 'Delivered'
    },
    {
      id: 1002,
      customerName: 'Fatma Ali',
      totalAmount: 120.50,
      date: '2023-05-16',
      status: 'Processing'
    },
    {
      id: 1003,
      customerName: 'Youssef Ibrahim',
      totalAmount: 89.99,
      date: '2023-05-17',
      status: 'Pending'
    },
    {
      id: 1004,
      customerName: 'Mariam Hassan',
      totalAmount: 320.75,
      date: '2023-05-18',
      status: 'Shipped'
    },
    {
      id: 1005,
      customerName: 'Omar Khaled',
      totalAmount: 65.25,
      date: '2023-05-19',
      status: 'Delivered'
    },
    {
      id: 1006,
      customerName: 'Nada Samir',
      totalAmount: 154.30,
      date: '2023-05-20',
      status: 'Cancelled'
    },
    {
      id: 1007,
      customerName: 'Karim Adel',
      totalAmount: 210.00,
      date: '2023-05-21',
      status: 'Pending'
    },
    {
      id: 1008,
      customerName: 'Lina Waleed',
      totalAmount: 99.99,
      date: '2023-05-22',
      status: 'Delivered'
    },
    {
      id: 1009,
      customerName: 'Tarek Nour',
      totalAmount: 175.50,
      date: '2023-05-23',
      status: 'Processing'
    },
    {
      id: 1010,
      customerName: 'Dalia Fathi',
      totalAmount: 230.25,
      date: '2023-05-24',
      status: 'Shipped'
    }
  ];

  getOrdersByStatus(status: string): Order[] {
    return this.orders.filter(order => order.status === status);
  }

  // Additional stats getters for more comprehensive reporting
  get totalRevenue(): number {
    return this.orders
      .filter(order => order.status === 'Delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0);
  }

  get averageOrderValue(): number {
    const deliveredOrders = this.getOrdersByStatus('Delivered');
    return deliveredOrders.length > 0 
      ? this.totalRevenue / deliveredOrders.length 
      : 0;
  }

  get cancellationRate(): number {
    const cancelledOrders = this.getOrdersByStatus('Cancelled').length;
    return this.orders.length > 0
      ? (cancelledOrders / this.orders.length) * 100
      : 0;
  }

}
