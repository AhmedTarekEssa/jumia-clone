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
    return this.http.get<Order[]>(`${this.baseUrl}${environment.Orders.GetAll}`,{withCredentials: true});
  }
  getCurrentUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}${environment.Orders.getCurrentUserOrders}`,{withCredentials: true});
  }


  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}${environment.Orders.GetById(id)}`,{withCredentials: true});
  }


  createOrder(order: any): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}${environment.Orders.Create}`, order,{withCredentials: true});
  }


  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}${environment.Orders.UpdateStatus(id)}`, { status },{withCredentials: true});
  }


  getOrdersByUserId(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}${environment.Orders.GetByUserId(userId)}`,{withCredentials: true});
  }
}
