import { CategoryAttribute } from "./category-attribute";

export interface ParsedCategoryAttribute extends Omit<CategoryAttribute, 'possibleValues'> {
  possibleValues: string[];
}
