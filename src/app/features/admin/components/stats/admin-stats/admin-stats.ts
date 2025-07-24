import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../../../core/services/Product-Service/product';

@Component({
  selector: 'app-admin-stats',
  imports: [],
  templateUrl: './admin-stats.html',
  styleUrl: './admin-stats.css'
})
export class AdminStats implements OnInit {
  totalProducts: number = 10;
  totalOrders: number = 10;

  constructor(){}

  private productService = inject(ProductService);
  // private orderService = inject()

  ngOnInit(): void {
    this.getProductCount();
  }

  getProductCount() {
    this.productService.getAllUi().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        console.log(this.totalProducts);
      },
      error: (err) => {
        console.error('Failed to fetch product count', err);
      }
    })
  }

}
