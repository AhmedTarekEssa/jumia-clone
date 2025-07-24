import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-address',
  standalone: true,
  templateUrl: './add-address.html',
  styleUrls: ['./add-address.css'],
  imports: [FormsModule, CommonModule]
})
export class AddAddressComponent implements OnInit {
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

  isEditMode = false;
  addressId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private addressService: AddressService,
    private router: Router,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.addressId = +id;
      this.loadAddress(this.addressId);
      this.cdr.detectChanges()
    }
  }

  loadAddress(id: number) {
    this.addressService.getById(id).subscribe({
      next: (data) => {
        this.address = data;
        this.cdr.detectChanges()
        console.log('Edit mode: address loaded', data);
      },
      error: (err) => console.error('Failed to load address', err)
    });
  }

  saveAddress() {
    if (this.isEditMode && this.addressId !== null) {
      this.addressService.update(this.addressId, this.address).subscribe({
        next: () => this.router.navigate(['/address']),
        error: err => console.error('Error updating address:', err)
      });
    } else {
      this.addressService.add(this.address).subscribe({
        next: () => this.router.navigate(['/address']),
        error: err => console.error('Error saving address:', err)
      });
    }
  }

  cancel() {
    this.router.navigate(['/address']);
  }
}
