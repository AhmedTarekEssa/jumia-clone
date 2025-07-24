
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css'
})
export class AdminSidebar {
  // toggleSidebar() : void {
  //   const sidebar: HTMLElement | null = document.getElementById('sidebar');
  //   const overlay: HTMLElement | null = document.querySelector('.sidebar-overlay');
  //   const mainContent: HTMLElement | null = document.getElementById('mainContent');
    
  //   if (!sidebar || !overlay || !mainContent) {
  //       console.error('One or more required elements not found');
  //       return;
  //   }
    
  //   sidebar.classList.toggle('active');
  //   overlay.classList.toggle('active');
    
  //   // On mobile, don't adjust main content margin
  //   if (window.innerWidth <= 768) {
  //       return;
  //   }
    
  //   if (sidebar.classList.contains('active')) {
  //       mainContent.classList.add('sidebar-open');
  //   } else {
  //       mainContent.classList.remove('sidebar-open');
  //   }

  // }

 
 
}
