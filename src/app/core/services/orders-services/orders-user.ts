
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';


import { OrderPayload } from '../../../shared/models/delivery-option';

import { Order } from '../../../shared/models/order';
export interface OrderItem {
  id: number;
  subOrderId: number;
  productId: number;
  variationId: number;
  quantity: number;
  priceAtPurchase: number;
  totalPrice: number;
  productName: string;
  productImageUrl: string | null;
  productSlug: string | null;
  productBrand: string | null;
  productCategory: string | null;
}


export interface SubOrder {
  id: number;
  orderId: number;
  sellerId: number;
  subtotal: number;
  status: string;
  statusUpdatedAt: string;
  trackingNumber: string;
  shippingProvider: string;
  orderItems: OrderItem[];
}
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.BaseUrlPath;

  constructor(private http: HttpClient) { }


  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}${environment.Orders.GetAll}`, { withCredentials: true });
  }
  getCurrentUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}${environment.Orders.getCurrentUserOrders}`, { withCredentials: true });
  }


  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}${environment.Orders.GetById(id)}`, { withCredentials: true });
  }



  createOrder(order: any): Observable<OrderPayload> {
    return this.http.post<OrderPayload>(`${this.baseUrl}${environment.Orders.Create}`, order,{withCredentials: true});

  }


  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}${environment.Orders.UpdateStatus(id)}`, { status }, { withCredentials: true });
  }


  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}${environment.Orders.GetByUserId(userId)}`, { withCredentials: true });
  }


  UpdateOrderStatus(orderID: number, status: string): Observable<boolean> {
    return this.http.put<boolean>(
      `http://localhost:5087/api/Order/${orderID}/UpdateStatus?status=${status}`,
      null, // send no body
      {
        withCredentials: true,
        responseType: 'text' as 'json' // <-- Fix the parsing issue
      }
    );
  }

  CancelOrder(orderId: number, reason: string): Observable<boolean> {
    return this.http.put<boolean>(
      `http://localhost:5087/api/Order/${orderId}/cancel`, // correct endpoint
      { reason }, // ✅ send body with 'reason' key
      {
        withCredentials: true,
        responseType: 'text' as 'json' // if backend returns empty/no content
      }
    );
  }



  getSubOrdersBySellerId(): Observable<SubOrder[]> {
    return this.http.get<SubOrder[]>(`${this.baseUrl}${environment.Orders.GetSubOrdersBySellerId()}`, { withCredentials: true });
  }

}
