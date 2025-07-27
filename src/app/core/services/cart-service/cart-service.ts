import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { AddToCart,Cart, CartItem, UpdateCart } from '../../../features/cart/cart-models';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  private http = inject(HttpClient);
  private apiBaseUrl = environment.BaseUrlPath;
  private controller = environment.Cart

//  GetCart:"Cart",
//         ClearCart:"Cart",
//         AddToCart:"Cart",
//         UpdateCartItem:(id:number)=>`Cart/items/${id}`,
//         DeleteCartItem:(id:number)=>`Cart/items/${id}`
//     }


getCart():Observable<Cart>{
  return this.http.get<Cart>(this.apiBaseUrl+this.controller.GetCart ,{withCredentials:true});
}

ClearCart():Observable<any>{
return this.http.delete<any>(this.apiBaseUrl+this.controller.ClearCart ,{withCredentials:true});
}
addToCart(addToCart:AddToCart[]):Observable<any>{
  return this.http.post(this.apiBaseUrl+this.controller.AddToCart,addToCart,{withCredentials:true});
}
UpdateCartItem(id:number|undefined ,updateCartItem:UpdateCart):Observable<CartItem>{
return this.http.put<CartItem>(this.apiBaseUrl+this.controller.UpdateCartItem(id),updateCartItem,{withCredentials:true});
}
DeleteCartItem(id:number):Observable<any>{
 return this.http.delete(this.apiBaseUrl+this.controller.DeleteCartItem(id),{withCredentials:true});
}

}
