import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = 'api/stats';

  constructor(private http: HttpClient) {}

  getSummaryStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/summary`);
  }

  getSalesData(timeRange: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/sales?range=${timeRange}`);
  }

  getRevenueByCategory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenue-by-category`);
  }
}