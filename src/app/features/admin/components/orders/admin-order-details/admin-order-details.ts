import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../../../shared/models/order';
import { OrderService } from '../../../../../core/services/orders-services/orders-user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-order-details',
  imports: [CommonModule],
  templateUrl: './admin-order-details.html',
  styleUrl: './admin-order-details.css'
})
export class AdminOrderDetails implements OnInit {
  order!: Order;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (!isNaN(id)) {
        this.getOrderDetails(id);
      }
    });
  }

    redirect(){
    this.router.navigate([`admin/orders`]);

  }

  getOrderDetails(id: number): void {
    this.orderService.getOrderById(id).subscribe((order: Order) => {
      this.order = order;
      this.cdr.detectChanges(); // optional if OnPush strategy is used
    });
  }
}
