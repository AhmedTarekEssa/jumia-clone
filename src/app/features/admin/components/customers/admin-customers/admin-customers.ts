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
  standalone: true , 
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
      }
      )
    ).subscribe({
      next: (customers) => {
              console.log('Customers fetched:', customers); // Log the received data here
        if(customers && customers.length > 0) {
        this.customers = customers.map(c => ({
          ...c,
          name: `${c.firstName} ${c.lastName}`, // For display purposes
          phone: c.phone, // Map to match your template
          // joinDate: this.formatDate(c.user.dateOfBirth), // Format date for display
          email: c.email,
          gender: c.gender,
          isBlocked: c.isBlocked ?? false,
          customerId: c.customerId,
          userId: c.userId
        }));
        this.cdr.detectChanges();
                console.log('Mapped customers:', this.customers); // Log the mapped customers
      }else{
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
        // Check if the date is valid
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
      }
      return ''; 
  }

  
  // if (!this.searchTerm?.trim()) {
  //   console.log('No search term - returning all customers');
  //   return this.customers;
  // }

  // Filtered customers getter
  get filteredCustomers(): Customer[] {
    console.log('Current search term:', this.searchTerm);
    console.log('All customers:', this.customers);

    // Filter customers by search term and status filter (Blocked/Active)
    const filteredBySearch = this.customers.filter(customer => {
      const searchLower = this.searchTerm.trim().toLowerCase();
      return (
        customer.firstName?.toLowerCase().includes(searchLower) ||
        customer.lastName?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower)
      );
    });

    // Apply status filter (Blocked or Active)
    if (this.statusFilter) {
      return filteredBySearch.filter(customer =>
        this.statusFilter === 'blocked' ? customer.isBlocked : !customer.isBlocked
      );
    }

    return filteredBySearch;
  }

   toggleBlockStatus(customer: Customer): void {
    // Prevent toggling if userId is missing
  if (!customer.userId) {
    console.error('User ID is missing!');
    this.error = 'User ID is missing. Please try again later.';
    return;
  }

  // Optimistically update the UI first
  const originalStatus = customer.isBlocked;
  customer.isBlocked = !customer.isBlocked;
  

  // Call the API to toggle the block status
  this.userService.toggleBlockStatus(customer.customerId)
  .subscribe({
    next: (message) => {
      // Toggle the block status in the UI
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

  
  

