import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development'; // Adjust the path as necessary
import { Observable } from 'rxjs';
import { Order } from '../../shared/models/order'; // Assuming you have an Order model
import { OrderPayload } from '../../shared/models/delivery-option';
import{paymentResponse} from '../../shared/models/delivery-option';

@Injectable({
  providedIn: 'root'
})
export class paymentService {
  private baseUrl = environment.BaseUrlPath;

  constructor(private http: HttpClient) { }

  intiatePayment(order: OrderPayload): Observable<paymentResponse> {
    return this.http.post<paymentResponse>(`${this.baseUrl}${environment.Payment.initiate}`, order,{withCredentials: true});
  }


}
