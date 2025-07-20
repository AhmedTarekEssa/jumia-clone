export interface CategoryAttribute {
  attributeId: number;
  categoryId: number;
  name: string;
  type: string;
  possibleValues: string;
  isRequired: boolean;
  isFilterable: boolean;
  searchTerm:string;
  allValues: string[];
  filteredValues: string[];
}


