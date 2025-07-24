import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
interface ProductForm {
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
}
@Component({
  selector: 'app-seller-manageproducts',
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-manageproducts.html',
  styleUrl: './seller-manageproducts.css'
})
export class SellerManageproducts implements OnInit {
  productForm: ProductForm = {
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    sku: '',
    brand: '',
    images: [],
    tags: []
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

  constructor(private router: Router ,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.generateSKU();
  }

  generateSKU(): void {
    const timestamp = Date.now().toString().slice(-6);
    this.productForm.sku = `SKU-${timestamp}`;
  }

  addTag(): void {
    if (this.newTag.trim() && !this.productForm.tags.includes(this.newTag.trim())) {
      this.productForm.tags.push(this.newTag.trim());
      this.newTag = '';
    }
  }

  removeTag(index: number): void {
    this.productForm.tags.splice(index, 1);
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
    }
  }

  removeImage(index: number): void {
    this.productForm.images.splice(index, 1);
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

  saveProduct(): void {
    if (!this.isFormValid()) {
      alert('Please fill in all required fields.');
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Product saved:', this.productForm);
      this.isLoading = false;
      alert('Product saved successfully!');
      this.router.navigate(['/seller/products']);
    }, 1500);
  }

  saveDraft(): void {
    console.log('Product saved as draft:', this.productForm);
    alert('Product saved as draft!');
  }

  cancel(): void {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      this.router.navigate(['/seller/products']);
    }
  }
}
