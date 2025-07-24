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
,

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

  },
  Orders: {
    GetAll: "Order",
    GetById: (id: number) => `Order/get-by-id/${id}`,
    Create: "Order",
    UpdateStatus: (id: number) => `Order/${id}/status`,
    GetByUserId: (userId: string) => `Order/customer/${userId}`,
    getCurrentUserOrders: "Order/current-customer"
  },
  Chat:{
    createchat:'/Chat',
    getChatById:(id:string)=>`/Chat/${id}`,
    getAllChatsByUserId:(userId:string)=>`/Chat/user/${userId}`,
    getmychat:'/Chat/my-chat',
    getactivechat:'/Chat/active',
    getadminchat:(adminId:string)=>`/Chat/admin/${adminId}`,
    getmyadminchat:'/Chat/my-admin-chats',
    sendmessage:'/Chat/send-message',
    getmessagesByChatId: (chatId: string, page: number = 1, pageSize: number = 50) => `/Chat/${chatId}/messages?page=${page}&pageSize=${pageSize}`,
    assignToChat: (chatId: string) => `/Chat/${chatId}/assign`,
    closeChat: (chatId: string) => `/Chat/${chatId}/close`,
    markChatAsRead: (chatId: string) => `/Chat/${chatId}/mark-read`,
  },
  Address:{
    getAddress:'/Adsress',
    addAddress:'/Address',
    getAddressByUserId:'/Address/user',
    getAddressByAddressId:(addressId:number)=>`/Address/${addressId}`,
    updateAddressByAddressId:(addressId:number)=>`/Address/${addressId}`,
    deleteAddressByAddressId:(addressId:number)=>`/Address/${addressId}`
  }

  };





