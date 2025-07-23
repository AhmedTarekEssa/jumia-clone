import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class Analytics implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  salesData = {
    thisMonth: 12450,
    lastMonth: 10230,
    growth: 21.7
  };

  topProducts = [
    { name: 'Wireless Headphones', sales: 145, revenue: 14500 },
    { name: 'Smartphone Case', sales: 98, revenue: 2940 },
    { name: 'Bluetooth Speaker', sales: 67, revenue: 6700 }
  ];

  ngOnInit(): void {
    // Load analytics data
  }
}
