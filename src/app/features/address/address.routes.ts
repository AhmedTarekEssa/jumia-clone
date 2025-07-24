import { Routes } from "@angular/router";
import { AddAddressComponent } from "./components/add-address/add-address";
import { AddressListComponent } from "./components/address-list/address-list";

export const routes: Routes = [
 {
    path: '',
    component: AddressListComponent
  },
  {
    path: 'add',
    component: AddAddressComponent
  },
  {
    path: 'edit/:id',
    component: AddAddressComponent
  }
];
