import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductDetails, Variant } from '../../product-models';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../../core/services/cart-service/cart-service';
import { AddToCart } from '../../../cart/cart-models';
import { WishlistService } from '../../../../core/services/wishlist';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, RouterLink ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailC implements OnInit {
  product!: ProductDetails;
  lowStock: boolean = false;
  isWishlisted: boolean = false;
  selectedVariant!: Variant;
  currentImageIndex: number = 0;
  allImages: string[] = [];
  showCartPopup: boolean = false;
  cartSelections: {productId:number, variant: Variant; quantity: number }[] = [];
  variantImages: any[] = [];
  currentVariantImageIndex:number=0;
  item!:AddToCart;
  productId!:number;
  baseImageUrl = environment.ImageUrlBase;


  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private cartService:CartService,
    private route: ActivatedRoute,
    private wishlistService: WishlistService
  ) {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Product ID from route:", this.productId);

  }

  ngOnInit(): void {
    this.checkWishlistStatus();


    this.productService.getProductDetails(this.productId).subscribe({
      next: (data) => {
        this.product = data;
        console.log("-------------------------");
        console.log(data);

        this.selectedVariant = this.product.variants.find(v => v.isDefault) || this.product.variants[0];
        this.initializeImages();
        this.isThereLowStocks();
        this.variantImages = this.product.variants.map(v => v.variantImageUrl);

        // Tell Angular to re-run change detection to avoid ExpressionChangedAfterItHasBeenCheckedError
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error fetching product details: ", err)
    });
  }

  isThereLowStocks() {
    const lowStockList = this.product.variants.filter(v => v.stockQuantity < 5);
    this.lowStock = lowStockList.length > 0;
  }

  initializeImages(): void {
    this.allImages = [this.product.mainImageUrl, ...this.product.additionalImageUrls];
  }

  previousImage(): void {
    this.currentImageIndex = this.currentImageIndex === 0 ? this.allImages.length - 1 : this.currentImageIndex - 1;
  }

  nextImage(): void {
    this.currentImageIndex = this.currentImageIndex === this.allImages.length - 1 ? 0 : this.currentImageIndex + 1;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  getCurrentPrice(): number {
    return this.selectedVariant.price * (1 - this.selectedVariant.discountPercentage / 100);
  }

  hasDiscount(): boolean {
    return this.selectedVariant.discountPercentage > 0;
  }

  openCartPopup(): void {
    this.showCartPopup = true;
    this.cartSelections = this.product.variants
      .filter(v => v.isAvailable && v.stockQuantity > 0)
      .map(v => ({productId:this.product.productId, variant: v, quantity: 0 }));
  }
  checkWishlistStatus() {
  this.wishlistService.isInWishlist(this.productId).subscribe({
    next: (isWishlisted) => {
      this.isWishlisted = isWishlisted;
      this.cdr.detectChanges(); // If needed for change detection
    },
    error: (err) => console.error('Error checking wishlist', err)
  });
}

  closeCartPopup(): void {
    this.showCartPopup = false;
  }

  toggleWishlist(): void {
  if (this.isWishlisted) {
    this.wishlistService.removeFromWishlist(this.product.productId).subscribe({
      next: () => {
        this.isWishlisted = false;
        console.log('Removed from wishlist');
        this.cdr.detectChanges(); // Trigger change detection if needed
      },
      error: (err) => console.error('Error removing from wishlist', err)
    });
  } else {
    this.wishlistService.addToWishlist(this.product.productId).subscribe({
      next: () => {
        this.isWishlisted = true;
        console.log('Added to wishlist');
        this.cdr.detectChanges(); // Trigger change detection if needed
      },
      error: (err) => console.error('Error adding to wishlist', err)
    });
  }
}

  updateVariantQuantity(variantId: number, change: number): void {
    const selection = this.cartSelections.find(s => s.variant.variantId === variantId);
    if (selection) {
      const newQty = selection.quantity + change;

      if (newQty >= 0 && newQty <= selection.variant.stockQuantity) {
        selection.quantity = newQty;
      }
    }
  }

  setVariantQuantity(variantId: number, quantity: number): void {
    const selection = this.cartSelections.find(s => s.variant.variantId === variantId);
    if (selection) {
      const stock = selection.variant.stockQuantity;
      selection.quantity = Math.max(0, Math.min(quantity, stock));
    }
  }

  getTotalItems(): number {
    return this.cartSelections.reduce((sum, s) => sum + s.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartSelections.reduce((total, s) =>
      total + (s.quantity * (s.variant.price * (1 - s.variant.discountPercentage / 100))), 0);
  }

  addToCart(): void {
    const itemsToAdd = this.cartSelections.filter(s => s.quantity > 0);
    if (itemsToAdd.length === 0) {
      alert('Please select at least one variant with quantity.');
      return;
    }
    console.log('Adding to cart:', itemsToAdd);

  const items = itemsToAdd.map(i => ({
    productId: i.productId,
    variantId: i.variant.variantId,
    quantity: i.quantity
    }));
     console.log(items)

    this.cartService.addToCart(items).subscribe(
      {
        next:()=>console.log("added to cart"),
        error:()=>console.log("error adding to cart")
      }
    )

    this.closeCartPopup();
  }
}

