import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReview } from '../../../shared/models/ireview';
import { HttpClient } from '@angular/common/http';
import { IReviewCreate } from '../../../shared/models/ireview-create';

@Injectable({
  providedIn: 'root'
})
export class IReviewService {
  
  constructor(private http:HttpClient){

  }
  getReviewByProductId(productId: number) :Observable<IReview[]>{

    return this.http.get<IReview[]>(`https://localhost:7073/api/Rating/ByProduct/${productId}`)
  }

  addRating(dto:IReviewCreate):Observable<any>{
    return this.http.post('https://localhost:7073/api/Rating', dto);
  }
  hasCustomerPurchasedProduct(customerId: number, productId: number): Observable<boolean> {
  return this.http.get<boolean>(`https://localhost:7073/api/Rating/hasPurchased?customerId=${customerId}&productId=${productId}`);
}
}
