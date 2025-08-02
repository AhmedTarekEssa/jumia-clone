import { OrderPayload } from "../app/shared/models/delivery-option";

export const environment = {


    production: false,
    apiUrl: 'http://localhost:5087/api',
    authRoutes: {
        login: '/auth/login',
        register: '/auth/register',
        SellerRegister:'/seller/SellerRegister',
        checkEmail: '/Auth/email-check',
        verifyOtp: '/auth/verify-otp',
        forgetPassword: '/Auth/forgot-password',
        resetPassword: '/Auth/reset-password',

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
        Delete:(id:number)=>`/Product/delete/${id}`,
        GetVariantByAttributes:(id:number)=>`/Product/${id}/variant`,
        GetMatchingAtrributesOptions:(id:number)=>`/Product/${id}/attribute-options`,
        UpdateProduct:'/Product/update',
        updateStatus:(productId:number,status:string)=>`/Product/update-status?productId=${productId}&status=${status}`
    },
    Coupon:{
      GetAllActiveCoupons:"/Coupon/GetAllCoupons",
      GetCouponByCode:(code:string) => `/Coupon/GetCouponByCode/${code}`,
      CreateCoupon:"/Coupon/CreateCoupon",
      UpdateCoupon:(couponId:number) => `/Coupon/UpdateCoupon/${couponId}`,
      DeleteCoupon:(couponId: number) => `/Coupon/DeleteCoupon/${couponId}`,
      ApplyCoupon:(code:string) => `/Coupon/ApplyCoupon/${code}`,
      AssignCoupon:"/Coupon/AssignCoupon",
      MarkCouponAsUsed:"/Coupon/MarkCouponAsUsed",
      GetUserCoupons:(userId: number) => `/Coupon/UserCoupons/${userId}`,
      DeleteUserCoupon: (userCouponId: number) => `/Coupon/DeleteUserCoupon/${userCouponId}`
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
  Recommendation: {
    GetAll: "/Recommendation/user-recommendations",
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

    GetAll: "/Order/getall",

    GetById: (id: number) => `/Order/get-by-id/${id}`,
    Create: "/Order",
    UpdateStatus: (id: number) => `/Order/${id}/status`,
    GetByUserId: (userId: string) => `/Order/customer/${userId}`,

    getCurrentUserOrders: "/Order/current-customer",
    GetSubOrdersBySellerId: () => `/Order/suborders/seller`,


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
  },

  Payment:{
    initiate: `/Payment/initiate`,
    callback: `/Payment/callback`

  },
  User:{
    getUserInfo:'/User/profile',
    updateUserInfo:`/User/profile`
  },
  AiQuery:{
    Ask:`/AiQuery/Ask`,
    SemanticSearch:(query:string)=>`/AiQuery/semantic-search?query=${query}`

  },
  Campaign:{
    requestCampaign:(sellerId:number)=>`/Campaign/request-email/${sellerId}`,
    requestMonthlyReport:(sellerId:number,year:number,month:number)=>`/Campaign/request-monthly-report/${sellerId}/${year}/${month}`
  }

  };





