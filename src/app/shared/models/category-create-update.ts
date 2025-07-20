export interface CategoryCreateUpdate {
  name: string;
  description: string;
  imageSrc: string;
  parentCategoryId: number;
}
