import { Component, inject, OnInit } from '@angular/core';
import { User, UserProfile } from '../../../../core/services/User-Service/user';

@Component({
  selector: 'app-admin-header',
  imports: [],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css'
})
export class AdminHeader implements OnInit{

   adminName: string = 'Admin'; // Default value
  adminInitial: string = 'A'; // Default initial

  constructor(private userService: User) { }

  ngOnInit(): void {
    this.loadAdminProfile();
  }

  loadAdminProfile(): void {
    this.userService.getAdmin().subscribe({
      next: (admins: UserProfile[]) => {
        if (admins && admins.length > 0) {
          const admin = admins[0]; // Assuming the first one is the admin we want
          this.adminName = admin.firstName + admin.lastName || admin.email || 'Admin';
          this.adminInitial = this.getInitial(this.adminName);
        }
      },
      error: (error) => {
        console.error('Failed to load admin profile:', error);
        // Keep the default values if there's an error
      }
    });
  }

  private getInitial(name: string): string {
    if (!name) return 'A';
    return name.charAt(0).toUpperCase();
  }

  toggleSidebar(): void {
    // Implement your sidebar toggle logic here
    console.log('Sidebar toggle clicked');
  }

  
}
