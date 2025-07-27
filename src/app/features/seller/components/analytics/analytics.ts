import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../../../core/services/Product-Service/product';
import {
  OrderService,
  SubOrder,
} from '../../../../core/services/orders-services/orders-user';
import { forkJoin } from 'rxjs';
import { ProductUi } from '../../../products/product-models';

interface AnalyticsData {
  thisMonth: number;
  lastMonth: number;
  growth: number;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
}

interface MetricsData {
  conversionRate: number;
  averageOrderValue: number;
  returnRate: number;
  totalOrders: number;
  totalRevenue: number;
  activeProducts: number;
}

@Component({
  selector: 'app-analytics',
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  salesData: AnalyticsData = {
    thisMonth: 0,
    lastMonth: 0,
    growth: 0,
  };
  lastMonthBarHeight = 0;
  thisMonthBarHeight = 0;
  topProducts: TopProduct[] = [];
  metrics: MetricsData = {
    conversionRate: 0,
    averageOrderValue: 0,
    returnRate: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeProducts: 0,
  };

  isLoading = true;
  error: string | null = null;
  userInfoCookie!: string | null;

  ngOnInit(): void {
    this.userInfoCookie = this.getCookie('UserInfo');
    if (this.userInfoCookie) {
      const userInfo = JSON.parse(this.userInfoCookie);
      const userTypeId = userInfo.UserTypeId;
      console.log('UserTypeId:', userTypeId);
    } else {
      this.error = 'Unable to identify seller';
      this.isLoading = false;
      return;
    }
    this.cdr.detectChanges()
    this.loadAnalyticsData();
  this.cdr.detectChanges()
  }

  private loadAnalyticsData(): void {
    this.isLoading = true;
    this.error = null;

    const sellerId = this.userInfoCookie ? JSON.parse(this.userInfoCookie).UserTypeId : null;

    if (!sellerId) {
      this.error = 'Unable to identify seller';
      this.isLoading = false;
      return;
    }

    forkJoin({
      products: this.productService.getBySellerIdUi(sellerId, 'seller'),
      subOrders: this.orderService.getSubOrdersBySellerId(),
    }).subscribe({
      next: ({ products, subOrders }) => {
        console.log('Products:', products);
        console.log('SubOrders:', subOrders);
        this.processAnalyticsData(products, subOrders);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading analytics data:', error);
        this.error = 'Failed to load analytics data';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private processAnalyticsData(
    products: ProductUi[],
    subOrders: SubOrder[]
  ): void {
    console.log('Processing analytics data...');
    console.log('Products:', products);
    console.log('SubOrders:', subOrders);
    this.calculateSalesData(subOrders);
    this.calculateTopProducts(subOrders);
    this.calculateMetrics(products, subOrders);
  }

  private calculateSalesData(subOrders: SubOrder[]): void {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  let thisMonthRevenue = 0;
  let lastMonthRevenue = 0;

  subOrders.forEach(subOrder => {
    const orderDate = new Date(subOrder.statusUpdatedAt);
    console.log('SubOrder Date:', orderDate);
    const orderMonth = orderDate.getMonth();
    const orderYear = orderDate.getFullYear();
    console.log('Order Month:', orderMonth, 'Order Year:', orderYear);
    if (orderMonth === currentMonth && orderYear === currentYear) {
      thisMonthRevenue += subOrders.filter(o => o.status.toLowerCase() == 'shipped' || o.status.toLowerCase() == 'delivered'|| o.status.toLowerCase() == 'confirmed')
          .reduce((sum, order) => sum + order.subtotal, 0);
      console.log('This Month Revenue:', thisMonthRevenue);
    } else if (orderMonth === lastMonth && orderYear === currentYear) {
      lastMonthRevenue += subOrders.filter(o => o.status.toLowerCase() == 'shipped' || o.status.toLowerCase() == 'delivered'|| o.status.toLowerCase() == 'confirmed')
          .reduce((sum, order) => sum + order.subtotal, 0);
      console.log('Last Month Revenue:', lastMonthRevenue);
    }
  });

  const maxRevenue = Math.max(thisMonthRevenue, lastMonthRevenue);
  this.lastMonthBarHeight = lastMonthRevenue > 0 ? (lastMonthRevenue / maxRevenue) * 100 : 0;
  this.thisMonthBarHeight = thisMonthRevenue > 0 ? (thisMonthRevenue / maxRevenue) * 100 : 0;

  this.salesData = {
    thisMonth: thisMonthRevenue,
    lastMonth: lastMonthRevenue,
    growth: lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0
  };
}

  private calculateTopProducts(subOrders: SubOrder[]): void {
    const productStats = new Map<
      string,
      { sales: number; revenue: number; name: string }
    >();

    subOrders.forEach((subOrder) => {
      subOrder.orderItems.forEach((item) => {

        const key = item.productId.toString();
        console.log('Product ID:', key);
        console.log('Product Name:', item.productName);
        const existing = productStats.get(key) || {
          sales: 0,
          revenue: 0,
          name: item.productName,
        };
        console.log(item.productName);
        existing.sales += item.quantity;
        existing.revenue += item.totalPrice;
        existing.name = item.productName;

        productStats.set(key, existing);
      });
    });

    this.topProducts = Array.from(productStats.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3)
      .map((product) => ({
        name: product.name,
        sales: product.sales,
        revenue: product.revenue,
      }));
  }

  private calculateMetrics(products: ProductUi[], subOrders: SubOrder[]): void {
    const totalOrders = subOrders.length;
    const totalRevenue =subOrders.filter(o => o.status.toLowerCase() == 'shipped' || o.status.toLowerCase() == 'delivered'|| o.status.toLowerCase() == 'confirmed')
          .reduce((sum, order) => sum + order.subtotal, 0);
    console.log(totalOrders, totalRevenue);
    const activeProducts = products.filter((p) => p.approvalStatus).length;

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const returnedOrders = subOrders.filter(
      (order) =>
        order.status.toLowerCase().includes('cancelled')
    ).length;
    const returnRate =
      totalOrders > 0 ? (returnedOrders / totalOrders) * 100 : 0;
    const conversionRate =
      activeProducts > 0 ? (totalOrders / activeProducts) * 100 : 0;

    this.metrics = {
      conversionRate: Math.min(conversionRate, 100),
      averageOrderValue,
      returnRate,
      totalOrders,
      totalRevenue,
      activeProducts,
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'Egp',
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }
   getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }
}
