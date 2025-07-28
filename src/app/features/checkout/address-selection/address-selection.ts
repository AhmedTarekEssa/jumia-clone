import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Address } from '../../../features/address/models/address.model';
@Component({
  selector: 'app-address-selection',
  imports: [CommonModule],
  templateUrl: './address-selection.html',
  styleUrl: './address-selection.css'
})
export class AddressSelection {
  @Input() addresses: Address[] = [];
  @Input() selectedAddress: Address | null = null;
  @Output() addressSelected = new EventEmitter<Address>();
  @Output() addNewAddress = new EventEmitter<void>();

  selectAddress(address: Address) {
    this.selectedAddress = address;
  }

  confirmSelection() {
    if (this.selectedAddress) {
      this.addressSelected.emit(this.selectedAddress);
    }
  }

  cancel() {
    this.selectedAddress = null;
  }

  editAddress(address: Address, event: Event) {
    event.stopPropagation();
    // Implement edit address logic
    console.log('Edit address:', address);
  }
}
