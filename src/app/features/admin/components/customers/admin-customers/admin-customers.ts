import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppUser, User, UserProfile } from '../../../../../core/services/User-Service/user';
import { finalize } from 'rxjs';

export interface Customer {
  customerId: number,
  userId: string,
  isBlocked: boolean,
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
}

@Component({
  standalone: true,
  selector: 'app-admin-customers',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-customers.html',
  styleUrl: './admin-customers.css'
})
export class AdminCustomers {
  showAddForm = false;
  searchTerm = '';
  statusFilter = '';
  isLoading = false;
  error = '';
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  totalCustomers: number = 0;
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 4;

  private cdr = inject(ChangeDetectorRef);
  private userService = inject(User);

  ngOnInit(): void {
    console.log("ngOnInit called");
    this.totalCustomers = this.customers.length;
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.error = '';
    
    this.userService.getAllCustomers().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (customers) => {
        console.log('Customers fetched:', customers);
        if (customers && customers.length > 0) {
          this.customers = customers.map(c => ({
            ...c,
            name: `${c.firstName} ${c.lastName}`,
            phone: c.phone,
            email: c.email,
            gender: c.gender,
            isBlocked: c.isBlocked ?? false,
            customerId: c.customerId,
            userId: c.userId
          }));
          this.totalCustomers = this.customers.length;
          this.cdr.detectChanges();
          console.log('Mapped customers:', this.customers);
        } else {
          this.error = 'No customers found.';
        }
      },
      error: (err) => {
        this.error = 'Failed to load customers. Please try again later.';
        console.error('Error loading customers:', err);
      }
    });
  }

  private formatDate(date: Date): string {
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];
      }
    }
    return '';
  }

  get filteredCustomers(): Customer[] {
    let filtered = this.customers.filter(customer => {
      const searchLower = this.searchTerm.trim().toLowerCase();
      return (
        customer.firstName?.toLowerCase().includes(searchLower) ||
        customer.lastName?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower))
    });

    if (this.statusFilter) {
      filtered = filtered.filter(customer =>
        this.statusFilter === 'blocked' ? customer.isBlocked : !customer.isBlocked
      );
    }

    // Apply pagination
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Pagination methods
  get totalPages(): number {
    const filtered = this.getFilteredCustomersWithoutPagination();
    return Math.ceil(filtered.length / this.itemsPerPage);
  }

  public getFilteredCustomersWithoutPagination(): Customer[] {
    let filtered = this.customers.filter(customer => {
      const searchLower = this.searchTerm.trim().toLowerCase();
      return (
        customer.firstName?.toLowerCase().includes(searchLower) ||
        customer.lastName?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower)
      );
    });

    if (this.statusFilter) {
      filtered = filtered.filter(customer =>
        this.statusFilter === 'blocked' ? customer.isBlocked : !customer.isBlocked
      );
    }
    return filtered;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  toggleBlockStatus(customer: Customer): void {
    if (!customer.userId) {
      console.error('User ID is missing!');
      this.error = 'User ID is missing. Please try again later.';
      return;
    }

    const originalStatus = customer.isBlocked;
    customer.isBlocked = !customer.isBlocked;

    this.userService.toggleBlockStatus(customer.customerId)
      .subscribe({
        next: (message) => {
          console.log('Block status updated successfully:', message);
        },
        error: (err) => {
          customer.isBlocked = originalStatus;
          this.error = 'Failed to update block status. Please try again later.';
          console.error('Error updating block status:', err);
        }
      });
  }
}