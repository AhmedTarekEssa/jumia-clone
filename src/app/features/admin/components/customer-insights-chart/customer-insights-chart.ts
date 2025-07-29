import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Customer } from '../customers/admin-customers/admin-customers';
import { User } from '../../../../core/services/User-Service/user';

@Component({
  selector: 'app-customer-insights-chart',
  templateUrl: './customer-insights-chart.html',
  styleUrls: ['./customer-insights-chart.css']
})
export class CustomerInsightsChart implements OnInit {
  customerChart: any;
  allCustomers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  summaryMetrics: {label: string, value: number}[] = [];

  // Filter states
  genderFilter: string = 'all';
  statusFilter: string = 'all';

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
    const otherGenderCustomers = totalCustomers - maleCustomers - femaleCustomers;

    this.summaryMetrics = [
      { label: 'Total Customers', value: totalCustomers },
      { label: 'Active Customers', value: activeCustomers },
      { label: 'Blocked Customers', value: blockedCustomers },
      { label: 'Male Customers', value: maleCustomers },
      { label: 'Female Customers', value: femaleCustomers },
      { label: 'Other Genders', value: otherGenderCustomers }
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
          ? 'rgba(54, 162, 235, 0.7)' 
          : 'rgba(255, 99, 132, 0.7)',
        borderColor: status === 'active' 
          ? 'rgba(54, 162, 235, 1)' 
          : 'rgba(255, 99, 132, 1)',
        borderWidth: 1
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
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Customers'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Gender'
            },
            stacked: true
          }
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
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