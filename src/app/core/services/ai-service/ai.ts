import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ProductUi } from '../../../features/products/product-models';

@Injectable({
  providedIn: 'root'
})
export class Ai {
  
  private httpClient = inject(HttpClient)
  apiBaseUrl = environment.BaseUrlPath;
  controller = environment.AiQuery

  semanticSearch(query:string):Observable<ProductUi[]>{
    return this.httpClient.get<ProductUi[]>(this.apiBaseUrl + this.controller.SemanticSearch(query))
  }
}
