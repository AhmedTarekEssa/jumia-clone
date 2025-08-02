import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WishlistService } from '../../../../core/services/wishlist';
import { DecimalPipe, CommonModule } from '@angular/common'; // Import CommonModule
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule

// Import CartService, ProductService, AddToCart, ProductDetails, Variant
import { CartService } from '../../../../core/services/cart-service/cart-service';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { AddToCart } from '../../../cart/cart-models';
// Assuming ProductDetails and Variant are here
import { environment } from '../../../../../environments/environment.development';
import { IsVariantPipe } from '../../../../shared/pipes/is-variant-pipe'; // Assuming you have this pipe
import { ParseNumberPipe } from '../../../../shared/pipes/parse-number-pipe'; // Assuming you have this pipe
import { ProductDetails, Variant } from '../../../products/product-models';


interface WishlistItem {
  wishlistItemId: number;
  productId: number;
  productName: string;
  mainImageUrl: string;
  unitPrice: number;
  originalPrice?: number;
  size?: string; // This might imply a variant. If so, we need to fetch full product details.
  brandName?: string;
  isExpress?: boolean;
}

interface WishlistResponse {
  wishlistId: number;
  customerId: number;
  wishlistItems: WishlistItem[];
  totalQuantity: number;
}

// --- New/Modified Types for Cart Popup ---
export type WishlistCartSelectableItem = Variant | ProductDetails;

export interface WishlistCartSelection {
  productId: number;
  item: WishlistCartSelectableItem;
  quantity: number;
  // availableStockQuantity will be derived
}
// --- End New/Modified Types ---

@Component({
  selector: 'app-wishlist',
  imports: [DecimalPipe, RouterModule, CommonModule, FormsModule, IsVariantPipe, ParseNumberPipe], // Add CommonModule, FormsModule, Pipes
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist implements OnInit {
  wishlist?: WishlistResponse;
  isLoading: boolean = true;
  errorMessage: string = '';

  // Properties for the cart popup
  showCartPopup: boolean = false;
  currentProductForCart: ProductDetails | undefined; // Holds the full product details for the popup
  cartSelections: WishlistCartSelection[] = [];
  cartQuantities: { [id: number]: number } = {}; // To track items already in the main cart
  baseImageUrl = environment.ImageUrlBase;

  private parseNumberPipe = new ParseNumberPipe(); // Instantiate pipe for component logic

  constructor(
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cartService: CartService, // Inject CartService
    private productService: ProductService // Inject ProductService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
    this.fetchCartQuantities(); // Fetch initial cart quantities
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.wishlistService.getWishlist().subscribe({
      next: (response) => {
        this.wishlist = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load wishlist. Please try again later.';
        this.wishlist = undefined;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchCartQuantities(): void {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartQuantities = {};
        cart.cartItems.forEach(item => {
          if (item.variationId) {
            this.cartQuantities[item.variationId] = item.quantity;
          } else {
            this.cartQuantities[item.productId] = item.quantity;
          }
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error fetching cart for wishlist:", err)
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
    this.cdr.markForCheck();
  }

  removeFromWishlist(wishlistItemId: number): void {
    this.wishlistService.removeFromWishlist(wishlistItemId).subscribe({
      next: () => {
        if (this.wishlist) {
          this.wishlist.wishlistItems = this.wishlist.wishlistItems.filter(
            item => item.wishlistItemId !== wishlistItemId
          );
          this.wishlist.totalQuantity = this.wishlist.wishlistItems.length;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error removing item from wishlist:', err);
        alert('Failed to remove item. Please try again.');
        this.cdr.markForCheck();
      }
    });
  }

  // --- Cart Popup Logic (Copied/Adapted from ProductDetailC) ---

  // Type guard function
  isVariant(item: WishlistCartSelectableItem): item is Variant {
    return (item as Variant).variantId !== undefined;
  }

  getItemIdentifier(item: WishlistCartSelectableItem): number {
    return this.isVariant(item) ? item.variantId : item.productId;
  }

  getItemName(item: WishlistCartSelectableItem): string {
    return this.isVariant(item) ? item.variantName : item.name;
  }

  getItemImageUrl(item: WishlistCartSelectableItem): string| File {
    // Check if variantImageUrl exists first, then mainImageUrl for ProductDetails
    return this.isVariant(item) ? (item.variantImageUrl || this.currentProductForCart?.mainImageUrl || '') : item.mainImageUrl;
  }

  getItemPrice(item: WishlistCartSelectableItem): number {
    return this.isVariant(item) ? item.price : item.basePrice;
  }

  getItemDiscountPercentage(item: WishlistCartSelectableItem): number {
    const discount = this.isVariant(item) ? item.discountPercentage : this.parseNumberPipe.transform(item.discountPercentage);
    return discount || 0;
  }

  getItemStockQuantity(item: WishlistCartSelectableItem): number {
    return this.isVariant(item) ? item.stockQuantity : item.stockQuantity;
  }

  getAvailableStockQuantity(item: WishlistCartSelectableItem): number {
    const totalStock = this.getItemStockQuantity(item);
    const inCartQty = this.cartQuantities[this.getItemIdentifier(item)] || 0;
    return Math.max(0, totalStock - inCartQty);
  }

  public getItemAvailability(item: WishlistCartSelectableItem): boolean {
    return item.isAvailable;
  }

  // Modified addToCart to open popup
  addToCart(wishlistItem: WishlistItem): void {
    // Fetch full product details before opening the popup
    this.productService.getProductDetails(wishlistItem.productId).subscribe({
      next: (productDetails) => {
        this.currentProductForCart = productDetails;
        this.openCartPopup();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching product details for cart popup:', err);
        alert('Could not load product details for adding to cart. Please try again.');
      }
    });
  }

  openCartPopup(): void {
    if (!this.currentProductForCart) {
      console.warn('No product details available to open cart popup.');
      return;
    }

    this.showCartPopup = true;
    const product = this.currentProductForCart;

    if (product.variants && product.variants.length > 0) {
      this.cartSelections = product.variants
        .filter(v => v.isAvailable && this.getAvailableStockQuantity(v) > 0)
        .map(v => ({ productId: product.productId, item: v, quantity: 0 }));
    } else {
      if (product.isAvailable && this.getAvailableStockQuantity(product) > 0) {
        this.cartSelections = [{
          productId: product.productId,
          item: product,
          quantity: 0
        }];
      } else {
        this.cartSelections = [];
      }
    }
    this.cdr.detectChanges();
  }

  closeCartPopup(): void {
    this.showCartPopup = false;
    this.currentProductForCart = undefined; // Clear the product
    this.cartSelections = []; // Clear selections
    this.cdr.detectChanges();
  }

  updateVariantQuantity(itemId: number, change: number): void {
    const selection = this.cartSelections.find(s => this.getItemIdentifier(s.item) === itemId);

    if (selection) {
      const availableStock = this.getAvailableStockQuantity(selection.item);
      const newQty = selection.quantity + change;

      if (newQty >= 0 && newQty <= availableStock) {
        selection.quantity = newQty;
      }
      this.cdr.detectChanges(); // Update view immediately
    }
  }

  setVariantQuantity(itemId: number, quantity: number): void {
    const selection = this.cartSelections.find(s => this.getItemIdentifier(s.item) === itemId);
    if (selection) {
      const availableStock = this.getAvailableStockQuantity(selection.item);
      selection.quantity = Math.max(0, Math.min(quantity, availableStock));
      this.cdr.detectChanges(); // Update view immediately
    }
  }

  getTotalItems(): number {
    return this.cartSelections.reduce((sum, s) => sum + s.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartSelections.reduce((total, s) => {
      let itemPrice: number;
      let itemDiscountPercentage: number;

      if (this.isVariant(s.item)) {
        itemPrice = s.item.price;
        itemDiscountPercentage = s.item.discountPercentage;
      } else {
        itemPrice = s.item.basePrice;
        itemDiscountPercentage = s.item.discountPercentage || 0;
      }

      return total + (s.quantity * (itemPrice * (1 - itemDiscountPercentage / 100)));
    }, 0);
  }

  addToCartApi(): void { // Renamed from addToCart to avoid conflict with method above
    const itemsToAdd = this.cartSelections.filter(s => s.quantity > 0);
    if (itemsToAdd.length === 0) {
      alert('Please select at least one item with quantity.');
      return;
    }
    console.log('Adding to cart:', itemsToAdd);

    const items = itemsToAdd.map(i => ({
      productId: i.productId,
      variantId: this.isVariant(i.item) ? i.item.variantId : null,
      quantity: i.quantity
    }));
    console.log(items);

    this.cartService.addToCart(items).subscribe(
      {
        next: () => {
          console.log("added to cart");
          // Update cartQuantities and then re-fetch wishlist or just update counts
          itemsToAdd.forEach(selection => {
            const id = this.getItemIdentifier(selection.item);
            this.cartQuantities[id] = (this.cartQuantities[id] || 0) + selection.quantity;
          });
          this.closeCartPopup();
          this.fetchCartQuantities(); // Re-fetch cart quantities to update available stock if needed later
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("error adding to cart", err);
          alert('Failed to add item(s) to cart. Please try again.');
        }
      }
    );
  }

  clearWishlist(): void {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      this.wishlistService.clearWishlist().subscribe({
        next: () => {
          if (this.wishlist) {
            this.wishlist.wishlistItems = [];
            this.wishlist.totalQuantity = 0;
            this.cdr.detectChanges();
          }
          alert('Wishlist cleared successfully!');
        },
        error: (err) => {
          console.error('Error clearing wishlist:', err);
          alert('Failed to clear wishlist. Please try again.');
          this.cdr.markForCheck();
        }
      });
    }
  }

}
