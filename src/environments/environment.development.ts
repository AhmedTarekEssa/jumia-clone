export const environment = {
  BaseUrlPath : "http://localhost:5087/api/",
  Categories:{
    GetAll: (includeSubcategories: boolean = true) =>
      `Categories?includeSubcategories=${includeSubcategories}`,
    Create: "Categories",
    GetById: (id: number, includeSubcategories: boolean = true) =>
      `Categories/${id}?includeSubcategories=${includeSubcategories}`,
    Update: (id: number) => `Categories/${id}`,
    Delete: (id: number) => `Categories/${id}`,

    GetDescendants: (id: number) => `Categories/${id}/descendants`,
    GetMainCategories: "Categories/main",

    GetAttributes: (parentId: number) => `Categories/${parentId}/attributes`,
  }
};
