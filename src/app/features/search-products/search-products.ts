import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../core/services/cart-service/cart-service';
import { ProductUi, Variant } from '../products/product-models';
import { AddToCart } from '../cart/cart-models';
import { environment } from '../../../environments/environment.development';
import { Ai } from '../../core/services/ai-service/ai';
import { CommonModule } from '@angular/common';
import { DiscountPricePipe } from '../../shared/pipes/discount-price-pipe';
import { FormsModule } from '@angular/forms';
import { IsVariantPipe } from '../../shared/pipes/is-variant-pipe';
import { ParseNumberPipe } from '../../shared/pipes/parse-number-pipe';

type SearchSelectableItem = ProductUi | Variant;

interface SearchCartSelection {
  productId: number;
  item: SearchSelectableItem;
  quantity: number;
  availableStockQuantity: number;
}

function isVariant(item: SearchSelectableItem): item is Variant {
  return (item as Variant).variantId !== undefined;
}

@Component({
  selector: 'app-search-products',
  imports: [CommonModule, DiscountPricePipe, FormsModule, IsVariantPipe, ParseNumberPipe],
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
  product!: ProductUi;
  lowStock: boolean = false;
  isWishlisted: boolean = false;
  selectedVariant!: Variant;
  currentImageIndex: number = 0;
  allImages: string[] = [];
  showCartPopup: boolean = false;
  cartSelections: SearchCartSelection[] | undefined = [];
  cartQuantities: { [id: number]: number } = {};
  item!: AddToCart;
  query: string = '';

  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;
  totalItems: number = 0;

  private parseNumberPipe = new ParseNumberPipe();

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'];
      this.currentPage = 1;
      this.fetchdata();
    });
  }

  fetchdata(page: number = 1) {
    this.currentPage = page;
    this.aiService.semanticSearch(this.query).subscribe({
      next: (data) => {
        console.log("Search results:", data);
        this.products = data;
        this.totalItems = data.length;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        this.cdr.detectChanges();

        this.cartService.getCart().subscribe({
          next: (cart) => {
            cart.cartItems.forEach(item => {
              if (item.variationId) {
                this.cartQuantities[item.variationId] = item.quantity;
              } else {
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

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.fetchdata(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.fetchdata(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.fetchdata(this.currentPage - 1);
    }
  }

  getVisiblePages(): number[] {
    const visiblePages: number[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      const startPage = Math.max(1, Math.min(
        this.currentPage - Math.floor(maxVisible / 2),
        this.totalPages - maxVisible + 1
      ));

      const endPage = Math.min(this.totalPages, startPage + maxVisible - 1);

      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }
    }

    return visiblePages;
  }

  goToProductDetails(productId: number) {
    console.log("Navigating to product details for ID:", productId);
    this.router.navigate(['/Products', productId]);
  }

  addToWishlist(productId: number): void {
    console.log('Added to wishlist:', productId);
  }

  addToCart(productId: number, $event: MouseEvent) {
    $event.stopPropagation();
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

    if (product.variants && product.variants.length > 0) {
      this.cartSelections = product.variants
        .filter(v => v.isAvailable)
        .map(v => {
          const currentCartQty = this.cartQuantities[v.variantId] || 0;
          const remainingStock = v.stockQuantity - currentCartQty;
          return {
            productId: product.productId,
            item: v,
            quantity: 0,
            availableStockQuantity: remainingStock > 0 ? remainingStock : 0
          };
        });
      this.cartSelections = this.cartSelections.filter(s => s.availableStockQuantity > 0);
    } else {
      if (product.isAvailable) {
        const currentCartQty = this.cartQuantities[product.productId] || 0;
        const remainingStock = product.stockQuantity - currentCartQty;

        this.cartSelections = [{
          productId: product.productId,
          item: product,
          quantity: 0,
          availableStockQuantity: remainingStock > 0 ? remainingStock : 0
        }];
      } else {
        this.cartSelections = [];
      }
    }
    this.cdr.detectChanges();
  }

  closeCartPopup(): void {
    this.showCartPopup = false;
  }

  getItemIdentifier(item: SearchSelectableItem): number {
    return isVariant(item) ? item.variantId : item.productId;
  }

  getItemName(item: SearchSelectableItem): string {
    return isVariant(item) ? item.variantName : item.name;
  }

  getItemImageUrl(item: SearchSelectableItem): string {
    return isVariant(item) ? (item.variantImageUrl as string) : item.imageUrl;
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

    const items = itemsToAdd.map(i => ({
      productId: i.productId,
      variantId: isVariant(i.item) ? i.item.variantId : null,
      quantity: i.quantity
    }));

    const cartItemsPayload: AddToCart[] = items.map(i => ({
      productId: i.productId,
      variantId: i.variantId,
      quantity: i.quantity
    }));

    this.cartService.addToCart(cartItemsPayload).subscribe({
      next: () => {
        console.log("added to cart");
        itemsToAdd.forEach(selection => {
          const id = this.getItemIdentifier(selection.item);
          this.cartQuantities[id] = (this.cartQuantities[id] || 0) + selection.quantity;
          selection.availableStockQuantity -= selection.quantity;
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
