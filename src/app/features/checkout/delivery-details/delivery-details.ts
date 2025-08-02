import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryOption } from '../../../shared/models/delivery-option';
import { ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-delivery-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './delivery-details.html',
  styleUrl: './delivery-details.css'
})
export class DeliveryDetails {
  @Input() deliveryOptions: DeliveryOption[] = [];
  @Input() selectedOption: DeliveryOption | null = null;
  @Input() cartItems: any[] = [];
  @Output() optionSelected = new EventEmitter<DeliveryOption>();
  @Output() confirmDelivery = new EventEmitter<void>();

  mockProducts = [
    {
      name: 'Black Fitted/Fitted Stretch Knitted T-Shirt',
      price: 942.00,
      quantity: 1,
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
    },
    {
      name: 'Black Fitted/Fitted Stretch Knitted T-Shirt',
      price: 942.00,
      quantity: 1,
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1'
    }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  baseImageUrl =environment.ImageUrlBase;

  selectOption(option: DeliveryOption) {
    this.selectedOption = option;
    this.optionSelected.emit(option);
    this.cdr.detectChanges(); // Manually trigger change detection after selection
  }

  // If you have any ngOnChanges or other methods where inputs change:
  ngOnChanges() {
    this.cdr.detectChanges(); // Manually trigger change detection when inputs change
  }

  // If you add any async operations later:
  handleAsyncOperation() {
    // Example:
    // someAsyncCall().then(() => {
    //   this.cdr.detectChanges();
    // });
  }
}
