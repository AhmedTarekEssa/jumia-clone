import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  status: string;
  date: Date;
}
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  constructor(private router: Router ,private cdr: ChangeDetectorRef) {}
  stats: DashboardStats = {
    totalOrders: 156,
    totalRevenue: 45230,
    totalProducts: 89,
    pendingOrders: 12
  };

  recentOrders: RecentOrder[] = [
    { id: 'ORD-001', customerName: 'John Doe', amount: 299.99, status: 'pending', date: new Date() },
    { id: 'ORD-002', customerName: 'Jane Smith', amount: 149.50, status: 'completed', date: new Date() },
    { id: 'ORD-003', customerName: 'Mike Johnson', amount: 89.99, status: 'shipped', date: new Date() }
  ];

  ngOnInit(): void {
    // Initialize dashboard data
  }
  navigatetoorders(): void {
    this.router.navigate(['/seller/orders']);
  }
  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'shipped': return 'status-shipped';
      default: return '';
    }
  }
}
