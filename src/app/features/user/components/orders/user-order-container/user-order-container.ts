import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { OrderService } from '../../../../../core/services/orders-services/orders-user';
import { Order } from '../../../../../shared/models/order';
import { ChangeDetectionStrategy } from '@angular/core';
import { UserNoOrders } from "../user-no-orders/user-no-orders";
import { OrderItem } from "../order-item/order-item";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-user-order-container',
  imports: [UserNoOrders, OrderItem, CommonModule, FormsModule],
  templateUrl: './user-order-container.html',
  styleUrl: './user-order-container.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserOrderContainer implements OnInit {

  allOrders: Order[] = [];
  currentOrders: Order[] = [];
  activeTab: 'ongoing' | 'closed' = 'ongoing';

  ongoingCount = 0;
  hasOrders = false;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 3;
  paginatedOrders: Order[] = [];
  totalPages: number = 0;

  constructor(
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.orderService.getCurrentUserOrders().subscribe({
      next: (orders: Order[]) => {
        this.allOrders = orders;
        console.log('All Orders:', this.allOrders);

        this.ongoingCount = this.allOrders.filter(o =>
          o.status !== 'cancelled'
        ).length;

        this.updateTabView();
        this.cdr.markForCheck();
      },
      error: () => {
        this.allOrders = [];
        this.currentOrders = [];
        this.hasOrders = false;
        this.paginatedOrders = [];
        this.cdr.markForCheck();
      }
    });
  }

  setActiveTab(tab: 'ongoing' | 'closed'): void {
    this.activeTab = tab;
    this.currentPage = 1; // Reset to first page when switching tabs
    this.updateTabView();
    this.cdr.markForCheck();
  }

  private updateTabView(): void {
    this.currentOrders = this.allOrders.filter(order => {
      if (this.activeTab === 'ongoing') {
        return order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered';
      } else {
        return order.status === 'cancelled';
      }
    });

    // Update hasOrders based on the filtered currentOrders
    this.hasOrders = this.currentOrders.length > 0;

    // Update pagination after filtering
    this.updatePagination();
  }

  // Pagination methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.currentOrders.length / this.itemsPerPage);

    // Ensure current page is valid
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }

    this.updatePaginatedOrders();
  }

  updatePaginatedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.currentOrders.slice(startIndex, endIndex);
  }

  goToPage(page: any): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedOrders();
      this.cdr.markForCheck();
    }
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1; // Reset to first page
    this.updatePagination();
    this.cdr.markForCheck();
  }

  getStartIndex(): number {
    return this.currentOrders.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.currentOrders.length);
  }

  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (this.totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

      // Add dots if there's a gap after first page
      if (startPage > 2) {
        pages.push('...');
      }

      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add dots if there's a gap before last page
      if (endPage < this.totalPages - 1) {
        pages.push('...');
      }

      // Show last page
      if (this.totalPages > 1) {
        pages.push(this.totalPages);
      }
    }

    return pages;
  }
}
