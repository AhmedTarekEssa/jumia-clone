import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { AddressService } from '../../../features/address/services/address.service';
import { OrderService } from '../../../core/services/orders-services/orders-user';
import { Address } from '../../../features/address/models/address.model';
import { CommonModule } from '@angular/common';
import { CartItem, DeliveryOption, IOrderItem, Order, SubOrder, OrderPayload , paymentResponse } from '../../../shared/models/delivery-option';
import { FormsModule } from '@angular/forms';
import { AddressSelection } from '../address-selection/address-selection';
import { DeliveryDetails } from '../delivery-details/delivery-details';
import { OrderSummary } from '../order-summary/order-summary';
import { paymentService } from '../../../core/services/payment';
import { CartService } from '../../../core/services/cart-service/cart-service';
import { AddAddressComponent } from '../../address/components/add-address/add-address';
import { ChangeDetectorRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from '../../../core/services/Product-Service/product';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-place-order',
  imports: [CommonModule, FormsModule, AddressSelection, DeliveryDetails, OrderSummary, AddAddressComponent],
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

  cartItems!: CartItem[]

  constructor(
    private addressService: AddressService,
    private orderService: OrderService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private cookiesService: CookieService,
    private productService: ProductService,
    private router: Router
  ) {
    //if cart is empty redirect to cart

  }

    private paymentService=inject( paymentService)
  ngOnInit() {
    this.getCartItems();
    console.log('Cart items:', this.cartItems);
    // this.makeorderpayload();
    this.loadAddresses();
    this.selectedDeliveryOption = this.deliveryOptions.find(opt => opt.selected) || null;
    const userInfoCookie = this.cookiesService.get('UserInfo');
    console.log('User Info Cookie:', userInfoCookie);
    if (userInfoCookie) {
      try {
        // Decode the URL encoded cookie
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
    this.cartService.getCart().subscribe(
      (response) => {
        if (!response.cartItems || response.cartItems.length === 0) {
          window.location.href = '/cart'; // Simple redirect without Router

          return;
        }
        console.log('Cart items fetched:', response);


        // Map response.cartItems to match the CartItem interface
        this.cartItems = response.cartItems.map(item => ({
          id: item.cartItemId,
          productId: item.productId,
          variantId: item.variationId,
          discountPercentage: item.discountPercentage || 0, // Ensure discountPercentage is included
          name: `${item.productName} (${item.variantName})`, // Include variant info
          price: item.finalPrice,
          quantity: item.quantity,
          image: item.variantImageUrl || item.mainImageUrl
        }));
        for (const item of this.cartItems) {
          this.originalPrice = item.price * 100 / (100 - item.discountPercentage);
          this.discountPerItem = this.originalPrice - item.price;
          this.discountAmount += this.discountPerItem * item.quantity;

        }
        console.log('Mapped cart items:', this.cartItems);

        this.cdr.detectChanges(); // Add change detection after cart items update
      },
      error => console.error('Error fetching cart items:', error)
    );
  }

  
  makeorderpayload(): void {
    const productDetailsObservables = this.cartItems.map(item => {


      return this.productService.getProductDetails(item.productId);

    });

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
            mainImageUrl:item.image
          });

          subOrdersMap[sellerId].subtotal += totalPrice;
        });

        this.subOrders = Object.values(subOrdersMap);

        const payload: OrderPayload = {
          customerId: this.userId,
          addressId: this.selectedAddress?.addressId || 0,
          totalAmount: this.getItemsTotal(),
          discountAmount: Math.abs(this.getFreeDeliveryDiscount()) + this.discountAmount,
          shippingFee: this.getDeliveryFee(),
          finalAmount: this.getTotal(),
          paymentMethod: this.selectedPaymentMethod,
          subOrders: this.subOrders
        };

        this.orderBody = payload;
        this.cdr.detectChanges();
        if (payload.paymentMethod === "cod") {
          console.log(payload);
         this.orderService.createOrder(this.orderBody).subscribe(
          {
            next:(order)=>{
              this.cdr.detectChanges()
              console.log('order created succssfully',order)
              this.router.navigate(['/success']);
            },
            error:(err)=>console.log(err)
          }
         )
        } else {
          this.paymentService.intiatePayment(this.orderBody).subscribe({
            next: (response:paymentResponse) => {
              console.log('Order created successfully:', response);
              window.location.href = response.paymentUrl;

              // Handle successful payment initiation (e.g., redirect to payment gateway)
            },
            error: (err) => {
              console.error('Payment initiation failed:', err);
              // Show user-friendly error message
            },
            complete: () => {
              console.log('Payment initiation completed');
              // Optional: Any cleanup or finalization logic
            }
          });
        }


      },
      error: (err) => {
        console.error('Error fetching product details:', err);
      }
    });
  }



  loadAddresses() {
    this.addressService.getByUser().subscribe(
      addresses => {
        this.addresses = addresses;
        this.selectedAddress = addresses.find(addr => addr.isDefault) || addresses[0] || null;
        if (this.selectedAddress) {
          this.currentStep = 2;
        }
        this.cdr.detectChanges(); // Add change detection after addresses load
      },
      error => console.error('Error loading addresses:', error)
    );
  }

  isAddingNewAddress = false;

  onAddNewAddress() {
    this.isAddingNewAddress = true;
    this.cdr.detectChanges(); // Add change detection after address addition state change
  }

  onAddressAdded(newAddress: Address) {
    this.isAddingNewAddress = false;
    this.addresses.push(newAddress);
    this.selectedAddress = newAddress;
    this.cdr.detectChanges(); // Add change detection after new address is added
  }

  onAddressSelected(address: Address) {
    this.selectedAddress = address;
    this.currentStep = 2;
    this.cdr.detectChanges(); // Add change detection after address selection
  }

  onDeliveryOptionSelected(option: DeliveryOption) {
    this.selectedDeliveryOption = option;
    this.cdr.detectChanges(); // Add change detection after delivery option selection
  }

  confirmDeliveryDetails() {
    if (this.selectedDeliveryOption) {
      this.currentStep = 3;
      this.cdr.detectChanges(); // Add change detection after step change
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
    this.cdr.detectChanges(); // Add change detection after step navigation
  }

  getDeliveryFee(): number {
    return this.selectedDeliveryOption?.price || 0;
  }

  getFreeDeliveryDiscount(): number {
    return this.getDeliveryFee() > 0 ? -20 : 0;
  }

  getItemsTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotal(): number {
    return this.getItemsTotal() + this.getDeliveryFee() + this.getFreeDeliveryDiscount();
  }

  canConfirmOrder(): boolean {
    return !!(this.selectedAddress && this.selectedDeliveryOption && this.selectedPaymentMethod);
  }


  confirmOrder() {
    if (!this.canConfirmOrder()) return;
    this.makeorderpayload(); // Ensure order payload is ready before creating the order


    // const orderData = {

    //   customerId: this.userId, // This should come from auth service
    //   addressId: this.selectedAddress!.addressId,
    //   couponId: null,
    //   totalAmount: this.getItemsTotal(),
    //   discountAmount: Math.abs(this.getFreeDeliveryDiscount()),
    //   shippingFee: this.getDeliveryFee(),
    //   taxAmount: 0,
    //   finalAmount: this.getTotal(),
    //   paymentMethod: this.selectedPaymentMethod,
    //   paymentStatus: 'pending' as const,
    //   affiliateId: null,
    //   affiliateCode: '',
    //   status: 'pending' as const,
    //   subOrders: this.cartItems.map(item => ({
    //     productId: item.id,
    //     quantity: item.quantity,
    //     unitPrice: item.price,
    //     totalPrice: item.price * item.quantity
    //   }))
    // };


  }

  applyCoupon(code: string) {
    this.couponCode = code;
    // Implement coupon application logic
    console.log('Applying coupon:', code);
    this.cdr.detectChanges(); // Add change detection after coupon application
  }
}







