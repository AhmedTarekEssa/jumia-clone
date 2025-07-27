import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-address',
  standalone: true,
  templateUrl: './add-address.html',
  styleUrls: ['./add-address.css'],
  imports: [FormsModule, CommonModule , RouterModule]
})
export class AddAddressComponent implements OnInit {
  @Input() embeddedMode = false; // Add this at the top

  @Output() addressAdded = new EventEmitter<Address>();
  @Output() cancelAdd = new EventEmitter<void>();


  address: Address = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    addressName: '',
    streetAddress: '',
    postalCode: '',
    city: '',
    state: '',
    isDefault: false,
    country: ''
  };

  @Input() addressId: number | null = null;
  isEditMode = false;

  constructor(private addressService: AddressService, private cdr: ChangeDetectorRef , private router: Router) {}

  ngOnInit(): void {
    if (this.addressId !== null) {
      this.isEditMode = true;
      this.loadAddress(this.addressId);
    }
  }

  loadAddress(id: number) {
    this.addressService.getById(id).subscribe({
      next: (data) => {
        this.address = data;
        this.cdr.detectChanges();
        console.log('Edit mode: address loaded', data);
      },
      error: (err) => console.error('Failed to load address', err)
    });
  }

  saveAddress() {
  if (this.isEditMode && this.addressId !== null) {
    this.addressService.update(this.addressId, this.address).subscribe({
      next: () => {
        if (this.embeddedMode) {
          this.addressAdded.emit(this.address);
        } else {
          this.router.navigate(['/address']);
        }
      },
      error: err => console.error('Error updating address:', err)
    });
  } else {
    this.addressService.add(this.address).subscribe({
      next: (newAddress) => {
        if (this.embeddedMode) {
          this.addressAdded.emit(newAddress);
        } else {
          this.router.navigate(['/address']);
        }
      },
      error: err => console.error('Error saving address:', err)
    });
  }
}


  cancel() {
    this.cancelAdd.emit();
  }
}
