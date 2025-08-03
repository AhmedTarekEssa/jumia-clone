import {
  Component,
  ChangeDetectorRef,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

import { AddressService } from '../../../features/address/services/address.service';
import { OrderService } from '../../../core/services/orders-services/orders-user';
import { paymentService } from '../../../core/services/payment';
import { CartService } from '../../../core/services/cart-service/cart-service';
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from '../../../core/services/Product-Service/product';
import { CouponService } from '../../../core/services/CouponService/coupon-service';

import { Address } from '../../../features/address/models/address.model';
import {
  CartItem,
  DeliveryOption,
  IOrderItem,
  Order,
  SubOrder,
  OrderPayload,
  paymentResponse
} from '../../../shared/models/delivery-option';

import { AddressSelection } from '../address-selection/address-selection';
import { DeliveryDetails } from '../delivery-details/delivery-details';
import { OrderSummary } from '../order-summary/order-summary';
import { AddAddressComponent } from '../../address/components/add-address/add-address';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AddressSelection,
    DeliveryDetails,
    OrderSummary,
    AddAddressComponent
  ],
  templateUrl: './place-order.html',
  styleUrl: './place-order.css'
})
export class PlaceOrder implements OnInit {
  currentStep = 1;

  addresses: Address[] = [];
  selectedAddress: Address | null = null;
  selectedDeliveryOption: DeliveryOption | null = null;
  selectedPaymentMethod = 'cod';
  couponCode = '';
  userInfo: any;
  userId: any;
  productsdetails!: any[];
  subOrders!: SubOrder[];
  orderBody!: OrderPayload;
  discountAmount = 0;
  originalPrice = 0;
  discountPerItem = 0;
  fixed: number = 0;
  percentage: number = 100;

  cartItems!: CartItem[];
  isSubmitting = false;

  private paymentService = inject(paymentService);

  deliveryOptions: DeliveryOption[] = [
    {
      type: 'pickup',
      name: 'Pick-up Station',
      price: 0,
      description: 'FREE',
      selected: false
    },
    {
      type: 'door',
      name: 'Door Delivery',
      price: 20,
      description: '(from EGP 20.00)',
      selected: true
    }
  ];

  constructor(
    private addressService: AddressService,
    private orderService: OrderService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private cookiesService: CookieService,
    private productService: ProductService,
    private router: Router,
    private couponservice: CouponService
  ) {}

  ngOnInit() {
    this.getCartItems();
    this.loadAddresses();
    this.selectedDeliveryOption = this.deliveryOptions.find(opt => opt.selected) || null;

    const userInfoCookie = this.cookiesService.get('UserInfo');
    if (userInfoCookie) {
      try {
        const decodedCookie = decodeURIComponent(userInfoCookie);
        this.userInfo = JSON.parse(decodedCookie);
        this.userId = +this.userInfo.UserTypeId;
        this.cdr.detectChanges();
      } catch (e) {
        console.error('Error parsing user info cookie', e);
      }
    }
  }

  getCartItems() {
    this.cartService.getCart().subscribe({
      next: (response) => {
        if (!response.cartItems || response.cartItems.length === 0) {
          window.location.href = '/cart';
          return;
        }

        this.cartItems = response.cartItems.map(item => ({
          id: item.cartItemId,
          productId: item.productId,
          variantId: item.variationId,
          discountPercentage: item.discountPercentage || 0,
          name: `${item.productName} (${item.variantName})`,
          price: item.finalPrice,
          quantity: item.quantity,
          image: item.variantImageUrl || item.mainImageUrl
        }));

        for (const item of this.cartItems) {
          this.originalPrice = item.price * 100 / (100 - item.discountPercentage);
          this.discountPerItem = this.originalPrice - item.price;
          this.discountAmount += this.discountPerItem * item.quantity;
        }

        this.cdr.detectChanges();
      },
      error: error => console.error('Error fetching cart items:', error)
    });
  }

  makeorderpayload(): void {
    const productDetailsObservables = this.cartItems.map(item =>
      this.productService.getProductDetails(item.productId)
    );

    forkJoin(productDetailsObservables).subscribe({
      next: (products) => {
        this.productsdetails = products;

        const subOrdersMap: { [sellerId: number]: OrderPayload['subOrders'][0] } = {};

        this.cartItems.forEach(item => {
          const productDetails = this.productsdetails.find(p => p.productId === item.productId);
          const sellerId = productDetails?.sellerId || 0;
          const totalPrice = item.price * item.quantity;

          if (!subOrdersMap[sellerId]) {
            subOrdersMap[sellerId] = {
              sellerId,
              subtotal: 0,
              status: 'pending',
              statusUpdatedAt: new Date().toISOString(),
              orderItems: []
            };
          }

          subOrdersMap[sellerId].orderItems.push({
            productId: item.productId,
            variationId: item.variantId,
            quantity: item.quantity,
            productName: productDetails?.name || '',
            priceAtPurchase: item.price,
            totalPrice,
            mainImageUrl: item.image
          });

          subOrdersMap[sellerId].subtotal += totalPrice;
        });

        this.subOrders = Object.values(subOrdersMap);

        this.orderBody = {
          customerId: this.userId,
          addressId: this.selectedAddress?.addressId || 0,
          totalAmount: this.getItemsTotal(),
          discountAmount: Math.abs(this.getFreeDeliveryDiscount()) + this.discountAmount,
          shippingFee: this.getDeliveryFee(),
          finalAmount: this.getTotal(),
          paymentMethod: this.selectedPaymentMethod,
          subOrders: this.subOrders
        };

        this.cdr.detectChanges();

        if (this.orderBody.paymentMethod === 'cod') {
          this.orderService.createOrder(this.orderBody).subscribe({
            next: (order) => {
              if (this.couponCode !== '') {
                this.couponservice.applyCoupon(this.couponCode, this.getItemsbeforecouponTotal()).subscribe({
                  next: () => console.log('Coupon applied.'),
                  error: (err) => console.log(err)
                });
              }

              this.cdr.detectChanges();
              this.router.navigate(['/success']);
            },
            error: () => {
              Swal.fire({
                icon: 'error',
                title: 'Order Failed',
                text: 'Some items in your cart are sold out. Please update your cart and try again.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'Back to Cart'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/cart']);
                }
              });
            }
          });
        } else {
          this.paymentService.intiatePayment(this.orderBody).subscribe({
            next: (response: paymentResponse) => {
              window.location.href = response.paymentUrl;
            },
            error: (err) => console.error('Payment initiation failed:', err),
            complete: () => console.log('Payment initiation completed')
          });
        }
      },
      error: (err) => console.error('Error fetching product details:', err)
    });
  }

  loadAddresses() {
    this.addressService.getByUser().subscribe({
      next: addresses => {
        this.addresses = addresses;
        this.selectedAddress = addresses.find(addr => addr.isDefault) || addresses[0] || null;
        if (this.selectedAddress) this.currentStep = 2;
        this.cdr.detectChanges();
      },
      error: error => console.error('Error loading addresses:', error)
    });
  }

  isAddingNewAddress = false;

  onAddNewAddress() {
    this.isAddingNewAddress = true;
    this.cdr.detectChanges();
  }

  onAddressAdded(newAddress: Address) {
    this.isAddingNewAddress = false;
    this.addresses.push(newAddress);
    this.selectedAddress = newAddress;
    this.cdr.detectChanges();
  }

  onAddressSelected(address: Address) {
    this.selectedAddress = address;
    this.currentStep = 2;
    this.cdr.detectChanges();
  }

  onDeliveryOptionSelected(option: DeliveryOption) {
    this.selectedDeliveryOption = option;
    this.cdr.detectChanges();
  }

  confirmDeliveryDetails() {
    if (this.selectedDeliveryOption) {
      this.currentStep = 3;
      this.cdr.detectChanges();
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
    this.cdr.detectChanges();
  }

  getDeliveryFee(): number {
    return this.selectedDeliveryOption?.price || 0;
  }

  getFreeDeliveryDiscount(): number {
    return this.getDeliveryFee() > 0 ? -20 : 0;
  }

  getItemsTotal(): number {
    return this.cartItems?.reduce((sum, item) =>
      sum + item.price * item.quantity * (this.percentage / 100) - this.fixed, 0) || 0;
  }
  getItemsbeforecouponTotal(): number {
    return this.cartItems?.reduce((sum, item) =>
      sum + item.price * item.quantity , 0) || 0;
  }

  getTotal(): number {
    return this.getItemsTotal() + this.getDeliveryFee() + this.getFreeDeliveryDiscount();
  }

  canConfirmOrder(): boolean {
    return !!(this.selectedAddress && this.selectedDeliveryOption && this.selectedPaymentMethod);
  }

  confirmOrder() {
    if (!this.canConfirmOrder()) return;

    this.isSubmitting = true;
    this.cdr.detectChanges(); // update submit state in UI

    this.makeorderpayload();
  }

  applyCoupon(code: string) {
    this.couponCode = code;
    this.cdr.detectChanges();
  }

  applyDiscountFixed(fixed: number) {
    this.fixed = fixed;
    this.cdr.detectChanges();
  }

  applyDiscountPercentage(percentage: number) {
    this.percentage = percentage;
    this.cdr.detectChanges();
  }
}
