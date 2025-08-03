import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private baseUrl: string = environment.BaseUrlPath;
  

  constructor(private http: HttpClient) { }

  // GET /api/Wishlist - Get all wishlist items
  getWishlist(): Observable<any> {
    return this.http.get(`${this.baseUrl}${environment.Wishlist.GetAll}`, { withCredentials: true });
  }
  isInWishlist(productId: number): Observable<boolean> {
  return this.getWishlist().pipe(
    map((response: any) => {
      const wishlistItems = response.wishlistItems; // correct property
      return Array.isArray(wishlistItems) && wishlistItems.some(item => item.productId === productId);
    })
  );
}


  // DELETE /api/Wishlist - Clear entire wishlist
  clearWishlist(): Observable<any> {
    return this.http.delete(`${this.baseUrl}${environment.Wishlist.Clear}`, { withCredentials: true });
  }

  // POST /api/Wishlist/items/{productId} - Add item to wishlist
  addToWishlist(productId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}${environment.Wishlist.AddItem(productId)}`,
      {}, { withCredentials: true } // empty body as no payload is required
    );
  }

  // DELETE /api/Wishlist/items/{id} - Remove item from wishlist
  removeFromWishlist(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}${environment.Wishlist.RemoveItem(id)}`,
      { withCredentials: true }
    );
  }
}
