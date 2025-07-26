import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';




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
  private apiUrlBase = environment.BaseUrlPath

  getUserInfo():Observable<UserInformation>{
    return this.httpClient.get<UserInformation>(this.apiUrlBase + environment.User.getUserInfo,{withCredentials:true})
  }

}
