import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISeller } from '../../../shared/models/iseller';
import { HttpClient, HttpContext } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private http: HttpClient) {

  }

  getAllSellers(): Observable<ISeller[]> {

    return this.http.get<ISeller[]>('http://localhost:5087/api/Seller/GetAllSellers')
  }

  IsVerify(sellerId: number): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      `http://localhost:5087/api/Seller/Verification/${sellerId}`,
      {} // PATCH requires a body, so send an empty object
    );
  }

  getSellerById(sellerId:number):Observable<ISeller[]>{
    return this.http.get<ISeller[]>(`http://localhost:5087/api/Seller/GetSellerById/${sellerId}`)
  }
  ToggleBlock(sellerId:number):Observable<boolean>{

    return this.http.patch<boolean>(`http://localhost:5087/api/Seller/ToggleBlock/${sellerId}`, {});
  }


}
