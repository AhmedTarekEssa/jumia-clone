import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SellerSidebar } from "../components/seller-sidebar/seller-sidebar";
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-container',
  imports: [RouterOutlet, SellerSidebar],
  templateUrl: './seller-container.html',
  styleUrl: './seller-container.css'
})
export class SellerContainer {
  constructor(private router: Router) {}
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
}
navigateToSellerDetails() {
    this.router.navigate(['/seller/details']);
  }
}
