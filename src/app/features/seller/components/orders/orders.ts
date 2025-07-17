import { Component } from '@angular/core';
import { signal } from '@angular/core';
//import math


@Component({
  selector: 'app-orders',
  imports: [],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders {
    // Sidebar state
  isCollapsed = false;
  showSidebar = false;
  isSidebarOpen = false;
  currentFilter: 'country' | 'date' | 'all' = 'all';

  // Status tabs
  statusTabs = [
    { name: 'All', active: true, count: null },
    { name: 'Pending', active: false, count: 0 },
    { name: 'Processing', active: false, count: 0 },
    { name: 'Completed', active: false, count: 0 },
    { name: 'Cancelled', active: false, count: 0 }
  ];

  // Order actions
  orderActions = [
    { name: 'Print labels', icon: 'bi-printer', action: 'print' },
    { name: 'Mark as ready', icon: 'bi-box-seam', action: 'ready' },
    { name: 'Mark as shipped', icon: 'bi-truck', action: 'ship' },
    { name: 'Cancel orders', icon: 'bi-x-circle', action: 'cancel' }
  ];

  // Table data
  columns = [
    { name: 'Order #', sortable: true, sortDirection: 'asc' },
    { name: 'Order Date', sortable: true },
    { name: 'Pending Since', sortable: true },
    { name: 'Payment Method', sortable: false },
    { name: 'Price', sortable: true },
    { name: 'Items', sortable: false },
    { name: 'Packed', sortable: false },
    { name: 'Labels', sortable: false },
    { name: 'Shipment', sortable: false },
    { name: 'Actions', sortable: false }
  ];

  // Sample orders data - replace with your actual data
  filteredOrders = [
    {
      orderNumber: '1001',
      orderDate: new Date(),
      pendingSince: new Date(),
      paymentMethod: 'Credit Card',
      price: 99.99,
      itemCount: 3,
      packedItems: 0,
      labels: ['Fragile'],
      shipmentMethod: 'Standard',
      status: 'Pending',
      selected: false
    }
    // Add more sample orders as needed
  ];

  // Selection state
  selectedOrders: any[] = [];

  // Search state
  searchQuery = signal('');

  // Loading state
  isLoading = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = signal(10);
  itemsPerPageOptions = [10, 25, 50, 100];
  totalItems = 0;

  // Filter options
  countries = ['USA', 'Canada', 'UK', 'Germany', 'France'];
  filterOptions = {
    printed: ['All', 'Printed', 'Not Printed'],
    paymentMethod: ['All', 'Credit Card', 'PayPal', 'Bank Transfer'],
    shippingInfo: ['All', 'Express', 'Standard', 'International']
  };

  // Filter values
  countryFilter = signal('');
  dateRangeFilter = signal({ start: '', end: '' });
  printedFilter = signal('All');
  paymentMethodFilter = signal('All');
  shippingInfoFilter = signal('All');

  // TrackBy functions
  trackByStatusTab = (index: number, tab: any) => tab.name;
  trackByAction = (index: number, action: any) => action.action;
  trackByColumn = (index: number, column: any) => column.name;
  trackByOrderNumber = (index: number, order: any) => order.orderNumber;
  trackByLabel = (index: number, label: string) => label;

  // Methods
  toggleSidebar(filterType?: 'country' | 'date' | 'all') {
    if (filterType) {
      this.currentFilter = filterType;
    }
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  selectTab(index: number) {
    this.statusTabs.forEach((tab, i) => tab.active = i === index);
  }

  openCountryFilter() {
    this.currentFilter = 'country';
    this.isSidebarOpen = true;
  }

  openDateFilter() {
    this.currentFilter = 'date';
    this.isSidebarOpen = true;
  }

  executeBulkAction(action: string) {
    console.log('Bulk action:', action, this.selectedOrders);
    // Implement your bulk action logic here
  }

  updateSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  searchOrders() {
    console.log('Searching for:', this.searchQuery());
    // Implement search logic here
  }

  exportOrders() {
    console.log('Exporting orders');
    // Implement export logic here
  }

  selectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.filteredOrders.forEach(order => order.selected = checked);
    this.selectedOrders = checked ? [...this.filteredOrders] : [];
  }

  sortOrders(columnName: string) {
    console.log('Sorting by:', columnName);
    // Implement sorting logic here
  }

  toggleOrderSelection(order: any) {
    order.selected = !order.selected;
    if (order.selected) {
      this.selectedOrders.push(order);
    } else {
      this.selectedOrders = this.selectedOrders.filter(o => o !== order);
    }
  }

  executeOrderAction(action: string, order: any) {
    console.log('Order action:', action, order);
    // Implement order action logic here
  }

  changeItemsPerPage(value: number) {
    this.itemsPerPage.set(value);
    this.currentPage = 1;
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  updateCountry(country: string) {
    this.countryFilter.set(country);
  }

  updateDateRange(start: string, end: string) {
    this.dateRangeFilter.set({ start, end });
  }

  updatePrinted(value: string) {
    this.printedFilter.set(value);
  }

  updatePaymentMethod(method: string) {
    this.paymentMethodFilter.set(method);
  }

  updateShippingInfo(info: string) {
    this.shippingInfoFilter.set(info);
  }

  clearFilters() {
    this.countryFilter.set('');
    this.dateRangeFilter.set({ start: '', end: '' });
    this.printedFilter.set('All');
    this.paymentMethodFilter.set('All');
    this.shippingInfoFilter.set('All');
  }

  applyFilters() {
    this.isSidebarOpen = false;
    console.log('Filters applied');
    // Implement filter application logic here
  }

  getCurrentPageOrders() {
    // Simple pagination - implement your actual pagination logic
    const start = (this.currentPage - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredOrders.slice(start, end);
  }


}
