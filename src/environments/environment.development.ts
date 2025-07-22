export const environment = {


    production: false,
    apiUrl: 'http://localhost:5087/api',
    authRoutes: {
        login: '/auth/login',
        register: '/auth/register',
        checkEmail: '/Auth/email-check',
        verifyOtp: '/auth/verify-otp',
        logout: '/auth/logout',   
    }
};

    BaseUrlPath : "http://localhost:5087/api",
    ImageUrlBase:`http://localhost:5087`,
    Product:{
        GetAllWithDetails:"/Product/get-all-with-details",
        GetDetailsById:(productId:number,role:string)=>`/Product/get-details-by-id?productId=${productId}&role=${role}`,
        GetAllForUI:"/Product/get-all",
        GetBySellerIdForUI:(sellerId:number,role:string)=>`/Product/all-by-sellerId?sellerId=${sellerId}&role=${role}`,
        BasicSearch:(keyword:string)=>`/Product/search?keyword=${keyword}`,
        CreateProduct:"/Product/create",
        GetProductsByFilters:(role:string,pageNumber:number,pageSize:number)=>
                `/Product/Products-filterd?role=${role}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
        Activate:(id:number)=>`/Product/Activate/${id}`,
        Deactivate:(id:number)=>`/Product/Deactivate/${id}`,
        GetVariantByAttributes:(id:number)=>`/Product/${id}/variant`,
        GetMatchingAtrributesOptions:(id:number)=>`/Product/${id}/attribute-options`

    },
    Cart:{
        GetCart:"/Cart",
        ClearCart:"/Cart",
        AddToCart:"/Cart/items",
        UpdateCartItem:(id:number|undefined)=>`/Cart/items/${id}`,
        DeleteCartItem:(id:number)=>`/Cart/items/${id}`
    },


  Wishlist: {
    GetAll: "/Wishlist",
    Clear: "/Wishlist",
    AddItem: (productId: number) => `/Wishlist/items/${productId}`,
    RemoveItem: (id: number) => `/Wishlist/items/${id}`
  },
  
  Categories: {

    GetAll: (includeSubcategories: boolean = true) =>
      `/Categories?includeSubcategories=${includeSubcategories}`,
    Create: "/Categories",
    GetById: (id: number, includeSubcategories: boolean = true) =>
      `/Categories/${id}?includeSubcategories=${includeSubcategories}`,
    Update: (id: number) => `/Categories/${id}`,
    Delete: (id: number) => `/Categories/${id}`,

    GetDescendants: (id: number) => `/Categories/${id}/descendants`,
    GetMainCategories: "/Categories/main",

    GetAttributes: (parentId: number) => `/Categories/${parentId}/attributes`,
  }

};


