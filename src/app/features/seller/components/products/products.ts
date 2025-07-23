import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  image: string;
  createdDate: Date;
}
@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule,],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  products: Product[] = [
    {
      id: 'PROD-001',
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      price: 99.99,
      stock: 25,
      status: 'active',
      image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdDate: new Date('2024-01-10')
    },
    {
      id: 'PROD-002',
      name: 'Smartphone Protective Case',
      category: 'Accessories',
      price: 29.99,
      stock: 0,
      status: 'out_of_stock',
      image: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdDate: new Date('2024-01-08')
    },
    {
      id: 'PROD-003',
      name: 'Portable Bluetooth Speaker',
      category: 'Electronics',
      price: 79.99,
      stock: 15,
      status: 'active',
      image: 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=400',
      createdDate: new Date('2024-01-05')
    }
  ];

  filteredProducts: Product[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';
  selectedStatus: string = 'all';

  constructor(private router: Router ,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.filteredProducts = [...this.products];
  }

  filterProducts(): void {
    let filtered = [...this.products];

    if (this.searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(product => product.status === this.selectedStatus);
    }

    this.filteredProducts = filtered;
  }

  editProduct(productId: string): void {
    this.router.navigate(['/seller/product-edit', productId]);
  }

  toggleProductStatus(productId: string): void {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.status = product.status === 'active' ? 'inactive' : 'active';
      this.filterProducts();
    }
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.products = this.products.filter(p => p.id !== productId);
      this.filterProducts();
    }
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'active': 'status-active',
      'inactive': 'status-inactive',
      'out_of_stock': 'status-out-of-stock'
    };
    return statusClasses[status] || '';
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/seller/manage-products']);
  }

  getUniqueCategories(): string[] {
    const categories = this.products.map(p => p.category);
    return [...new Set(categories)];
  }
}
