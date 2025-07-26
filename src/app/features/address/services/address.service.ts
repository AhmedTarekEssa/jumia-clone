import { Address } from '../models/address.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';



@Injectable({ providedIn: 'root' })
export class AddressService {
  private apiUrl = environment.BaseUrlPath 

  constructor(private http: HttpClient) {}

  getAll(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl + environment.Address.getAddress,{withCredentials:true});
  }

  getByUser(): Observable<Address[]> {
    return this.http.get<Address[]>(this.apiUrl + environment.Address.getAddressByUserId,{withCredentials:true});
  }

  getById(addressId: number): Observable<Address> {
    return this.http.get<Address>(this.apiUrl + environment.Address.getAddressByAddressId(addressId),{withCredentials:true});
  }

  add(address: Address): Observable<Address> {
    return this.http.post<Address>(this.apiUrl + environment.Address.addAddress,address,{withCredentials:true});
  }

  update(addressId: number, address: Address): Observable<any> {
    return this.http.put(this.apiUrl + environment.Address.updateAddressByAddressId(addressId),address,{withCredentials:true});
  }

  delete(addressId: number): Observable<any> {
    return this.http.delete(this.apiUrl + environment.Address.deleteAddressByAddressId(addressId),{withCredentials:true});
  }
}
