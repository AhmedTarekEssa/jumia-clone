import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: string;

}

export interface UserInformation {
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,
  dateOfBirth: "2025-07-25T22:29:28.986Z",
  gender: string
}
@Injectable({
  providedIn: 'root'
})
export class User {
 private httpClient = inject(HttpClient);
 private apiBaseUrl= environment.BaseUrlPath;
 
constructor(){}
getUserInfo():Observable<UserInformation>{
    return this.httpClient.get<UserInformation>(this.apiBaseUrl + environment.User.getUserInfo,{withCredentials:true})
  }
getAllCustomers(): Observable<UserProfile[]>{
  return this.httpClient.get<UserProfile[]>(`${this.apiBaseUrl}/User/customers`,{withCredentials:true})
  .pipe(
    tap(
      {
      next: (customers) => console.log('Customers loaded successfully:', customers), // Log the response
      error: (error) => {
        console.error('Error while getting customers:', error); // More detailed logging
        alert('Failed to load customers. Please check the console for errors.'); // Show user-friendly message
      }
    }
    )
  );
}

getAllSellers(): Observable<UserProfile[]>{
  return this.httpClient.get<UserProfile[]>(`${this.apiBaseUrl}/User/sellers`,{withCredentials:true})
  .pipe(
    tap(
      {
      next: (sellers) => console.log('Sellers loaded successfully:', sellers), // Log the response
      error: (error) => {
        console.error('Error while getting sellers:', error); // More detailed logging
        alert('Failed to load sellers. Please check the console for errors.'); // Show user-friendly message
      }
    }
    )
  );
}

}

