import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReview } from '../../../shared/models/ireview';
import { HttpClient } from '@angular/common/http';
import { IReviewCreate } from '../../../shared/models/ireview-create';

@Injectable({
  providedIn: 'root'
})
export class IReviewService {

  constructor(private http: HttpClient) {

  }
  getReviewByProductId(productId: number): Observable<IReview[]> {

    return this.http.get<IReview[]>(`http://localhost:5087/api/Rating/ByProduct/${productId}`)
  }

  addRating(dto: IReviewCreate): Observable<any> {
    return this.http.post('http://localhost:5087/api/Rating', dto);
  }
  hasCustomerPurchasedProduct(customerId: number, productId: number): Observable<boolean> {
    return this.http.get<boolean>(`http://localhost:5087/api/Rating/hasPurchased?customerId=${customerId}&productId=${productId}`);
  }

  getallRatings():Observable<IReview[]>{
    return this.http.get<IReview[]>('http://localhost:5087/api/Rating/GetAllRatings')
  }
  
  getAllForAdmin():Observable<IReview[]>{
    return this.http.get<IReview[]>(`http://localhost:5087/api/Rating/GetAllRatingsForAdmin`);
  }

  AcceptReview(ratingId:number):Observable<boolean>{
    return this.http.put<boolean>(`http://localhost:5087/api/Rating/Accept/${ratingId}`,null);
  }

  RejectReview(ratingId:number):Observable<boolean>{
    return this.http.put<boolean>(`http://localhost:5087/api/Rating/Reject/${ratingId}`,null);
  }

}
