import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Payment {
  id: number;
  orderId: number;
  customer: string;
  amount: number;
  method: 'Credit Card' | 'PayPal' | 'Bank Transfer' | 'Cash on Delivery';
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  date: string;
  transactionId: string;
}

@Component({
  standalone: true ,
  selector: 'app-payments',
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class Payments {

  searchTerm = '';
  statusFilter = '';
  methodFilter = '';

  payments: Payment[] = [
    { id: 2001, orderId: 1847, customer: 'Ahmed Hassan', amount: 1189, method: 'Credit Card', status: 'Completed', date: '2024-07-20', transactionId: 'TXN123456789' },
    { id: 2002, orderId: 1848, customer: 'Fatima Ali', amount: 799, method: 'PayPal', status: 'Completed', date: '2024-07-22', transactionId: 'PP987654321' },
    { id: 2003, orderId: 1849, customer: 'Mohamed Omar', amount: 159, method: 'Bank Transfer', status: 'Pending', date: '2024-07-23', transactionId: 'BT456789123' },
    { id: 2004, orderId: 1850, customer: 'Amira Mahmoud', amount: 89, method: 'Cash on Delivery', status: 'Pending', date: '2024-07-24', transactionId: 'COD789123456' }
  ];

  get filteredPayments(): Payment[] {
    return this.payments.filter(payment => {
      const matchesSearch = payment.customer.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           payment.id.toString().includes(this.searchTerm) ||
                           payment.orderId.toString().includes(this.searchTerm);
      const matchesStatus = !this.statusFilter || payment.status === this.statusFilter;
      const matchesMethod = !this.methodFilter || payment.method === this.methodFilter;
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }

  getPaymentsByStatus(status: string): Payment[] {
    return this.payments.filter(payment => payment.status === status);
  }

  getTotalRevenue(): number {
    return this.payments
      .filter(payment => payment.status === 'Completed')
      .reduce((total, payment) => total + payment.amount, 0);
  }
}


