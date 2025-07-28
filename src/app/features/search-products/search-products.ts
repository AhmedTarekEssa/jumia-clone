import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../core/services/cart-service/cart-service';
import { ProductUi, Variant } from '../products/product-models'; // Assuming ProductUi and Variant are correctly imported from here
import { AddToCart } from '../cart/cart-models';
import { environment } from '../../../environments/environment.development';
import { Ai } from '../../core/services/ai-service/ai';
import { CommonModule } from '@angular/common';
import { DiscountPricePipe } from '../../shared/pipes/discount-price-pipe'; // Correct path
import { FormsModule } from '@angular/forms';
import { IsVariantPipe } from '../../shared/pipes/is-variant-pipe';
import { ParseNumberPipe } from '../../shared/pipes/parse-number-pipe';

// --- Type Definitions (Copy from ProductGrid, ensure consistency) ---
type SearchSelectableItem = ProductUi | Variant;

interface SearchCartSelection {
  productId: number; // The parent product's ID
  item: SearchSelectableItem; // The actual selectable item (ProductUi or Variant)
  quantity: number;
  availableStockQuantity: number; // Calculated remaining stock
}

// Type guard function (can be shared or defined locally)
function isVariant(item: SearchSelectableItem): item is Variant {
  return (item as Variant).variantId !== undefined;
}
// --- End Type Definitions ---


@Component({
  selector: 'app-search-products',
  imports: [CommonModule, DiscountPricePipe, FormsModule, IsVariantPipe, ParseNumberPipe], // Add pipes here
  templateUrl: './search-products.html',
  styleUrl: './search-products.css'
})
export class SearchProducts implements OnInit {

  private aiService = inject(Ai);
  private router = inject(Router)
  private cartService = inject(CartService)
  private route = inject(ActivatedRoute)
  private cdr = inject(ChangeDetectorRef)
  baseImageUrl = environment.ImageUrlBase;
  products!: ProductUi[];
  product!: ProductUi; // Single product variable, be mindful of its usage
  lowStock: boolean = false;
  isWishlisted: boolean = false;
  selectedVariant!: Variant; // Less relevant for a grid, but exists
  currentImageIndex: number = 0;
  allImages: string[] = [];
  showCartPopup: boolean = false;
  cartSelections: SearchCartSelection[] | undefined = []; // Use the new type
  cartQuantities: { [id: number]: number } = {}; // Stores existing cart quantities (variantId or productId)
  item!: AddToCart;
  query: string = '';

  // Instantiate pipes for use in component logic
  private parseNumberPipe = new ParseNumberPipe();


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'];
      this.fetchdata(); // Call fetchdata here to react to query changes
      // No need for cdr.detectChanges() immediately after fetchdata() call, it's done inside fetchdata()'s subscription
    });
  }


  fetchdata() {
    this.aiService.semanticSearch(this.query).subscribe({
      next: (data) => {
        console.log("Search results:", data);
        this.products = data;
        this.cdr.detectChanges();

        // Fetch cart quantities when products are loaded
        this.cartService.getCart().subscribe({
          next: (cart) => {
            cart.cartItems.forEach(item => {
              if (item.variationId) { // Use variationId for variants
                this.cartQuantities[item.variationId] = item.quantity;
              } else { // Use productId for base products
                this.cartQuantities[item.productId] = item.quantity;
              }
            });
            this.cdr.detectChanges();
          },
          error: (err) => console.error("Error fetching cart", err)
        });
      },
      error: (err) => console.error("Error fetching search products", err)
    });
  }


  goToProductDetails(productId: number) {
    console.log("Navigating to product details for ID:", productId);
    this.router.navigate(['/Products', productId]);
  }

  addToWishlist(productId: number): void {
    // Implement wishlist functionality
    console.log('Added to wishlist:', productId);
  }

  addToCart(productId: number, $event: MouseEvent) {
    $event.stopPropagation(); // Prevent navigating to product details
    this.openCartPopup(productId);
  }


  openCartPopup(productId: number): void {
    this.showCartPopup = true;
    const product = this.products.find(p => p.productId === productId);

    if (!product) {
      console.warn(`Product with ID ${productId} not found.`);
      this.cartSelections = [];
      return;
    }

    console.log("Opening cart popup for product:", product);

    if (product.variants && product.variants.length > 0) {
      // Logic for products WITH variants
      this.cartSelections = product.variants
        .filter(v => v.isAvailable) // Only consider available variants
        .map(v => {
          const currentCartQty = this.cartQuantities[v.variantId] || 0;
          const remainingStock = v.stockQuantity - currentCartQty;
          return {
            productId: product.productId,
            item: v, // 'item' is the Variant
            quantity: 0,
            availableStockQuantity: remainingStock > 0 ? remainingStock : 0 // Ensure non-negative stock
          };
        });
      // Filter out selections where availableStockQuantity is 0 if you don't want them visible
      this.cartSelections = this.cartSelections.filter(s => s.availableStockQuantity > 0);

    } else {
      // Logic for products WITHOUT variants
      // Always add the base product if it's available.
      // Stock check for interaction will happen on the buttons themselves.
      if (product.isAvailable) {
        const currentCartQty = this.cartQuantities[product.productId] || 0;
        const remainingStock = product.stockQuantity - currentCartQty;

        this.cartSelections = [{
          productId: product.productId,
          item: product, // 'item' is the ProductUi
          quantity: 0,
          availableStockQuantity: remainingStock > 0 ? remainingStock : 0 // Ensure non-negative stock
        }];
        // If the product is truly out of available stock, you might still want it to show
        // but its quantity controls will be disabled. Or you could filter it out here:
        // if (this.cartSelections[0].availableStockQuantity <= 0) {
        //   this.cartSelections = [];
        // }
      } else {
        this.cartSelections = []; // Product not available, so no selection possible
      }
    }
    this.cdr.detectChanges();
  }


  closeCartPopup(): void {
    this.showCartPopup = false;
  }

  // --- Helper Functions (Copied/Adapted from ProductGrid) ---

  getItemIdentifier(item: SearchSelectableItem): number {
    return isVariant(item) ? item.variantId : item.productId;
  }

  getItemName(item: SearchSelectableItem): string {
    return isVariant(item) ? item.variantName : item.name;
  }

  getItemImageUrl(item: SearchSelectableItem): string {
    return isVariant(item) ? (item.variantImageUrl as string) : item.imageUrl; // Use imageUrl from ProductUi
  }

  getItemPrice(item: SearchSelectableItem): number {
    return isVariant(item) ? item.price : item.basePrice;
  }

  getItemDiscountPercentage(item: SearchSelectableItem): number {
    const discount = isVariant(item) ? item.discountPercentage : this.parseNumberPipe.transform(item.discountPercentage);
    return discount || 0;
  }

  getItemStockQuantity(item: SearchSelectableItem): number {
    return isVariant(item) ? item.stockQuantity : item.stockQuantity;
  }

  getSelectionAvailableStock(selection: SearchCartSelection): number {
    return selection.availableStockQuantity;
  }

  getItemIsAvailable(item: SearchSelectableItem): boolean {
    return item.isAvailable;
  }

  // --- End Helper Functions ---


  updateVariantQuantity(itemId: number, change: number): void {
    const selection = this.cartSelections!.find(s => this.getItemIdentifier(s.item) === itemId);

    if (selection) {
      const currentAvailableStock = selection.availableStockQuantity;
      const newQty = selection.quantity + change;

      if (newQty >= 0 && newQty <= currentAvailableStock) {
        selection.quantity = newQty;
      }
    }
  }

  setVariantQuantity(itemId: number, quantity: number): void {
    const selection = this.cartSelections!.find(s => this.getItemIdentifier(s.item) === itemId);
    if (selection) {
      const currentAvailableStock = selection.availableStockQuantity;
      selection.quantity = Math.max(0, Math.min(quantity, currentAvailableStock));
    }
  }

  getTotalItems(): number {
    return this.cartSelections!.reduce((sum, s) => sum + s.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartSelections!.reduce((total, s) =>
      total + (s.quantity * (this.getItemPrice(s.item) * (1 - this.getItemDiscountPercentage(s.item) / 100))), 0);
  }

  addToCartApi() {
   const itemsToAdd = this.cartSelections!.filter(s => s.quantity > 0);
       if (itemsToAdd.length === 0) {
         alert('Please select at least one item with quantity.');
         return;
       }
   
       console.log('Adding to cart:', itemsToAdd);
   
       const items = itemsToAdd.map(i => ({
         productId: i.productId,
         // Use the getItemIdentifier helper for the variantId/productId
         // productId is always required
         variantId: isVariant(i.item) ? i.item.variantId : null, // variantId is optional for base products
         quantity: i.quantity
       }));
   
       // Ensure you're sending the correct structure to your backend.
       // If your backend distinguishes by `variantId` being null/undefined for base products,
       // then the mapping above is correct. If it expects `productId` in place of `variantId`,
       // you might need to adjust the `variantId` line above.
       // For `AddToCart` interface, `variationId` seems to be the one for variants.
       const cartItemsPayload: AddToCart[] = items.map(i => ({
         productId: i.productId,
         variantId: i.variantId , // Pass undefined if no variant
         quantity: i.quantity
       }));

    this.cartService.addToCart(cartItemsPayload).subscribe({
      next: () => {
        console.log("added to cart");

        itemsToAdd.forEach(selection => {
          const id = this.getItemIdentifier(selection.item);
          this.cartQuantities[id] = (this.cartQuantities[id] || 0) + selection.quantity;
          selection.availableStockQuantity -= selection.quantity; // Update available stock in current popup
        });

        this.closeCartPopup();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error adding to cart", err);
      }
    });
  }


  generateStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }
}