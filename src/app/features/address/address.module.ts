import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AddressRoutingModule } from './address-routing.module';
import { AddAddressComponent } from './components/add-address/add-address';
import { AddressListComponent } from './components/address-list/address-list';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AddressRoutingModule,
    AddAddressComponent,
    AddressListComponent
  ]
})
export class AddressModule {}
