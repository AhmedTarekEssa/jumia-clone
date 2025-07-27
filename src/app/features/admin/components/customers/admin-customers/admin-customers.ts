import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../../core/services/User-Service/user';
import { finalize } from 'rxjs';


export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
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
  // filteredCustomers: Customer[] = [];
  
  newCustomer = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: ''
  };

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

    console.log("ccccccccccccccccccc");
    
    this.userService.getAllCustomers().pipe(
      finalize(() => {
        this.isLoading = false;
              console.log('Loading finished');
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
          phone: c.phoneNumber, // Map to match your template
          joinDate: this.formatDate(c.dateOfBirth) // Format date for display
        }));
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
    return new Date(date).toISOString().split('T')[0];
  }

   get filteredCustomers(): Customer[] {
      console.log('Current search term:', this.searchTerm);
  console.log('All customers:', this.customers);
  
  if (!this.searchTerm?.trim()) {
    console.log('No search term - returning all customers');
    return this.customers;
  }

  const searchLower = this.searchTerm.trim().toLowerCase();
  console.log('Searching for:', searchLower);

  const filtered = this.customers.filter(customer => {
    const matches = (
      (customer.firstName?.toLowerCase().includes(searchLower)) ||
      (customer.lastName?.toLowerCase().includes(searchLower)) 
      // (customer.email?.toLowerCase().includes(searchLower)) ||
      // (customer.phoneNumber?.toLowerCase().includes(searchLower))
    );
    
    console.log(`Customer ${customer.email} matches:`, matches);
    return matches;
  });

  console.log('Filtered results:', filtered);
  return filtered;
  }

  // Add new customer
  addCustomer(): void {
    const newCustomer: Customer = {
      // id: Math.random().toString(36).substring(2), // Temp ID
      ...this.newCustomer,
      firstName: this.newCustomer.firstName,
      lastName: this.newCustomer.lastName,
      // name: `${this.newCustomer.firstName} ${this.newCustomer.lastName}`,
      phoneNumber: this.newCustomer.phoneNumber,
      dateOfBirth: new Date(),
      gender: 'Unknown',
      
      
      // totalOrders: 0,
      // totalSpent: 0
    };
    
    this.customers = [...this.customers, newCustomer];
    this.resetCustomerForm();
  }

  private resetCustomerForm(): void {
    this.newCustomer = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
    gender: ''
      // status: 'Active'
    };
    this.showAddForm = false;
  }
}

  

  // get filteredCustomers(): Customer[] {
  //   return this.customers.filter(customer => {
  //     const matchesSearch = customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //                          customer.email.toLowerCase().includes(this.searchTerm.toLowerCase());
  //     const matchesStatus = !this.statusFilter || customer.status === this.statusFilter;
  //     return matchesSearch && matchesStatus;
  //   });
  // }

  // addCustomer(): void {
  //   if (this.newCustomer.name && this.newCustomer.email && this.newCustomer.phone) {
  //     const customer: Customer = {
  //       id: this.customers.length + 1,
  //       ...this.newCustomer,
  //       joinDate: new Date().toISOString().split('T')[0],
  //       totalOrders: 0,
  //       totalSpent: 0
  //     };
  //     this.customers.push(customer);
  //     this.newCustomer = { name: '', email: '', phone: '', status: 'Active' };
  //     this.showAddForm = false;
  //   }
  // }

  

