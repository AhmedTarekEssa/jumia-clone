import { ChangeDetectorRef, Component, inject, OnInit, Pipe } from '@angular/core';
import { Cart, CartItem, UpdateCart } from '../../cart-models';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../../core/services/cart-service/cart-service';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { NotExpr } from '@angular/compiler';


@Component({
  selector: 'app-cart-items',
  imports: [CommonModule],
  templateUrl: './cart-items.html',
  styleUrl: './cart-items.css'
})
export class CartItems implements OnInit {
  cart!:Cart;
  cartItems!: CartItem[];
  subTotal!:number
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef)
  private productService = inject(ProductService);
  ngOnInit(): void {
    this.cartService.getCart().subscribe(
      {
        next:(data)=>{
          console.log("data fetched : " + data)
          this.cart= data
          this.cartItems = data.cartItems;
          this.setSubtotal();
          this.cdr.detectChanges();
        }
      }
    )
  }




  getCartCount(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  updateQuantity(itemId: number, newQuantity: number): void {
    console.log(itemId)
    const item = this.cartItems.find(i => i.cartItemId === itemId);
    if (item && newQuantity >= 0) {
      item.quantity = newQuantity;
      console.log(item)
    }
  }

  increaseQuantity(itemId: number): void {
    console.log(itemId);
   

    const item =this.cartItems.find(i => i.cartItemId === itemId);
    
    console.log(item);
    
   
    this.cdr.detectChanges();
   
    this.cartService.UpdateCartItem(itemId,{quantity :1}).subscribe(
      {
        next:(data)=>{
          item!.subtotal = data.subtotal
          item!.quantity = data.quantity
          this.setSubtotal();
          this.cdr.detectChanges();
          
        }
      }
    )
    
  }

  decreaseQuantity(itemId: number): void {
   console.log(itemId);
   

    const item =this.cartItems.find(i => i.cartItemId === itemId);
    
    console.log(item);
    
    
    this.cdr.detectChanges();
   
    this.cartService.UpdateCartItem(itemId,{quantity :-1}).subscribe(
      {
        next:(data)=>{
          item!.subtotal = data.subtotal
          item!.quantity = data.quantity
          this.setSubtotal();
          this.cdr.detectChanges();
          
        }
      }
    )

  }

  removeItem(itemId: number): void {
    this.cartService.DeleteCartItem(itemId).subscribe(
      {
        next:()=>{
          this.cartItems = this.cartItems.filter(item => item.cartItemId !== itemId)
          this.setSubtotal()
           this.cdr.detectChanges();
        },
        error:()=>console.log("cant remove")
      }
    )
    
   
  }

  setSubtotal() {
     this.subTotal =  this.cartItems.reduce((total, item) =>{console.log(item.subtotal);return total + (item.subtotal)}, 0);
  }
}
