import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Seller {
  id: number;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Pending';
  joinDate: string;
  totalProducts: number;
  totalSales: number;
  commission: number;
}

@Component({
  standalone: true ,
  selector: 'app-admin-sellers',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-sellers.html',
  styleUrl: './admin-sellers.css'
})
export class AdminSellers {

   showAddForm = false;
  searchTerm = '';
  statusFilter = '';
  categoryFilter = '';

  newSeller = {
    name: '',
    email: '',
    phone: '',
    businessName: '',
    category: '',
    status: 'Pending' as 'Active' | 'Inactive' | 'Pending'
  };

  sellers: Seller[] = [
    { id: 1, name: 'Apple Store Egypt', email: 'apple@jumia.com', phone: '+201234567890', businessName: 'Apple Official Store', category: 'Electronics', status: 'Active', joinDate: '2024-01-15', totalProducts: 25, totalSales: 15000, commission: 8 },
    { id: 2, name: 'Fashion Hub', email: 'fashion@jumia.com', phone: '+201987654321', businessName: 'Fashion Hub Store', category: 'Fashion', status: 'Active', joinDate: '2024-02-20', totalProducts: 150, totalSales: 8500, commission: 12 },
    { id: 3, name: 'Home Essentials', email: 'home@jumia.com', phone: '+201122334455', businessName: 'Home & Garden Store', category: 'Home', status: 'Pending', joinDate: '2024-07-20', totalProducts: 0, totalSales: 0, commission: 10 },
    { id: 4, name: 'Book World', email: 'books@jumia.com', phone: '+201555666777', businessName: 'Book World Library', category: 'Books', status: 'Inactive', joinDate: '2024-03-10', totalProducts: 200, totalSales: 2500, commission: 15 }
  ];

  get filteredSellers(): Seller[] {
    return this.sellers.filter(seller => {
      const matchesSearch = seller.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           seller.businessName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           seller.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || seller.status === this.statusFilter;
      const matchesCategory = !this.categoryFilter || seller.category === this.categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }

  addSeller(): void {
    if (this.newSeller.name && this.newSeller.email && this.newSeller.businessName && this.newSeller.category) {
      const seller: Seller = {
        id: this.sellers.length + 1,
        ...this.newSeller,
        joinDate: new Date().toISOString().split('T')[0],
        totalProducts: 0,
        totalSales: 0,
        commission: 10
      };
      this.sellers.push(seller);
      this.newSeller = { name: '', email: '', phone: '', businessName: '', category: '', status: 'Pending' };
      this.showAddForm = false;
    }
  }

}
