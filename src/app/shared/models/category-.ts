export interface Category {
  id: number;
  name: string;
  description: string;
  imageSrc: string;
  parentCategoryId: number;
  parentCategory: string;
  subCategories: Category[];
}
