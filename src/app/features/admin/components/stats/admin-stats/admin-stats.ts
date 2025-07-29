import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../../../core/services/Product-Service/product';
import { OrderService } from '../../../../../core/services/orders-services/orders-user';
import { User } from '../../../../../core/services/User-Service/user';
import { CustomerInsightsChart } from "../../customer-insights-chart/customer-insights-chart";
import { ProductPerformance } from "../../product-performance/product-performance";

@Component({
  selector: 'app-admin-stats',
  imports: [CustomerInsightsChart, ProductPerformance],
  templateUrl: './admin-stats.html',
  styleUrl: './admin-stats.css'
})
export class AdminStats implements OnInit {
  totalProducts: number = 0;
  totalOrders: number = 0;
  totalCustomers: number = 0;
  totalSellers: number = 10;

  constructor(){}

  private cdr = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private userService = inject(User);

  ngOnInit(): void {
    this.getProductCount();
    this.getOrderCount();
    this.getCustomersCount();
    this.getSellersCount();
  }

  getSellersCount(){
    this.userService.getAllSellers().subscribe({
      next: (sellers) => {
        this.totalSellers = sellers.length;

      },
      error: (err) => {
        console.error('Failed to fetch', err);
      }
    })
  }

  getCustomersCount(){
    this.userService.getAllCustomers().subscribe({
      next: (customers) => {
        this.totalCustomers = customers.length;

      },
      error: (err) => {
        console.error('Failed to fetch' , err);
      }
    })
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
