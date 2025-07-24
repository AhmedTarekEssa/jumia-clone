import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../../../core/services/Product-Service/product';
import { OrderService } from '../../../../../core/services/orders-services/orders-user';

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

  private cdr = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  ngOnInit(): void {
    this.getProductCount();
    this.getOrderCount();
  }

  getOrderCount(){
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.totalOrders = orders.length;
        this.cdr.detectChanges();
        console.log(this.totalOrders);
      },
      error: (err) => {
        console.error('Failed to fetch ',err);
      }
    })
  }

  getProductCount() {
    this.productService.getAllUi().subscribe({
      next: (products) => {
        this.totalProducts = products.length;
        this.cdr.detectChanges();
        console.log(this.totalProducts);
      },
      error: (err) => {
        console.error('Failed to fetch product count', err);
      }
    })
  }

}
