import { Component , inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-empty',
  imports: [CommonModule],
  templateUrl: './cart-empty.html',
  styleUrl: './cart-empty.css'
})
export class CartEmpty {

  private router = inject(Router);

  onStartShopping(): void {

    // Navigate to home page or categories page
    this.router.navigate(['/']);

    // Optional: You can also navigate to a specific categories page
    // this.router.navigate(['/categories']);
  }



}
