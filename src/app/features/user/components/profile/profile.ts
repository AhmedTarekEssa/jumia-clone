import { ChangeDetectorRef, Component, inject, Pipe } from '@angular/core';
import { User, UserInformation } from '../../../../core/services/user-service/user';
import { AddressService } from '../../../address/services/address.service';
import { Address } from '../../../address/models/address.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule,RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  private userService = inject(User)
  private cdr = inject(ChangeDetectorRef)
  private addressService = inject(AddressService)
  accountDetails!:UserInformation
  shippingAddress:Address|undefined



  constructor() { }

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe(
      {
        next:(data)=>{
          this.accountDetails = data
          this.cdr.detectChanges();
        }
      }
    )
    this.addressService.getByUser().subscribe(
        {
          next:(data)=>{
            this.shippingAddress = data.find(a=>a.isDefault===true);
            console.log(data)
            console.log(this.shippingAddress)
            this.cdr.detectChanges();
          }
        }
    )
  }

  editAddress(): void {
   
  }

  editNewsletterPreferences(event: Event): void {
    
  }
}
