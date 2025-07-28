import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { ProductUi } from '../../../features/products/product-models';

export interface AskQuestion{
  question:string,
  productId:number,

}
export interface GetAnswer{
  question:string,
  productId:number,
  answer:string
}
export interface ChatMessage {
 type: 'user' | 'bot';
  text: string; // The main answer from the bot or user's question
  thought?: string; // Optional: The bot's thinking process
  showThought?: boolean;
}

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

  productBot(Question:AskQuestion):Observable<GetAnswer>{
    return this.httpClient.post<GetAnswer>(this.apiBaseUrl+this.controller.Ask,Question)
  }
}
