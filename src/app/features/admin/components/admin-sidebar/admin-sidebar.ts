import { CookieService } from 'ngx-cookie-service';

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';


@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css'
})
export class AdminSidebar {
  private authService = inject(AuthService);
  private router = inject(Router);
  private CookieService = inject(CookieService);


  toggleSidebar() : void {
    const sidebar: HTMLElement | null = document.getElementById('sidebar');
    const overlay: HTMLElement | null = document.querySelector('.sidebar-overlay');
    const mainContent: HTMLElement | null = document.getElementById('mainContent');
    
    if (!sidebar || !overlay || !mainContent) {
        console.error('One or more required elements not found');
        return;
    }
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // On mobile, don't adjust main content margin
    if (window.innerWidth <= 768) {
        return;
    }
    
    if (sidebar.classList.contains('active')) {
        mainContent.classList.add('sidebar-open');
    } else {
        mainContent.classList.remove('sidebar-open');
    }

  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.CookieService.get('UserInfo');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        if(this.CookieService.get('UserInfo')){
          this.CookieService.delete('UserInfo');
          this.router.navigate(['/home']);
        }else {
          this.router.navigate(['/home']);
          console.error('Logout Failed' , err);
        }
      }
    });
  }

 
 
}
