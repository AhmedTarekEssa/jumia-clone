import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core'; 
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface ProductForm {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku: string;
  brand: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  tags: string[];
  status: 'active' | 'inactive' | 'out_of_stock';
}

@Component({
  selector: 'app-seller-product-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-product-edit.html',
  styleUrl: './seller-product-edit.css'
})
export class SellerProductEdit implements OnInit {
  productId: string = '';
  productForm: ProductForm = {
    id: '',
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    sku: '',
    brand: '',
    images: [],
    tags: [],
    status: 'active'
  };

  categories = [
    'Electronics',
    'Fashion',
    'Home & Garden',
    'Sports & Outdoors',
    'Books',
    'Health & Beauty',
    'Toys & Games',
    'Automotive'
  ];

  newTag = '';
  isLoading = false;
  isLoadingProduct = false;

  // Mock product data
  mockProducts: { [key: string]: ProductForm } = {
    'PROD-001': {
      id: 'PROD-001',
      name: 'Wireless Bluetooth Headphones',
      description: 'High-quality wireless headphones with noise cancellation and long battery life. Perfect for music lovers and professionals.',
      category: 'Electronics',
      price: 99.99,
      comparePrice: 129.99,
      stock: 25,
      sku: 'SKU-001',
      brand: 'TechSound',
      weight: 0.3,
      dimensions: { length: 20, width: 18, height: 8 },
      images: [
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
      status: 'active'
    },
    'PROD-002': {
      id: 'PROD-002',
      name: 'Smartphone Protective Case',
      description: 'Durable protective case for smartphones with shock absorption and premium materials.',
      category: 'Accessories',
      price: 29.99,
      comparePrice: 39.99,
      stock: 0,
      sku: 'SKU-002',
      brand: 'ProtectPro',
      weight: 0.1,
      dimensions: { length: 15, width: 8, height: 1 },
      images: [
        'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      tags: ['case', 'protection', 'smartphone', 'accessories'],
      status: 'out_of_stock'
    },
    'PROD-003': {
      id: 'PROD-003',
      name: 'Portable Bluetooth Speaker',
      description: 'Compact and powerful Bluetooth speaker with excellent sound quality and waterproof design.',
      category: 'Electronics',
      price: 79.99,
      stock: 15,
      sku: 'SKU-003',
      brand: 'SoundWave',
      weight: 0.5,
      dimensions: { length: 12, width: 12, height: 6 },
      images: [
        'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      tags: ['speaker', 'bluetooth', 'portable', 'waterproof'],
      status: 'active'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      this.loadProduct();
    });
  }

  loadProduct(): void {
    this.isLoadingProduct = true;
    this.cdr.detectChanges();


    setTimeout(() => {
      const product = this.mockProducts[this.productId];
      if (product) {
        this.productForm = { ...product };
        if (!this.productForm.dimensions) {
          this.productForm.dimensions = { length: 0, width: 0, height: 0 };
        }
      } else {
        alert('Product not found!');
        this.router.navigate(['/seller/products']);
      }
      this.isLoadingProduct = false;
      this.cdr.detectChanges();
    }, 1000);
  }

  addTag(): void {
    if (this.newTag.trim() && !this.productForm.tags.includes(this.newTag.trim())) {
      this.productForm.tags.push(this.newTag.trim());
      this.newTag = '';
      this.cdr.detectChanges();
    }
  }

  removeTag(index: number): void {
    this.productForm.tags.splice(index, 1);
    this.cdr.detectChanges();
  }

  onTagKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  addImageUrl(): void {
    const url = prompt('Enter image URL:');
    if (url && url.trim()) {
      this.productForm.images.push(url.trim());
      this.cdr.detectChanges();
    }
  }

  removeImage(index: number): void {
    this.productForm.images.splice(index, 1);
    this.cdr.detectChanges();
  }

  isFormValid(): boolean {
    return !!(
      this.productForm.name &&
      this.productForm.description &&
      this.productForm.category &&
      this.productForm.price > 0 &&
      this.productForm.stock >= 0 &&
      this.productForm.sku &&
      this.productForm.brand
    );
  }

  updateProduct(): void {
    if (!this.isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();


    setTimeout(() => {
      console.log('Product updated:', this.productForm);
      this.isLoading = false;
      alert('Product updated successfully!');
      this.router.navigate(['/seller/products']);
      this.cdr.detectChanges();
    }, 1500);
  }

  saveDraft(): void {
    console.log('Product saved as draft:', this.productForm);
    alert('Product saved as draft!');
    this.cdr.detectChanges();
  }

  deleteProduct(): void {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      this.isLoading = true;
      this.cdr.detectChanges();


      setTimeout(() => {
        console.log('Product deleted:', this.productId);
        this.isLoading = false;
        alert('Product deleted successfully!');
        this.router.navigate(['/seller/products']);
        this.cdr.detectChanges();
      }, 1000);
    }
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      this.router.navigate(['/seller/products']);
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
}
