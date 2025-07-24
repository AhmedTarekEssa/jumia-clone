import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAddressComponent } from './components/add-address/add-address';
import { AddressListComponent } from './components/address-list/address-list';

const routes: Routes = [
  { path: '', component: AddressListComponent }, // Default to address list
  { path: 'add', component: AddAddressComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressRoutingModule {}
