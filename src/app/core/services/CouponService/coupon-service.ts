import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { CouponDto, CreateCouponDto } from '../../../features/coupon/coupon-models';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private httpClient = inject(HttpClient);
  private apiBaseUrl= environment.BaseUrlPath;
  private controller = environment.Coupon;
  private couponsSubject = new BehaviorSubject<any[]>([]);

  constructor() {}

  // Get all active coupons
  getAllActiveCoupons(): Observable<CouponDto[]> {
    return this.httpClient.get<CouponDto[]>(this.apiBaseUrl + this.controller.GetAllActiveCoupons, { withCredentials: true })
      .pipe(
        tap({
          next: (coupons) => {
            this.couponsSubject.next(coupons);
            console.log('Fetched active coupons:', coupons.length);
          },
          error: (error) => console.error('Error fetching active coupons:', error)
        })
      );
  }

  // Get coupon by code
  getCouponByCode(code: string): Observable<CouponDto> {
    return this.httpClient.get<CouponDto>(this.apiBaseUrl + this.controller.GetCouponByCode(code), { withCredentials: true })
      .pipe(
        tap({
          next: (coupon) => console.log('Fetched coupon by code:', coupon.code),
          error: (error) => console.error('Error fetching coupon by code:', error)
        })
      );
  }



  // Create new coupon
  createCoupon(coupon: CreateCouponDto): Observable<boolean> {
    // Convert dates to ISO strings
    const formattedCoupon = {
      ...coupon,
      startDate: coupon.startDate,
      endDate: coupon.endDate
    };
    return this.httpClient.post<boolean>(this.apiBaseUrl + this.controller.CreateCoupon, coupon, { withCredentials: true })
      .pipe(
        // map(response => {
        //   return response.includes('Coupon created') || response.includes('success')
        // }),
        catchError(error => {
        console.error('Error creating coupon:', error);
        return of(false); // Return observable with false on error
      })
      );
  }

updateCoupon(couponId: number, dto: CreateCouponDto): Observable<any> {
  // Properly construct the URL using the couponId parameter
  const url = `${this.apiBaseUrl}${this.controller.UpdateCoupon(couponId)}`;
  
  return this.httpClient.put<any>(url, dto, { withCredentials: true })
    .pipe(
      catchError(error => {
        console.error('Error updating coupon:', error);
        return of(false);
      })
    );
}

  deleteCoupon(couponId: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(
      this.apiBaseUrl + this.controller.DeleteCoupon(couponId) ,
      { withCredentials: true }
    ).pipe(
      catchError(error => {
        console.error('Error deleting coupon:', error);
        return of(false);
      })
    );
  }

   // Coupon Application
  applyCoupon(code: string, cartTotal: number): Observable<boolean> {
    return this.httpClient.get<boolean>(
      this.apiBaseUrl + this.controller.ApplyCoupon,
      { withCredentials: true }
    ).pipe(
      catchError(error => {
        console.error('Error applying coupon:', error);
        return of(false);
      })
    );
  }





  
}
