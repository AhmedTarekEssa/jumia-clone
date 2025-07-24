import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Address } from '../../models/address.model';
import { AddressService } from '../../services/address.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-address-list',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './address-list.html',
  styleUrls: ['./address-list.css']
})
export class AddressListComponent implements OnInit {
  addresses: Address[] = [];
  selectedAddressId: number | null = null;
  private cdr = inject(ChangeDetectorRef);

  constructor(private addressService: AddressService, private router: Router) {}

  ngOnInit(): void {
   
    this.addressService.getByUser().subscribe({
      next: (data) => {
        this.addresses = data;
        console.log(data)
        this.cdr.detectChanges();
        console.log("hello")
      },
      error: (err) => console.error('Error fetching addresses:', err)
    });
  }

  selectAddress(addressId: number) {
    this.selectedAddressId = addressId;
  }

  goToAddPage() {
    this.router.navigate(['/address/add']);
  }

  cancel() {
    
    console.log('Cancelled');
  }

  confirmSelection() {
    const selected = this.addresses.find(a => a.addressId === this.selectedAddressId);
    console.log('Selected address:', selected);
    
  }

  editAddress(id: number) {
  this.router.navigate(['/address/edit', id]);
}

}
