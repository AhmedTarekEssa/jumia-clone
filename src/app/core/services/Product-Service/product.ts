import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { ProductDetails,CreateProduct, ProductFilterRequest, ProductUi, Variant, varinatOptions, pagedModelUi } from '../../../features/products/product-models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 private httpClient = inject(HttpClient);
 private apiBaseUrl= environment.BaseUrlPath;
 private controller = environment.Product
 private productSubject = new BehaviorSubject<any[]>([]);

  getAllWithDetails():Observable<ProductDetails[]>{

    return this.httpClient.get<ProductDetails[]>(this.apiBaseUrl+this.controller.GetAllWithDetails,{withCredentials:true})
    .pipe(
      tap(
        {
          next:data=>console.log(data),
          error:(error)=> console.log("Error Ocurred while getting Product details" + error)
        }
      )
    )

  }

  getProductDetails(id:number):Observable<ProductDetails>{
    return this.httpClient.get<ProductDetails>(this.apiBaseUrl+this.controller.GetDetailsById(id,"customer"))
    .pipe(
      tap({
        next:(data)=>console.log("a product with details featched " + data)
      })
    )
  }

  getAllUi():Observable<ProductUi[]>{
    console.log("ppppppppppppppppppppppp");
     return this.httpClient.get<ProductUi[]>(this.apiBaseUrl+this.controller.GetAllForUI)
    .pipe(
      tap({
        next:(data)=>console.log("products ui number is " + data.length),
        error:(e)=>console.log("error occured while fetching product ui list" + e)
      })
    )
  }

  
  getBySellerIdUi(sellerId:number,role:string):Observable<ProductUi[]>{
    return this.httpClient.get<ProductUi[]>(this.apiBaseUrl+this.controller.GetBySellerIdForUI(sellerId,role),{withCredentials:true})

    .pipe(
      tap({
        next:(data)=>console.log("products ui number is " + data.length),
        error:(e)=>console.log("error occured while fetching product ui list" + e)
      })
    )
  }

  AddProduct(product:FormData){
    return this.httpClient.post(this.apiBaseUrl+this.controller.CreateProduct,product,{withCredentials:true})
    .pipe(
      tap({
        next:(data)=>console.log("products ui number is " + data),
        error:(e)=>console.log("error occured while fetching product ui list" + e)
      })
    )
  }

  updateProduct(product:FormData){
    return this.httpClient.put(this.apiBaseUrl+environment.Product.UpdateProduct,product,{withCredentials:true})
  }
  productsByFilters(filters:ProductFilterRequest,pageNumber:number,pageSize:number):Observable<pagedModelUi>{
    return this.httpClient.post<pagedModelUi>(this.apiBaseUrl+this.controller.GetProductsByFilters('customer',pageNumber,pageSize),filters,{withCredentials:true})

    .pipe(
      tap({
        next:(data)=>console.log("products ui number is " + data.items.length),
        error:(e)=>console.log("error occured while fetching product ui list by filters" + e)
      })
    )
  }
//   productsByFilters(filters: ProductFilterRequest, pageNumber: number, pageSize: number): Observable<pagedModelUi> {
//   return this.httpClient.post<pagedModelUi>(
//     this.apiBaseUrl + this.controller.GetProductsByFilters,
//     filters,
//     {
//       params: {
//         role: 'customer',
//         pageNumber: pageNumber.toString(),
//         pageSize: pageSize.toString()
//       },
//       withCredentials: true
//     }
//   ).pipe(
//     tap({
//       next: (data) => console.log("products ui number is " + data.items.length),
//       error: (e) => console.log("error occurred while fetching product ui list by filters", e)
//     })
//   );
// }

  activateProduct(id:number):Observable<{message:string}>{
    return this.httpClient.put<{message:string}>(this.apiBaseUrl+this.controller.Activate(id),null,{withCredentials:true})
 .pipe(
      tap({
        next:(data)=>console.log(data),
        error:(e)=>console.log("error occured while activating the product" + e)
      })
    )

  }

  dactivateProduct(id:number):Observable<{message:string}>{
    return this.httpClient.put<{message:string}>(this.apiBaseUrl+this.controller.Deactivate(id),null,{withCredentials:true})
 .pipe(
      tap({
        next:(data)=>console.log(data),
        error:(e)=>console.log("error occured while dactivating the product" + e)
      })
    )

  }

  search(keyword:string):Observable<ProductUi[]>{
    return this.httpClient.get<ProductUi[]>(this.apiBaseUrl+this.controller.BasicSearch(keyword),{withCredentials:true})
  .pipe(
      tap({
        next:(data)=>console.log(data),
        error:(e)=>console.log("error occured while searching" + e)
      })
    )
  }

  getProductByVariantOptions(id:number,opt:varinatOptions):Observable<Variant>{
    return this.httpClient.post<Variant>(this.apiBaseUrl+this.controller.GetVariantByAttributes(id),opt,{withCredentials:true})
    .pipe(
      tap({
        next:(data)=>console.log(data),
        error:(e)=>console.log("error occured while searching" + e)
      })
    )

  }

 getNextAttributesOptions(id:number,opt:varinatOptions):Observable<Variant>{
    return this.httpClient.post<Variant>(this.apiBaseUrl+this.controller.GetMatchingAtrributesOptions(id),opt,{withCredentials:true})
    .pipe(
      tap({
        next:(data)=>console.log(data),
        error:(e)=>console.log("error occured while searching" + e)
      })
    )

  }

 deleteProduct(id:number):Observable<{message:string}>{
    return this.httpClient.delete<{message:string}>(this.apiBaseUrl+this.controller.Delete(id))
 .pipe(
      tap({
        next:(data)=>console.log(data),
        error:(e)=>console.log("error occured while deleting the product" + e)
      })
    )

  }

  udpateProductStatus(id:number,status:string){
    return this.httpClient.put(environment.BaseUrlPath+this.controller.updateStatus(id,status.toLowerCase()),{})
  }
  


}
