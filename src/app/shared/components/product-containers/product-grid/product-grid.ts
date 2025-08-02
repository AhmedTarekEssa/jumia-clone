import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/Product-Service/product';
import {
  ProductFilterRequest,
  ProductUi,
  Variant,
} from '../../../../features/products/product-models';
import { DiscountPricePipe } from '../../../pipes/discount-price-pipe';
import { Router } from '@angular/router';
import { AddToCart } from '../../../../features/cart/cart-models';
import { CartService } from '../../../../core/services/cart-service/cart-service';
import { environment } from '../../../../../environments/environment.development';

import Swal from 'sweetalert2';
import { IsVariantPipe } from '../../../pipes/is-variant-pipe';
import { ParseNumberPipe } from '../../../pipes/parse-number-pipe';

type ProductGridSelectableItem = ProductUi | Variant;

interface ProductGridCartSelection {
  productId: number;
  item: ProductGridSelectableItem;
  quantity: number;
  availableStockQuantity: number;
}

function isVariant(item: ProductGridSelectableItem): item is Variant {
  return (item as Variant).variantId !== undefined;
}

@Component({
  selector: 'app-product-grid',
  imports: [
    CommonModule,
    FormsModule,
    DiscountPricePipe,
    IsVariantPipe,
    ParseNumberPipe
  ],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.css',
})
export class ProductGrid implements OnInit, OnChanges {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private cartService = inject(CartService);

  baseImageUrl = environment.ImageUrlBase;
  products: ProductUi[] = [];
  filteredProducts: ProductUi[] = [];
  product!: ProductUi;
  lowStock: boolean = false;
  isWishlisted: boolean = false;
  selectedVariant!: Variant;
  currentImageIndex: number = 0;
  allImages: string[] = [];
  showCartPopup: boolean = false;
  cartSelections: ProductGridCartSelection[] = [];
  cartQuantities: { [id: number]: number } = {};
  item!: AddToCart;

  @Input() productsFilters!: ProductFilterRequest;
  searchQuery: string = '';
  isSearchActive: boolean = false;

  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;
  totalItems: number = 0;

  private parseNumberPipe = new ParseNumberPipe();

  ngOnInit(): void {
    this.loadProducts(this.currentPage);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productsFilters']) {
      this.currentPage = 1;
      this.loadProducts(this.currentPage);
    }
  }

  loadProducts(page: number): void {
    this.productService
      .productsByFilters(this.productsFilters, page, this.pageSize)
      .subscribe({
        next: (data) => {
          this.filteredProducts= data.items;
          this.products = data.items;
          this.totalItems = data.totalCount;
          this.totalPages = Math.ceil(data.totalCount / this.pageSize);
          this.currentPage = page;
          this.cdr.detectChanges();

          this.cartService.getCart().subscribe({
            next: (cart) => {
              cart.cartItems.forEach((item) => {
                if (item.variationId) {
                  this.cartQuantities[item.variationId] = item.quantity;
                } else {
                  this.cartQuantities[item.productId] = item.quantity;
                }
              });
              this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching cart', err),
          });
        },
        error: (err) => {
          this.products = [];
          if (err.status === 404) {
            Swal.fire('No Products Found', '', 'warning');
          } else {
            console.error('Error fetching products', err);
          }
        },
      });
  }

  onSearchInput(): void {
    if (!this.searchQuery.trim()) {
      this.clearSearch();
    } else {
      this.filterProducts();
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.isSearchActive = true;
      this.filterProducts();
    } else {
      this.clearSearch();
    }
  }

  filterProducts(): void {
    const searchTerm = this.searchQuery.trim().toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );
    this.cdr.detectChanges();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isSearchActive = false;
    this.filteredProducts = this.products;
    this.cdr.detectChanges();
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.loadProducts(page);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadProducts(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadProducts(this.currentPage - 1);
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
      const startPage = Math.max(
        1,
        Math.min(
          this.currentPage - Math.floor(maxVisible / 2),
          this.totalPages - maxVisible + 1
        )
      );

      const endPage = Math.min(this.totalPages, startPage + maxVisible - 1);

      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }
    }

    return visiblePages;
  }

  goToProductDetails(productId: number): void {
    this.router.navigate(['/Products', productId]);
  }

  addToWishlist(productId: number): void {
    console.log('Added to wishlist:', productId);
  }

  addToCart(productId: number, $event: MouseEvent): void {
    $event.stopPropagation();
    this.openCartPopup(productId);
  }

  openCartPopup(productId: number): void {
    this.showCartPopup = true;
    const products = this.isSearchActive ? this.filteredProducts : this.products;
    const product = products.find((p) => p.productId === productId);

    if (!product) {
      console.warn(`Product with ID ${productId} not found.`);
      this.cartSelections = [];
      return;
    }

    if (product.variants && product.variants.length > 0) {
      this.cartSelections = product.variants
        .filter((v) => v.isAvailable)
        .map((v) => {
          const currentCartQty = this.cartQuantities[v.variantId] || 0;
          const remainingStock = v.stockQuantity - currentCartQty;
          return {
            productId: product.productId,
            item: v,
            quantity: 0,
            availableStockQuantity: remainingStock > 0 ? remainingStock : 0,
          };
        })
        .filter((s) => s.availableStockQuantity > 0);
    } else {
      if (product.isAvailable) {
        const currentCartQty = this.cartQuantities[product.productId] || 0;
        const remainingStock = product.stockQuantity - currentCartQty;

        this.cartSelections = [
          {
            productId: product.productId,
            item: product,
            quantity: 0,
            availableStockQuantity: remainingStock > 0 ? remainingStock : 0,
          },
        ];
      } else {
        this.cartSelections = [];
      }
    }
    this.cdr.detectChanges();
  }

  closeCartPopup(): void {
    this.showCartPopup = false;
  }

  getItemIdentifier(item: ProductGridSelectableItem): number {
    return isVariant(item) ? item.variantId : item.productId;
  }

  getItemName(item: ProductGridSelectableItem): string {
    return isVariant(item) ? item.variantName : item.name;
  }

  getItemImageUrl(item: ProductGridSelectableItem): string {
    return isVariant(item) ? (item.variantImageUrl as string) : item.imageUrl;
  }

  getItemPrice(item: ProductGridSelectableItem): number {
    return isVariant(item) ? item.price : item.basePrice;
  }

  getItemDiscountPercentage(item: ProductGridSelectableItem): number {
    const discount = isVariant(item)
      ? item.discountPercentage
      : this.parseNumberPipe.transform(item.discountPercentage);
    return discount || 0;
  }

  getItemStockQuantity(item: ProductGridSelectableItem): number {
    return isVariant(item) ? item.stockQuantity : item.stockQuantity;
  }

  getSelectionAvailableStock(selection: ProductGridCartSelection): number {
    return selection.availableStockQuantity;
  }

  getItemIsAvailable(item: ProductGridSelectableItem): boolean {
    return item.isAvailable;
  }

  updateVariantQuantity(itemId: number, change: number): void {
    const selection = this.cartSelections.find(
      (s) => this.getItemIdentifier(s.item) === itemId
    );
    if (selection) {
      const currentAvailableStock = selection.availableStockQuantity;
      const newQty = selection.quantity + change;
      if (newQty >= 0 && newQty <= currentAvailableStock) {
        selection.quantity = newQty;
      }
    }
  }

  setVariantQuantity(itemId: number, quantity: number): void {
    const selection = this.cartSelections.find(
      (s) => this.getItemIdentifier(s.item) === itemId
    );
    if (selection) {
      const currentAvailableStock = selection.availableStockQuantity;
      selection.quantity = Math.max(
        0,
        Math.min(quantity, currentAvailableStock)
      );
    }
  }

  getTotalItems(): number {
    return this.cartSelections.reduce((sum, s) => sum + s.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartSelections.reduce(
      (total, s) =>
        total +
        s.quantity *
          (this.getItemPrice(s.item) *
            (1 - this.getItemDiscountPercentage(s.item) / 100)),
      0
    );
  }

  addToCartApi(): void {
    const itemsToAdd = this.cartSelections.filter((s) => s.quantity > 0);
    if (itemsToAdd.length === 0) {
      alert('Please select at least one item with quantity.');
      return;
    }

    const items = itemsToAdd.map((i) => ({
      productId: i.productId,
      variantId: isVariant(i.item) ? i.item.variantId : null,
      quantity: i.quantity,
    }));

    const cartItemsPayload: AddToCart[] = items.map((i) => ({
      productId: i.productId,
      variantId: i.variantId,
      quantity: i.quantity,
    }));

    this.cartService.addToCart(cartItemsPayload).subscribe({
      next: () => {
        itemsToAdd.forEach((selection) => {
          const id = this.getItemIdentifier(selection.item);
          this.cartQuantities[id] =
            (this.cartQuantities[id] || 0) + selection.quantity;
          selection.availableStockQuantity -= selection.quantity;
        });

        this.closeCartPopup();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error adding to cart', err);
      },
    });
  }

  generateStars(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, i) => (i < Math.floor(rating) ? 1 : 0));
  }
}
