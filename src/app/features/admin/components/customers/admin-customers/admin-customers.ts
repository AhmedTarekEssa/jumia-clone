import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}


@Component({
  standalone: true , 
  selector: 'app-admin-customers',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-customers.html',
  styleUrl: './admin-customers.css'
})
export class AdminCustomers {

  showAddForm = false;
  searchTerm = '';
  statusFilter = '';
  
  newCustomer = {
    name: '',
    email: '',
    phone: '',
    status: 'Active' as 'Active' | 'Inactive'
  };

  customers: Customer[] = [
    { id: 1, name: 'Ahmed Hassan', email: 'ahmed@example.com', phone: '+201234567890', status: 'Active', joinDate: '2024-01-15', totalOrders: 12, totalSpent: 1250.50 },
    { id: 2, name: 'Fatima Ali', email: 'fatima@example.com', phone: '+201987654321', status: 'Active', joinDate: '2024-02-20', totalOrders: 8, totalSpent: 890.25 },
    { id: 3, name: 'Mohamed Omar', email: 'mohamed@example.com', phone: '+201122334455', status: 'Inactive', joinDate: '2024-01-05', totalOrders: 3, totalSpent: 245.75 }
  ];

  get filteredCustomers(): Customer[] {
    return this.customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || customer.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  addCustomer(): void {
    if (this.newCustomer.name && this.newCustomer.email && this.newCustomer.phone) {
      const customer: Customer = {
        id: this.customers.length + 1,
        ...this.newCustomer,
        joinDate: new Date().toISOString().split('T')[0],
        totalOrders: 0,
        totalSpent: 0
      };
      this.customers.push(customer);
      this.newCustomer = { name: '', email: '', phone: '', status: 'Active' };
      this.showAddForm = false;
    }
  }
}

