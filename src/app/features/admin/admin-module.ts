import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminContainer } from './admin-container/admin-container';
import { AdminHeader } from './components/admin-header/admin-header';
import { AdminSidebar } from './components/admin-sidebar/admin-sidebar';
import { AdminCustomers } from './components/customers/admin-customers/admin-customers';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class AdminModule { }
