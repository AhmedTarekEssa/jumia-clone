import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../shared/models/delivery-option';
import { CouponService } from '../../../core/services/CouponService/coupon-service';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css',
})
export class OrderSummary {
  @Input() cartItems: CartItem[] = [];
  @Input() deliveryFee = 0;
  @Input() freeDeliveryDiscount = 0;
  @Input() total = 0;
  @Input() couponCode = '';
  @Input() canConfirmOrder = true;
  @Output() confirmOrder = new EventEmitter<void>();
  @Output() applyCoupon = new EventEmitter<string>();
  @Output() fixedCoupon = new EventEmitter<number>();
  @Output() percentageCoupon = new EventEmitter<number>();


  fixed: number = 0;
  percentage: number = 100;
  show_err: boolean = false;
  msg: string = '';
  currentCouponCode = '';

  constructor(
    private couponservice: CouponService,
    private cdr: ChangeDetectorRef
  ) {}

  itemsTotal(): number {
  if (!this.cartItems || this.cartItems.length === 0) return 0;

  return this.cartItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity * (this.percentage / 100) - this.fixed,
    0
  );
}


  applyCouponCode() {
    if (this.currentCouponCode.trim()) {
      this.couponservice.getCouponByCode(this.currentCouponCode).subscribe({
        next: (res) => {
          if (this.itemsTotal() >= res.minimumPurchase) {
            if (res.isActive == false) {
              this.msg = 'the coupon limit is expired';
              this.show_err = true;
            } else if (res.usageLimit <= res.usageCount) {
              this.msg = 'the coupon limit is done';
              this.show_err = true;
            } else if (res.discountType === 'Fixed') {
              this.fixed = res.discountAmount;
              this.itemsTotal();
              this.applyCoupon.emit(this.currentCouponCode.trim());

            } else if (res.discountType === 'Percentage') {
              this.percentage = res.discountAmount;
              this.applyCoupon.emit(this.currentCouponCode.trim());
              this.msg = `Coupon applied, discount is ${res.discountAmount}` 
              this.itemsTotal();
            }
            this.cdr.detectChanges();
          }else{
            this.msg = `the minimum amount should be ${res.minimumPurchase} `
            this.show_err = true;
            this.cdr.detectChanges()
          }
        },
        error: (err) => {
          this.msg = 'the coupon is not valid';
          this.show_err = true;
          this.cdr.detectChanges();
        },
      });

      this.fixedCoupon.emit(this.fixed)
      this.percentageCoupon.emit(this.fixed)
    }
  }
}
