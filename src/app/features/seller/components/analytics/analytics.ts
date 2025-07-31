import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../../../core/services/Product-Service/product';
import {
  OrderService,
  SubOrder,
} from '../../../../core/services/orders-services/orders-user';
import { forkJoin } from 'rxjs';
import { ProductUi } from '../../../products/product-models';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

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
  private salesChart!: Chart;

  salesData: AnalyticsData = {
    thisMonth: 0,
    lastMonth: 0,
    growth: 0,
  };
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
    this.loadAnalyticsData();
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
        this.processAnalyticsData(products, subOrders);
        this.isLoading = false;
        this.cdr.detectChanges();
        this.createSalesChart();
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
      const orderMonth = orderDate.getMonth();
      const orderYear = orderDate.getFullYear();

      if (orderMonth === currentMonth && orderYear === currentYear) {
        thisMonthRevenue += subOrders
          .filter(o => o.status.toLowerCase() == 'shipped' ||
                      o.status.toLowerCase() == 'delivered' ||
                      o.status.toLowerCase() == 'confirmed')
          .reduce((sum, order) => sum + order.subtotal, 0);
      } else if (orderMonth === lastMonth && orderYear === lastMonthYear) {
        lastMonthRevenue += subOrders
          .filter(o => o.status.toLowerCase() == 'shipped' ||
                      o.status.toLowerCase() == 'delivered' ||
                      o.status.toLowerCase() == 'confirmed')
          .reduce((sum, order) => sum + order.subtotal, 0);
      }
    });

    this.salesData = {
      thisMonth: thisMonthRevenue,
      lastMonth: lastMonthRevenue,
      growth: lastMonthRevenue > 0 ?
             ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 :
             100, 
    };
  }

  private createSalesChart(): void {
  const ctx = document.getElementById('salesChart') as HTMLCanvasElement;

  // Destroy previous chart if it exists
  if (this.salesChart) {
    this.salesChart.destroy();
  }

  this.salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Last Month', 'This Month'],
      datasets: [{
        label: 'Sales Revenue',
        data: [this.salesData.lastMonth, this.salesData.thisMonth],
        borderColor: 'rgba(255, 102, 0, 1)',
        backgroundColor: 'rgba(255, 102, 0, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(255, 102, 0, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return ` ${this.formatCurrency(context.raw as number)}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            callback: (value) => {
              return this.formatCurrency(value as number);
            }
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

  private calculateTopProducts(subOrders: SubOrder[]): void {
    const productStats = new Map<
      string,
      { sales: number; revenue: number; name: string }
    >();

    subOrders.forEach((subOrder) => {
      subOrder.orderItems.forEach((item) => {
        const key = item.productId.toString();
        const existing = productStats.get(key) || {
          sales: 0,
          revenue: 0,
          name: item.productName,
        };
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
    const totalRevenue = subOrders
      .filter(o => o.status.toLowerCase() == 'shipped' ||
                  o.status.toLowerCase() == 'delivered' ||
                  o.status.toLowerCase() == 'confirmed')
      .reduce((sum, order) => sum + order.subtotal, 0);
    const activeProducts = products.filter((p) => p.approvalStatus).length;

    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const returnedOrders = subOrders.filter(
      (order) => order.status.toLowerCase().includes('cancelled')
    ).length;
    const returnRate = totalOrders > 0 ? (returnedOrders / totalOrders) * 100 : 0;
    const conversionRate = activeProducts > 0 ? (totalOrders / activeProducts) * 100 : 0;

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
      currency: 'EGP',
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
