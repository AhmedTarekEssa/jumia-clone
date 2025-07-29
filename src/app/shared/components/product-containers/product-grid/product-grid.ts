import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductFilterRequest, ProductUi, Variant } from '../../../../features/products/product-models';
import { DiscountPricePipe } from '../../../pipes/discount-price-pipe';
import { Router } from '@angular/router';
import { AddToCart } from '../../../../features/cart/cart-models';
import { CartService } from '../../../../core/services/cart-service/cart-service';
import { environment } from '../../../../../environments/environment.development';
import { IsVariantPipe } from '../../../pipes/is-variant-pipe';
import { ParseNumberPipe } from '../../../pipes/parse-number-pipe';

// Assuming ProductUi is similar to ProductDetails for non-variant products
// You should define or import ProductUi properly. For now, I'll assume it has:
// productId, name, imageUrl (or mainImageUrl), basePrice, discountPercentage (string), stockQuantity, isAvailable, variants: Variant[]
// If ProductUi is *exactly* ProductDetails, you can reuse that.
// For this example, let's make a clear distinction if needed or just use ProductDetails.

// Re-use or define CartSelectableItem/CartSelection for this component
// This needs to be a union type that represents what can be selected.
// In ProductGrid, it seems like you're selecting either a ProductUi OR a Variant.
type ProductGridSelectableItem = ProductUi | Variant;

interface ProductGridCartSelection {
  productId: number; // The parent product's ID
  item: ProductGridSelectableItem; // The actual selectable item (ProductUi or Variant)
  quantity: number;
  // This will store the actual stock of the item (variant or product)
  // after deducting current cart quantities.
  availableStockQuantity: number;
}

// Type guard function (can be shared or defined locally)
function isVariant(item: ProductGridSelectableItem): item is Variant {
  return (item as Variant).variantId !== undefined;
}


@Component({
  selector: 'app-product-grid',
  imports: [CommonModule, FormsModule, DiscountPricePipe, IsVariantPipe,ParseNumberPipe], // Add pipes
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.css'
})
export class ProductGrid implements OnInit, OnChanges {

  private productService = inject(ProductService)
  private cdr = inject(ChangeDetectorRef)
  private router = inject(Router)
  private cartService = inject(CartService)
  baseImageUrl = environment.ImageUrlBase;
  products!: ProductUi[];
  product!: ProductUi; // This seems to be a single product variable, ensure it's used correctly
  lowStock: boolean = false;
  isWishlisted: boolean = false;
  selectedVariant!: Variant; // Still potentially used for single product details in grid (less common)
  currentImageIndex: number = 0;
  allImages: string[] = [];
  showCartPopup: boolean = false;
  cartSelections: ProductGridCartSelection[] | undefined = []; // Use the new type
  cartQuantities: { [id: number]: number } = {}; // Stores existing cart quantities (variantId or productId)
  item!: AddToCart;
  @Input() productsFilters!: ProductFilterRequest;

  // Instantiate pipes for use in component logic
  private parseNumberPipe = new ParseNumberPipe();


  ngOnInit(): void {
    this.productService.productsByFilters(this.productsFilters, 1, 20).subscribe({
      next: (data) => {
        this.products = data.items;
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
      error: (err) => console.error("Error fetching products", err)
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.productService.productsByFilters(this.productsFilters, 1, 10).subscribe({
      next: (data) => {
        console.log(data)
        this.products = data.items
        this.cdr.detectChanges();
      }
    })
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

  // --- Helper Functions (Copied/Adapted from ProductDetailC) ---
  // These functions will determine properties based on whether the item is a Variant or ProductUi

  getItemIdentifier(item: ProductGridSelectableItem): number {
    return isVariant(item) ? item.variantId : item.productId;
  }

  getItemName(item: ProductGridSelectableItem): string {
    return isVariant(item) ? item.variantName : item.name;
  }

  getItemImageUrl(item: ProductGridSelectableItem): string {
    return isVariant(item) ? (item.variantImageUrl as string) : item.imageUrl; // Use imageUrl from ProductUi
  }

  getItemPrice(item: ProductGridSelectableItem): number {
    return isVariant(item) ? item.price : item.basePrice;
  }

  getItemDiscountPercentage(item: ProductGridSelectableItem): number {
    const discount = isVariant(item) ? item.discountPercentage : this.parseNumberPipe.transform(item.discountPercentage);
    return discount || 0;
  }

  getItemStockQuantity(item: ProductGridSelectableItem): number {
    // This now returns the *initial* stock from the item, not the availableStockQuantity from selection
    // The availableStockQuantity from the selection should be used for max quantity logic
    return isVariant(item) ? item.stockQuantity : item.stockQuantity;
  }

  // New helper to get the calculated available stock for the selection
  // This is used for input max and button disabled states
  getSelectionAvailableStock(selection: ProductGridCartSelection): number {
    return selection.availableStockQuantity;
  }

  getItemIsAvailable(item: ProductGridSelectableItem): boolean {
    return item.isAvailable;
  }

  // --- End Helper Functions ---


  updateVariantQuantity(itemId: number, change: number): void {
    // Note: The 'itemId' here refers to variantId or productId, as returned by getItemIdentifier
    const selection = this.cartSelections!.find(s => this.getItemIdentifier(s.item) === itemId);

    if (selection) {
      const currentAvailableStock = selection.availableStockQuantity;
      const newQty = selection.quantity + change;

      // Ensure quantity stays within bounds [0, availableStock]
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

        // Update cart quantities in local cache
        itemsToAdd.forEach(selection => {
          const id = this.getItemIdentifier(selection.item);
          this.cartQuantities[id] = (this.cartQuantities[id] || 0) + selection.quantity;
          // Also, update the available stock in the current popup
          selection.availableStockQuantity -= selection.quantity;
        });

        this.closeCartPopup();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error adding to cart", err);
        // Handle specific error messages from backend if needed
      }
    });
  }

  generateStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }
}