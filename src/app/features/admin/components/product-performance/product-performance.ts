import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { OrderService } from '../../../../core/services/orders-services/orders-user';
import { CategoryService } from '../../../../core/services/Categories/category';
import { Chart, registerables } from 'chart.js';
import { firstValueFrom, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-product-performance',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-performance.html',
  styleUrls: ['./product-performance.css']
})
export class ProductPerformance implements OnInit, AfterViewInit, OnDestroy {
  // ViewChild references to canvas elements
  @ViewChild('topProductsChart') topProductsChartRef!: ElementRef;
  @ViewChild('salesTrendChart') salesTrendChartRef!: ElementRef;
  @ViewChild('inventoryChart') inventoryChartRef!: ElementRef;
  @ViewChild('categoryPerformanceChart') categoryPerformanceChartRef!: ElementRef;

  // Chart instances
  private topProductsChart?: Chart;
  private salesTrendChart?: Chart;
  private inventoryChart?: Chart;
  private categoryPerformanceChart?: Chart;

  // Filters
  timePeriod: string = '30days';
  categoryFilter: number | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  dataLoaded: boolean = false;

  // Data
  categories: any[] = [];
  products: any[] = [];
  orders: any[] = [];

  // Jumia Color Palette
  private jumiaColors = {
    primary: '#ff6600',
    primaryLight: 'rgba(255, 102, 0, 0.7)',
    primaryDark: '#e55a00',
    secondary: '#00a651',
    secondaryLight: 'rgba(0, 166, 81, 0.7)',
    warning: '#ffa726',
    warningLight: 'rgba(255, 167, 38, 0.7)',
    info: '#5e72e4',
    infoLight: 'rgba(94, 114, 228, 0.7)',
    success: '#00c851',
    successLight: 'rgba(0, 200, 81, 0.7)',
    error: '#ff4444',
    errorLight: 'rgba(255, 68, 68, 0.7)',
    text: '#333333',
    lightGray: '#f7f7f7'
  };

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadData();
  }

 ngAfterViewInit(): void {
  console.log('AfterViewInit - dataLoaded:', this.dataLoaded);
  console.log('Canvas references:', {
    topProducts: this.topProductsChartRef,
    salesTrend: this.salesTrendChartRef,
    inventory: this.inventoryChartRef,
    category: this.categoryPerformanceChartRef
  });
  
  if (this.dataLoaded) {
    setTimeout(() => {
      this.createCharts();
    }, 0);
  }
}

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  async loadData(): Promise<void> {
  this.loading = true;
  this.errorMessage = null;
  
  try {
    console.log('Starting data loading...');
    
    const [categories, products, orders] = await Promise.all([
      firstValueFrom(this.categoryService.getAllCategories().pipe(
        tap(data => console.log('Categories loaded:', data))
      )),
      firstValueFrom(this.productService.getAllWithDetails().pipe(
        tap(data => console.log('Products loaded:', data))
      )),
      firstValueFrom(this.orderService.getAllOrders().pipe(
        tap(data => console.log('Orders loaded:', data))
      ))
    ]);

    this.categories = categories || [];
    this.products = products || [];
    this.orders = orders || [];
    this.dataLoaded = true;

    console.log('Data loaded successfully:', {
      categories: this.categories.length,
      products: this.products.length,
      orders: this.orders.length
    });
     // Force change detection and chart creation
    setTimeout(() => {
      this.createCharts();
      this.cdr.detectChanges();
    }, 0);
    
  } catch (error) {
    console.error('Failed to load data:', error);
    this.errorMessage = 'Failed to load data. Please try again.';
    this.cdr.detectChanges();
  } finally {
    this.loading = false;
        this.cdr.detectChanges();

  }
}

  private createCharts(): void {
  console.log('Creating charts...');
  
  if (!this.orders.length) {
    console.warn('No order data available');
    this.errorMessage = 'No order data available';
    return;
  }

  console.log('Canvas elements:', {
    topProducts: this.topProductsChartRef?.nativeElement,
    salesTrend: this.salesTrendChartRef?.nativeElement,
    inventory: this.inventoryChartRef?.nativeElement,
    category: this.categoryPerformanceChartRef?.nativeElement
  });

  this.createTopProductsChart();
  this.createSalesTrendChart();
  this.createInventoryChart();
  this.createCategoryPerformanceChart();
  
  console.log('Charts created successfully');
}

  private createTopProductsChart(): void {
    if (!this.topProductsChartRef?.nativeElement) return;

    const productSales = this.aggregateProductSales(this.orders);
    const sortedProducts = [...productSales.entries()]
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 10);

    this.topProductsChart = new Chart(this.topProductsChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: sortedProducts.map(item => item[1].name),
        datasets: [{
          label: 'Revenue',
          data: sortedProducts.map(item => item[1].revenue),
          backgroundColor: this.jumiaColors.primaryLight,
          borderColor: this.jumiaColors.primary,
          borderWidth: 2,
          hoverBackgroundColor: this.jumiaColors.primary,
          hoverBorderColor: this.jumiaColors.primaryDark
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { 
            display: true, 
            text: 'Top Selling Products',
            color: this.jumiaColors.text,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            labels: {
              color: this.jumiaColors.text
            }
          }
        },
        scales: {
          y: {
            ticks: {
              color: this.jumiaColors.text
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            ticks: {
              color: this.jumiaColors.text
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      }
    });
  }

  private createSalesTrendChart(): void {
    if (!this.salesTrendChartRef?.nativeElement) return;

    const monthlySales = this.groupSalesByMonth(this.orders);
    
    this.salesTrendChart = new Chart(this.salesTrendChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: Object.keys(monthlySales),
        datasets: [{
          label: 'Monthly Sales',
          data: Object.values(monthlySales),
          fill: true,
          backgroundColor: 'rgba(255, 102, 0, 0.1)',
          borderColor: this.jumiaColors.primary,
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: this.jumiaColors.primary,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { 
            display: true, 
            text: 'Sales Trend',
            color: this.jumiaColors.text,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            labels: {
              color: this.jumiaColors.text
            }
          }
        },
        scales: {
          y: {
            ticks: {
              color: this.jumiaColors.text
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            ticks: {
              color: this.jumiaColors.text
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          }
        }
      }
    });
  }

  private createInventoryChart(): void {
    if (!this.inventoryChartRef?.nativeElement) return;

    const lowStockThreshold = 10;
    const lowStock = this.products.filter(p => p.stockQuantity < lowStockThreshold).length;
    const healthyStock = this.products.length - lowStock;
    
    this.inventoryChart = new Chart(this.inventoryChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Low Stock', 'Healthy Stock'],
        datasets: [{
          data: [lowStock, healthyStock],
          backgroundColor: [
            this.jumiaColors.errorLight,
            this.jumiaColors.secondaryLight
          ],
          borderColor: [
            this.jumiaColors.error,
            this.jumiaColors.secondary
          ],
          borderWidth: 2,
          hoverBackgroundColor: [
            this.jumiaColors.error,
            this.jumiaColors.secondary
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { 
            display: true, 
            text: 'Inventory Status',
            color: this.jumiaColors.text,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            position: 'bottom',
            labels: {
              color: this.jumiaColors.text,
              padding: 20,
              usePointStyle: true
            }
          }
        }
      }
    });
  }

  private createCategoryPerformanceChart(): void {
    console.log(this.categoryPerformanceChartRef);
    console.log("CCCCCCCCCCCCCCCCCCCCCCC");
    if (!this.categoryPerformanceChartRef?.nativeElement) return;

    const categorySales = this.aggregateCategorySales(this.orders);
    const sortedCategories = [...categorySales.entries()]
      .sort((a, b) => b[1].revenue - a[1].revenue);
    
    this.categoryPerformanceChart = new Chart(this.categoryPerformanceChartRef.nativeElement, {
      type: 'pie',
      data: {
        labels: sortedCategories.map(item => item[1].name),
        datasets: [{
          data: sortedCategories.map(item => item[1].revenue),
          backgroundColor: [
            this.jumiaColors.primaryLight,
            this.jumiaColors.secondaryLight,
            this.jumiaColors.warningLight,
            this.jumiaColors.infoLight,
            this.jumiaColors.successLight,
            this.jumiaColors.errorLight
          ],
          borderColor: [
            this.jumiaColors.primary,
            this.jumiaColors.secondary,
            this.jumiaColors.warning,
            this.jumiaColors.info,
            this.jumiaColors.success,
            this.jumiaColors.error
          ],
          borderWidth: 2,
          hoverBackgroundColor: [
            this.jumiaColors.primary,
            this.jumiaColors.secondary,
            this.jumiaColors.warning,
            this.jumiaColors.info,
            this.jumiaColors.success,
            this.jumiaColors.error
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: { 
            display: true, 
            text: 'Revenue by Category',
            color: this.jumiaColors.text,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            position: 'bottom',
            labels: {
              color: this.jumiaColors.text,
              padding: 15,
              usePointStyle: true
            }
          }
        }
      }
    });
  }

  private destroyCharts(): void {
    this.topProductsChart?.destroy();
    this.salesTrendChart?.destroy();
    this.inventoryChart?.destroy();
    this.categoryPerformanceChart?.destroy();
  }

  // Data processing methods
  private aggregateProductSales(orders: any[]): Map<number, {name: string, quantity: number, revenue: number}> {
    const productSales = new Map<number, {name: string, quantity: number, revenue: number}>();
    
    orders?.forEach(order => {
      order?.subOrders?.forEach((subOrder: any) => {
        subOrder?.orderItems?.forEach((item: any) => {
          const product = this.products.find(p => p?.productId === item?.productId);
          if (product && item?.productId) {
            if (!productSales.has(item.productId)) {
              productSales.set(item.productId, {
                name: product?.name || 'Unknown Product',
                quantity: 0,
                revenue: 0
              });
            }
            const current = productSales.get(item.productId)!;
            current.quantity += item?.quantity || 0;
            current.revenue += item?.totalPrice || 0;
          }
        });
      });
    });
    
    return productSales;
  }

  private groupSalesByMonth(orders: any[]): {[key: string]: number} {
    const monthlySales: {[key: string]: number} = {};
    
    orders?.forEach(order => {
      if (!order?.createdAt) return;
      
      const date = new Date(order.createdAt);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      if (!monthlySales[monthYear]) {
        monthlySales[monthYear] = 0;
      }
      
      monthlySales[monthYear] += order?.finalAmount || 0;
    });
    
    return monthlySales;
  }

  private aggregateCategorySales(orders: any[]): Map<number, {name: string, revenue: number}> {
    const categorySales = new Map<number, {name: string, revenue: number}>();
    
    orders?.forEach(order => {
      order?.subOrders?.forEach((subOrder: any) => {
        subOrder?.orderItems?.forEach((item: any) => {
          const product = this.products.find(p => p?.productId === item?.productId);
          if (product?.categoryId) {
            const category = this.categories.find(c => c?.id === product.categoryId);
            if (category) {
              if (!categorySales.has(category.id)) {
                categorySales.set(category.id, {
                  name: category?.name || 'Uncategorized',
                  revenue: 0
                });
              }
              categorySales.get(category.id)!.revenue += item?.totalPrice || 0;
            }
          }
        });
      });
    });
    
    return categorySales;
  }

  onFilterChange(): void {
    this.destroyCharts();
    this.loadData();
  }
}