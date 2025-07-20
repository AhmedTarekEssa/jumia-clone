export const environment = {
  BaseUrlPath: 'http://localhost:5087/api/',
  Wishlist: {
    GetAll: "Wishlist",
    Clear: "Wishlist",
    AddItem: (productId: number) => `Wishlist/items/${productId}`,
    RemoveItem: (id: number) => `Wishlist/items/${id}`
  }
};
