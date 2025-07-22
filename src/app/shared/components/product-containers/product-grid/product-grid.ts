import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductUi, Variant } from '../../../../features/products/product-models';
import { DiscountPricePipe } from '../../../pipes/discount-price-pipe';
import { Router } from '@angular/router';
import { AddToCart } from '../../../../features/cart/cart-models';
import { CartService } from '../../../../core/services/cart-service/cart-service';

@Component({
  selector: 'app-product-grid',
  imports: [CommonModule,FormsModule,DiscountPricePipe],
  templateUrl: './product-grid.html',
  styleUrl: './product-grid.css'
})
export class ProductGrid implements OnInit {
  
  private productService = inject(ProductService)
  private cdr = inject(ChangeDetectorRef)
  private router = inject(Router)
  private cartService = inject(CartService)
  products!:ProductUi[];
  product!:ProductUi;
  lowStock: boolean = false;
  isWishlisted: boolean = false;
  selectedVariant!: Variant;
  currentImageIndex: number = 0;
  allImages: string[] = [];
  showCartPopup: boolean = false;
  cartSelections: {productId:number, variant: Variant; quantity: number }[]|undefined = [];
  cartQuantities: { [variantId: number]: number } = {};
  item!:AddToCart;
  
  ngOnInit(): void {
  this.productService.productsByFilters({ categoryIds: [15] },1,2).subscribe({
    next: (data) => {
      this.products = data.items;
      this.cdr.detectChanges();

      // Fetch cart
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
    error: (err) => console.error("Error fetching products", err)
  });
}
 
        
      
 



 goToProductDetails(productId: number) {
    this.router.navigate(['/product', productId]);
  }
 
  addToWishlist(productId: number): void {
    // Implement wishlist functionality
    console.log('Added to wishlist:', productId);
  }

  addToCart(productId:number,$event:MouseEvent){
    $event.stopPropagation()
    this.openCartPopup(productId)
  }
 

  openCartPopup(productId: number): void {
  this.showCartPopup = true;
  const product = this.products.find(p => p.productId === productId);
  console.log(product);

  this.cartSelections = product?.variants
    .filter(v => v.isAvailable && v.stockQuantity > 0)
    .map(v => {
      const cartQty = this.cartQuantities[v.variantId] || 0;
      const availableStock = v.stockQuantity - cartQty;
      return {
        productId: product.productId,
        variant: { ...v, stockQuantity: availableStock },
        quantity: 0
      };
    });
}


  closeCartPopup(): void {
    this.showCartPopup = false;
  }

 

  updateVariantQuantity(variantId: number, change: number): void {
    const selection = this.cartSelections!.find(s => s.variant.variantId === variantId);
    if (selection) {
      const newQty = selection.quantity + change;
      if (newQty >= 0 && newQty <= selection.variant.stockQuantity) {
        selection.quantity = newQty;
      }
    }
  }

  setVariantQuantity(variantId: number, quantity: number): void {
    const selection = this.cartSelections!.find(s => s.variant.variantId === variantId);
    if (selection) {
      const stock = selection.variant.stockQuantity;
      selection.quantity = Math.max(0, Math.min(quantity, stock));
    }
  }

  getTotalItems(): number {
    return this.cartSelections!.reduce((sum, s) => sum + s.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartSelections!.reduce((total, s) =>
      total + (s.quantity * (s.variant.price * (1 - s.variant.discountPercentage / 100))), 0);
  }
 addToCartApi() {
  const itemsToAdd = this.cartSelections!.filter(s => s.quantity > 0);
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

  this.cartService.addToCart(items).subscribe({
    next: () => {
      console.log("added to cart");

    
      items.forEach(item => {
        this.cartQuantities[item.variantId] = 
          (this.cartQuantities[item.variantId] || 0) + item.quantity;
      });

      this.closeCartPopup();
      this.cdr.detectChanges();
    },
    error: () => console.log("error adding to cart")
  });
}


  generateStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }
}
