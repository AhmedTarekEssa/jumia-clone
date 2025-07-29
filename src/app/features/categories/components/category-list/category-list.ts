import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../core/services/Categories/category';
import {
  Category
} from '../../../../shared/models/category-';


import { CategoryAttribute } from '../../../../shared/models/category-attribute';
import { ProductFilterRequest } from '../../../products/product-models';

interface FilterOption {
  id: string;
  label: string;
  checked?: boolean;
}




@Component({
  selector: 'app-Categories-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css'],
  providers: [CategoryService ]
})
export class CategoryList implements OnInit {
  currentCategory: Category | null = null;
  subCategories: {id: number, label: string}[] = [];
  attributeResponse:CategoryAttribute[] = [];
  selectedAttributeValues: {[key: number]: string[]} = {};
  selectedValues: {[key: string]: string[]} = {};
  brandSearchTerm = '';
  materialSearchTerm = '';
  sizeSearchTerm = '';
  minPrice = 1;
  maxPrice = 8000000;
  selectedDiscountPercentage = '';
  showOnlyDiscounted = false;
  shippedFromEgypt = true;
  expressDelivery = false;
  categoryId!:number;

  @Output() applyingFilters= new EventEmitter<ProductFilterRequest>();

  brands: FilterOption[] = [];
  filterOptions: FilterOption[] = [];
  discountOptions = [
    { value: '10', label: '10% or more' },
    { value: '20', label: '20% or more' }
  ];
  campaigns: FilterOption[] = [];
  sizes: FilterOption[] = [];

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategoryData();
    const filter:ProductFilterRequest ={
      categoryIds:[this.categoryId],
    }
    this.cdr.detectChanges();
    this.applyingFilters.emit(filter);

  }

  private loadCategoryData(): void {
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));

    console.log('Category ID from route:', categoryId);
    console.log('Route snapshot:', this.route.snapshot.paramMap);

    if (categoryId) {
      this.loadSpecificCategory(+categoryId);
      this.categoryId = categoryId;
    } else {
      console.error('Failed to load category');
    }
  }

  private loadSpecificCategory(categoryId: number): void {
    this.categoryService.getCategoryById(categoryId, true).subscribe({
      next: (category: Category) => {
        this.currentCategory = category;
        this.subCategories = category.subCategories.map((sub: any, index: number) => ({
          id: index,
          label: typeof sub === 'string' ? sub : (sub && sub.name ? sub.name : '')
        }));
        this.loadAttributes(category.id);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load category from the function', err);
        this.cdr.markForCheck();
      }
    });
}
  private loadAttributes(categoryId: number): void {
    this.categoryService.getAttributes(categoryId).subscribe({
      next: (data) => {
        this.attributeResponse = data.map(attr => ({
          ...attr,
          allValues: this.parseValues(attr.possibleValues),
          filteredValues: this.parseValues(attr.possibleValues),
          searchTerm: ''
        }));
        console.log('Attributes loaded:', this.attributeResponse);
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load attributes', err)
    });
  }

  parseValues(valuesString: string): string[] {
    try {
      console.log('Parsing values:', valuesString);
      const valuesss = JSON.parse(valuesString) || []
      return valuesss;
    } catch {
      return [];
    }
  }

  filterValues(attribute: CategoryAttribute ): void {
    const searchTerm = (attribute.searchTerm || '').toLowerCase();
    attribute.filteredValues = attribute.allValues.filter(value =>
      value.toLowerCase().includes(searchTerm)
    );
  }

  isSelected(name: string, value: string): boolean {
    return (this.selectedValues[name] || []).includes(value);
  }

  toggleSelection(name: string, value: string): void {
    if (!this.selectedValues[name]) {
      this.selectedValues[name] = [];
    }

    const index = this.selectedValues[name].indexOf(value);
    if (index >= 0) {
      this.selectedValues[name].splice(index, 1);
    } else {
      this.selectedValues[name].push(value);
    }
    console.log('Selected values:', this.selectedValues);
    this.cdr.markForCheck();
  }

  onDiscountPercentageChange(value: string): void {
    this.cdr.markForCheck();
  }

  onPriceRangeChange(): void {
    this.cdr.markForCheck();
  }

  applyFilters(): void {
    const filters: ProductFilterRequest = {};

    if (this.currentCategory && this.currentCategory.id) {
      filters.categoryIds = [this.currentCategory.id];
    }
    console.log(this.categoryId);

    const attributeFilters: { [key: string]: string } = {};
for (const attributeName in this.selectedValues) {
  if (this.selectedValues.hasOwnProperty(attributeName)) {
    const values = this.selectedValues[attributeName];
    if (values.length > 0) {
      attributeFilters[attributeName] = values.join(','); // This creates "Color": "Red,Green"
    }
  }
}

    if (Object.keys(attributeFilters).length > 0) {
      filters.attributeFilters = attributeFilters;
    }

    filters.minPrice = this.minPrice;
    filters.maxPrice = this.maxPrice;

    // You can add logic for other filters like showOnlyDiscounted, shippedFromEgypt, expressDelivery
    // For example, if your API expects specific flags:
    // if (this.showOnlyDiscounted) {
    //   filters.discounted = true;
    // }
    // if (this.shippedFromEgypt) {
    //   filters.shippedFromEgypt = true;
    // }
    // if (this.expressDelivery) {
    //   filters.expressDelivery = true;
    // }

    // If you need to include discount percentage in the filter, you might add it like this:
    // if (this.selectedDiscountPercentage) {
    //   filters.minDiscountPercentage = parseInt(this.selectedDiscountPercentage, 10);
    // }

    console.log('Applying filters:', filters);
    this.applyingFilters.emit(filters);
    this.cdr.markForCheck();
  }
}