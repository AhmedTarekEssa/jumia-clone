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
import { FormsModule } from '@angular/forms';

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

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    borderWidth: number;
    tension: number;
    fill: boolean;
  }[];
}

@Component({
  selector: 'app-analytics',
  imports: [CommonModule,FormsModule],
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
  selectedPeriod: 'weekly' | 'monthly' | 'quarterly' | 'yearly' = 'monthly';
  chartType: 'line' | 'bar' | 'pie' = 'line';
  chartData: ChartData = {
    labels: [],
    datasets: [{
      label: 'Sales Revenue',
      data: [],
      borderColor: 'rgba(255, 102, 0, 1)',
      backgroundColor: 'rgba(255, 102, 0, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      fill: true
    }]
  };

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

  public loadAnalyticsData(): void {
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
        this.processChartData(subOrders);
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

    const validOrders = subOrders.filter(o =>
      ['shipped', 'delivered', 'confirmed'].includes(o.status.toLowerCase())
    );

    this.salesData = {
      thisMonth: validOrders
        .filter(o => {
          const d = new Date(o.statusUpdatedAt);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, o) => sum + o.subtotal, 0),

      lastMonth: validOrders
        .filter(o => {
          const d = new Date(o.statusUpdatedAt);
          return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
        })
        .reduce((sum, o) => sum + o.subtotal, 0),

      growth: 0
    };

    if (this.salesData.lastMonth > 0) {
      this.salesData.growth =
        ((this.salesData.thisMonth - this.salesData.lastMonth) / this.salesData.lastMonth) * 100;
    } else {
      this.salesData.growth = this.salesData.thisMonth > 0 ? 100 : 0;
    }
  }

  private processChartData(subOrders: SubOrder[]): void {
    const validOrders = subOrders.filter(o =>
      ['shipped', 'delivered', 'confirmed'].includes(o.status.toLowerCase())
    );

    switch (this.selectedPeriod) {
      case 'weekly':
        this.processWeeklyData(validOrders);
        break;
      case 'monthly':
        this.processMonthlyData(validOrders);
        break;
      case 'quarterly':
        this.processQuarterlyData(validOrders);
        break;
      case 'yearly':
        this.processYearlyData(validOrders);
        break;
    }
  }

  private processWeeklyData(orders: SubOrder[]): void {
    const now = new Date();
    const weeks: {label: string, revenue: number}[] = [];

    // Get data for last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - (i * 7));
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const weekOrders = orders.filter(o => {
        const orderDate = new Date(o.statusUpdatedAt);
        return orderDate >= startDate && orderDate <= endDate;
      });

      const weekRevenue = weekOrders.reduce((sum, o) => sum + o.subtotal, 0);
      const weekLabel = `Week ${i+1}`;

      weeks.push({label: weekLabel, revenue: weekRevenue});
    }

    this.chartData.labels = weeks.map(w => w.label);
    this.chartData.datasets[0].data = weeks.map(w => w.revenue);
  }

  private processMonthlyData(orders: SubOrder[]): void {
    const now = new Date();
    const months: {label: string, revenue: number, prevRevenue: number}[] = [];

    // Get data for last 6 months with previous year comparison
    for (let i = 5; i >= 0; i--) {
      const month = now.getMonth() - i;
      const year = now.getFullYear() - (month < 0 ? 1 : 0);
      const adjustedMonth = (month + 12) % 12;

      // Current period
      const monthOrders = orders.filter(o => {
        const orderDate = new Date(o.statusUpdatedAt);
        return orderDate.getMonth() === adjustedMonth &&
               orderDate.getFullYear() === year;
      });

      // Previous year
      const prevYearOrders = orders.filter(o => {
        const orderDate = new Date(o.statusUpdatedAt);
        return orderDate.getMonth() === adjustedMonth &&
               orderDate.getFullYear() === year - 1;
      });

      const monthRevenue = monthOrders.reduce((sum, o) => sum + o.subtotal, 0);
      const prevRevenue = prevYearOrders.reduce((sum, o) => sum + o.subtotal, 0);
      const monthLabel = new Date(year, adjustedMonth, 1).toLocaleString('default', { month: 'short' });

      months.push({label: monthLabel, revenue: monthRevenue, prevRevenue});
    }

    this.chartData.labels = months.map(m => m.label);
    this.chartData.datasets = [
      {
        label: 'Current Period',
        data: months.map(m => m.revenue),
        borderColor: 'rgba(255, 102, 0, 1)',
        backgroundColor: 'rgba(255, 102, 0, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Previous Period',
        data: months.map(m => m.prevRevenue),
        borderColor: 'rgba(100, 100, 100, 1)',
        backgroundColor: 'rgba(100, 100, 100, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: false
      }
    ];
  }

  private processQuarterlyData(orders: SubOrder[]): void {
    const now = new Date();
    const quarters: {label: string, revenue: number}[] = [];

    for (let i = 3; i >= 0; i--) {
      const quarterMonth = now.getMonth() - (i * 3);
      const year = now.getFullYear() - (quarterMonth < 0 ? 1 : 0);
      const adjustedQuarterMonth = (quarterMonth + 12) % 12;
      const quarter = Math.floor(adjustedQuarterMonth / 3) + 1;

      const quarterOrders = orders.filter(o => {
        const orderDate = new Date(o.statusUpdatedAt);
        const orderQuarter = Math.floor(orderDate.getMonth() / 3) + 1;
        return orderQuarter === quarter &&
               orderDate.getFullYear() === year;
      });

      const quarterRevenue = quarterOrders.reduce((sum, o) => sum + o.subtotal, 0);
      const quarterLabel = `Q${quarter} ${year}`;

      quarters.push({label: quarterLabel, revenue: quarterRevenue});
    }

    this.chartData.labels = quarters.map(q => q.label);
    this.chartData.datasets[0].data = quarters.map(q => q.revenue);
  }

  private processYearlyData(orders: SubOrder[]): void {
    const now = new Date();
    const years: {label: string, revenue: number}[] = [];

    // Get data for last 3 years
    for (let i = 2; i >= 0; i--) {
      const year = now.getFullYear() - i;

      const yearOrders = orders.filter(o => {
        const orderDate = new Date(o.statusUpdatedAt);
        return orderDate.getFullYear() === year;
      });

      const yearRevenue = yearOrders.reduce((sum, o) => sum + o.subtotal, 0);
      const yearLabel = year.toString();

      years.push({label: yearLabel, revenue: yearRevenue});
    }

    this.chartData.labels = years.map(y => y.label);
    this.chartData.datasets[0].data = years.map(y => y.revenue);
  }

  private createSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;

    if (this.salesChart) {
      this.salesChart.destroy();
    }

    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: this.chartType === 'pie',
          position: 'right' as const
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: import('chart.js').TooltipItem<'line' | 'bar' | 'pie'>) => {
              const value = tooltipItem.raw as number;
              return ` ${this.formatCurrency(value)}`;
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
            callback: function(this: any, tickValue: string | number, index: number, ticks: any[]) {
              return typeof tickValue === 'number'
                ? (new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EGP' }).format(tickValue))
                : tickValue;
            }
          },
          display: this.chartType !== 'pie'
        },
        x: {
          grid: {
            display: false
          },
          display: this.chartType !== 'pie'
        }
      }
    };

    this.salesChart = new Chart(ctx, {
      type: this.chartType,
      data: this.chartData,
      options: commonOptions
    });
  }

  updateChartData(): void {
    if (!this.userInfoCookie) return;

    const sellerId = JSON.parse(this.userInfoCookie).UserTypeId;
    this.orderService.getSubOrdersBySellerId().subscribe({
      next: (subOrders) => {
        this.processChartData(subOrders);
        this.createSalesChart();
      },
      error: (error) => {
        console.error('Error updating chart data:', error);
      }
    });
  }

  setChartType(type: 'line' | 'bar' ): void {
    this.chartType = type;
    if (this.salesChart) {
      this.salesChart.destroy();
    }
    this.createSalesChart();
  }

  exportChart(): void {
    if (!this.salesChart) return;

    const canvas = this.salesChart.canvas;
    const dataURL = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = 'sales-chart.png';
    link.href = dataURL;
    link.click();
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
