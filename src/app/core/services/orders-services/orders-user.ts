import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development'; // Adjust the path as necessary
import { Observable } from 'rxjs';
import { Order } from '../../../shared/models/order'; // Assuming you have an Order model

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.BaseUrlPath;

  constructor(private http: HttpClient) { }


  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}${environment.Orders.GetAll}`);
  }
  getCurrentUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}${environment.Orders.getCurrentUserOrders}`);
  }


  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}${environment.Orders.GetById(id)}`);
  }


  createOrder(order: any): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}${environment.Orders.Create}`, order);
  }


  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}${environment.Orders.UpdateStatus(id)}`, { status });
  }


  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}${environment.Orders.GetByUserId(userId)}`);
  }
}
