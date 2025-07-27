import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../../../shared/models/order';
import { OrderService } from '../../../../../core/services/orders-services/orders-user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-order-details',
  imports: [],
  templateUrl: './admin-order-details.html',
  styleUrl: './admin-order-details.css'
})
export class AdminOrderDetails {
    constructor(private orderservice: OrderService, private cdr: ChangeDetectorRef, private router:Router) { }


   redirect(){
    this.router.navigate([`admin/orders`]);

  }
}
