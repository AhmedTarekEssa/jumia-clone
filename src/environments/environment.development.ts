export const environment = {
    BaseUrlPath : "http://localhost:5087/api/",
    Product:{
        GetAllWithDetails:"Product/get-all-with-details",
        GetDetailsById:(productId:number,role:string)=>`Product/get-details-by-id?productId=${productId}&role=${role}`,
        GetAllForUI:"Product/get-all",
        GetBySellerIdForUI:(sellerId:number,role:string)=>`Product/all-by-sellerId?sellerId=${sellerId}&role=${role}`,
        BasicSearch:(keyword:string)=>`Product/search?keyword=${keyword}`,
        CreateProduct:"Product/create",
        GetProductsByFilters:(role:string)=>`Product/Products-filterd?role=${role}`,
        Activate:(id:number)=>`Product/Activate/${id}`,
        Deactivate:(id:number)=>`Product/Deactivate/${id}`,
        GetVariantByAttributes:(id:number)=>`Product/${id}/variant`,
        GetMatchingAtrributesOptions:(id:number)=>`Product/${id}/attribute-options`

    },
    Cart:{
        GetCart:"Cart",
        ClearCart:"Cart",
        AddToCart:"Cart/items",
        UpdateCartItem:(id:number|undefined)=>`Cart/items/${id}`,
        DeleteCartItem:(id:number)=>`Cart/items/${id}`
    }

   
};
