import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class Campaign {
  
  private httpClient = inject(HttpClient)

  requestCampaign(sellerId:number){
    return this.httpClient.post(environment.BaseUrlPath + environment.Campaign.requestCampaign(sellerId),{})
  }
  requestMonthlyReport(sellerId:number){
    return this.httpClient.post(environment.BaseUrlPath + environment.Campaign.requestMonthlyReport(sellerId,new Date().getFullYear(),new Date().getMonth()+1),{})
  }

  
  
}
