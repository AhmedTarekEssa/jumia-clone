import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WishlistService } from '../../../../core/services/wishlist';
import { DecimalPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// import { CartService } from '../../services/cart.service'; // Assuming you have a CartService

interface WishlistItem {
  wishlistItemId: number;
  productId: number;
  productName: string;
  mainImageUrl: string;
  unitPrice: number;
  originalPrice?: number;
  size?: string;
  brandName?: string;
  isExpress?: boolean;
}

interface WishlistResponse {
  wishlistId: number;
  customerId: number;
  wishlistItems: WishlistItem[];
  totalQuantity: number;
}

@Component({
  selector: 'app-wishlist',
  imports: [DecimalPipe,RouterModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})



export class Wishlist implements OnInit {
  // wishlistItems: WishlistItem[] = [];
  // isLoading: boolean = true;
  // errorMessage: string = '';

  // constructor(
  //   private wishlistService: WishlistService,
  //   // private cartService: CartService
  // ) {}

  // ngOnInit(): void {
  //   this.loadWishlist();
  // }

  // loadWishlist(): void {
  //   this.isLoading = true;
  //   this.errorMessage = '';

  //   this.wishlistService.getWishlist().subscribe({
  //     next: (items) => {
  //       this.wishlistItems = items;
  //       this.isLoading = false;
  //       console.log('Wishlist items loaded:', this.wishlistItems);
  //     },
  //     error: (err) => {
  //       this.errorMessage = 'Failed to load wishlist. Please try again later.';
  //       this.isLoading = false;
  //       console.error('Error loading wishlist:', err);
  //     }
  //   });
  // }

  // removeFromWishlist(itemId: number): void {
  //   this.wishlistService.removeFromWishlist(itemId).subscribe({
  //     next: () => {
  //       this.wishlistItems = this.wishlistItems.filter(item => item.id !== itemId);
  //     },
  //     error: (err) => {
  //       console.error('Error removing item from wishlist:', err);
  //       alert('Failed to remove item. Please try again.');
  //     }
  //   });
  // }

  // addToCart(item: WishlistItem): void {
  //   // this.cartService.addToCart(item.id).subscribe({
  //   //   next: () => {
  //   //     alert(`${item.name} added to cart successfully!`);
  //   //     // Optional: Remove from wishlist after adding to cart
  //   //     this.removeFromWishlist(item.id);
  //   //   },
  //   //   error: (err) => {
  //   //     console.error('Error adding item to cart:', err);
  //   //     alert('Failed to add item to cart. Please try again.');
  //   //   }
  //   // });
  //   console.log(`${item.name} added to cart successfully!`);
  // }

  // clearWishlist(): void {
  //   if (confirm('Are you sure you want to clear your entire wishlist?')) {
  //     this.wishlistService.clearWishlist().subscribe({
  //       next: () => {
  //         this.wishlistItems = [];
  //         alert('Wishlist cleared successfully!');
  //       },
  //       error: (err) => {
  //         console.error('Error clearing wishlist:', err);
  //         alert('Failed to clear wishlist. Please try again.');
  //       }
  //     });
  //   }
  // }
  wishlist?: WishlistResponse;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck(); // Mark for check before async operation

    this.wishlistService.getWishlist().subscribe({
      next: (response) => {
        this.wishlist = response;
        this.isLoading = false;
        this.cdr.detectChanges(); // Explicitly trigger change detection
      },
      error: (err) => {
        this.errorMessage = 'Failed to load wishlist. Please try again later.';
        this.wishlist = undefined;
        this.isLoading = false;

        this.cdr.detectChanges(); // Trigger change detection on error

      }
    });
  }
  navigateToHome(): void {
    this.router.navigate(['/']);
    this.cdr.markForCheck(); // Mark for check after navigation
  }

  removeFromWishlist(wishlistItemId: number): void {
    this.wishlistService.removeFromWishlist(wishlistItemId).subscribe({
      next: () => {
        if (this.wishlist) {
          this.wishlist.wishlistItems = this.wishlist.wishlistItems.filter(
            item => item.wishlistItemId !== wishlistItemId
          );
          this.wishlist.totalQuantity = this.wishlist.wishlistItems.length;
          this.cdr.detectChanges(); // Update view after removal
        }
      },
      error: (err) => {
        console.error('Error removing item from wishlist:', err);
        alert('Failed to remove item. Please try again.');
        this.cdr.markForCheck(); // Mark for check on error
      }
    });
  }

  addToCart(item: WishlistItem): void {
    console.log('Adding to cart:', item.productName);
    
    this.cdr.markForCheck(); // Mark for check before async operation
    // Implement your cart service logic here
  }

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      this.wishlistService.clearWishlist().subscribe({
        next: () => {
          if (this.wishlist) {
            this.wishlist.wishlistItems = [];
            this.wishlist.totalQuantity = 0;
            this.cdr.detectChanges(); // Update view after clearing
          }
          alert('Wishlist cleared successfully!');
        },
        error: (err) => {
          console.error('Error clearing wishlist:', err);
          alert('Failed to clear wishlist. Please try again.');
          this.cdr.markForCheck(); // Mark for check on error
        }
      });
    }
  }

}
