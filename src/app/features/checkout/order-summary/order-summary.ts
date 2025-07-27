import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../shared/models/delivery-option';
@Component({
  selector: 'app-order-summary',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css'
})
export class OrderSummary  {
  @Input() cartItems: CartItem[] = [];
  @Input() deliveryFee = 0;
  @Input() freeDeliveryDiscount = 0;
  @Input() total = 0;
  @Input() couponCode = '';
  @Input() canConfirmOrder = true;
  @Output() confirmOrder = new EventEmitter<void>();
  @Output() applyCoupon = new EventEmitter<string>();

  currentCouponCode = '';

  get itemsTotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  applyCouponCode() {
    if (this.currentCouponCode.trim()) {
      this.applyCoupon.emit(this.currentCouponCode.trim());
    }
  }
}
