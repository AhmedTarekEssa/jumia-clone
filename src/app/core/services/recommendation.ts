import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { RecProduct } from '../../shared/models/rec-product';

@Injectable({
  providedIn: 'root'
})
export class Recommendation {

  private baseUrl: string = environment.BaseUrlPath;

  constructor(private http: HttpClient) { }

  // GET /api/Wishlist - Get all wishlist items
  getRecommendation(): Observable<RecProduct[]> {
    return this.http.get<RecProduct[]>(`${this.baseUrl}${environment.Recommendation.GetAll}`, { withCredentials: true });
  }

}
