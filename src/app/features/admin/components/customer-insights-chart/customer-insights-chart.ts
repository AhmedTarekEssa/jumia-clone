import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Customer } from '../customers/admin-customers/admin-customers';
import { User } from '../../../../core/services/User-Service/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-insights-chart',
  templateUrl: './customer-insights-chart.html',
  styleUrls: ['./customer-insights-chart.css'],
  imports: [CommonModule]
})
export class CustomerInsightsChart implements OnInit {
  customerChart: any;
  allCustomers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  summaryMetrics: {label: string, value: number}[] = [];

  // Filter states
  genderFilter: string = 'all';
  statusFilter: string = 'all';

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

  constructor(private userService: User) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadCustomerData();
  }

  loadCustomerData(): void {
    this.userService.getAllCustomers().subscribe(customers => {
      this.allCustomers = customers;
      console.log();
      this.applyFilters();
    });
  }

  applyFilters(): void {
    // Apply gender filter
    this.filteredCustomers = this.allCustomers.filter(customer => {
      const genderMatch = this.genderFilter === 'all' || 
                         customer.gender?.toLowerCase() === this.genderFilter;
      
      const statusMatch = this.statusFilter === 'all' ||
                        (this.statusFilter === 'active' && !customer.isBlocked) ||
                        (this.statusFilter === 'blocked' && customer.isBlocked);
      
      return genderMatch && statusMatch;
    });

    this.updateChart();
    this.updateSummaryMetrics();
  }

  updateSummaryMetrics(): void {
    const totalCustomers = this.allCustomers.length;
    const blockedCustomers = this.allCustomers.filter(c => c.isBlocked).length;
    const activeCustomers = totalCustomers - blockedCustomers;

    // Gender breakdown
    const maleCustomers = this.allCustomers.filter(c => c.gender?.toLowerCase() === 'male').length;
    const femaleCustomers = this.allCustomers.filter(c => c.gender?.toLowerCase() === 'female').length;
    // const otherGenderCustomers = totalCustomers - maleCustomers - femaleCustomers;

    this.summaryMetrics = [
      { label: 'Total Customers', value: totalCustomers },
      { label: 'Active Customers', value: activeCustomers },
      { label: 'Blocked Customers', value: blockedCustomers },
      { label: 'Male Customers', value: maleCustomers },
      { label: 'Female Customers', value: femaleCustomers },
      // { label: 'Other Genders', value: otherGenderCustomers }
    ];
  }

  updateChart(): void {
    if (this.customerChart) {
      this.customerChart.destroy();
    }

    const ctx = document.getElementById('customerChart') as HTMLCanvasElement;
    
    // Group data by gender and blocked status
    const genders = ['male', 'female', 'other'];
    const statuses = ['active', 'blocked'];
    
    const datasets = statuses.map((status, i) => {
      return {
        label: status === 'active' ? 'Active' : 'Blocked',
        data: genders.map(gender => {
          return this.filteredCustomers.filter(c => {
            const genderMatch = c.gender?.toLowerCase() === gender || 
                              (gender === 'other' && 
                               c.gender?.toLowerCase() !== 'male' && 
                               c.gender?.toLowerCase() !== 'female');
            const statusMatch = status === 'active' ? !c.isBlocked : c.isBlocked;
            return genderMatch && statusMatch;
          }).length;
        }),
        backgroundColor: status === 'active' 
          ? this.jumiaColors.warningLight
          : this.jumiaColors.errorLight,
        borderColor: status === 'active' 
          ? this.jumiaColors.secondary
          : this.jumiaColors.error,
        borderWidth: 2,
        hoverBackgroundColor: status === 'active' 
          ? this.jumiaColors.secondary
          : this.jumiaColors.error,
        hoverBorderColor: status === 'active' 
          ? this.jumiaColors.secondary
          : this.jumiaColors.error
      };
    });

    this.customerChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Male', 'Female', 'Other'],
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Customers',
              color: this.jumiaColors.text,
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              color: this.jumiaColors.text
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Gender',
              color: this.jumiaColors.text,
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            ticks: {
              color: this.jumiaColors.text
            },
            grid: {
              color: 'rgba(0,0,0,0.1)'
            },
            stacked: true
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: this.jumiaColors.text,
              font: {
                size: 12,
                weight: 'bold'
              },
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: this.jumiaColors.primary,
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.raw as number;
                return `${label}: ${value}`;
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });
  }

  onGenderFilterChange(event: Event): void {
    this.genderFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onStatusFilterChange(event: Event): void {
    this.statusFilter = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }
}