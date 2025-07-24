import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../core/services/Categories/category';
import {
  Category
} from '../../../../shared/models/category-';
import { ParsedCategoryAttribute } from '../../../../shared/models/parsed-category-attribute';
import { MainCategory } from '../../../../shared/models/main-category';
import { HttpClientModule } from '@angular/common/http';
import { CategoryAttribute } from '../../../../shared/models/category-attribute';

interface FilterOption {
  id: string;
  label: string;
  checked?: boolean;
}

@Component({
  selector: 'app-Categories-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './category-list.html',
  styleUrls: ['./category-list.css'],
  providers: [CategoryService ]
})
export class CategoryList implements OnInit {
  // Current category data
  currentCategory: Category | null = null;
  subCategories: {id: number, label: string}[] = [];
  attributeResponse:CategoryAttribute[] = [];
  selectedAttributeValues: {[key: number]: string[]} = {};
  selectedValues: {[key: string]: string[]} = {};
  // Filter controls
  brandSearchTerm = '';
  materialSearchTerm = '';
  sizeSearchTerm = '';
  minPrice = 1;
  maxPrice = 8000000;
  selectedDiscountPercentage = '';
  showOnlyDiscounted = false;
  shippedFromEgypt = true;
  expressDelivery = false;

  // Filter options
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
  }

  private loadCategoryData(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');
    console.log('Category ID from route:', categoryId);
    console.log('Route snapshot:', this.route.snapshot.paramMap);

    if (categoryId) {
      this.loadSpecificCategory(+categoryId);
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
///////////////////////////attributes///////////////////////////////
  private loadAttributes(categoryId: number): void {
    this.categoryService.getAttributes(categoryId).subscribe({
      next: (data) => {
        data=data.map(attr => ({
      ...attr,
      allValues: this.parseValues(attr.possibleValues),
      filteredValues: this.parseValues(attr.possibleValues),
      searchTerm: ''
    }));
    console.log('Attributes loaded:', data);
    this.attributeResponse = data;

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
    // attribute.filteredValues = attribute.allValues.filter(value =>
    //   value.toLowerCase().includes(searchTerm)
    // );
  }

  // Check if a value is selected
  isSelected(name: string, value: string): boolean {
    return (this.selectedValues[name] || []).includes(value);
  }

  // Toggle value selection
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
  ///////////////////////////////////////////////////////////////////

  // onBrandSearch(term: string): void {
  //   this.cdr.markForCheck();
  // }

  // onMaterialSearch(term: string): void {
  //   this.cdr.markForCheck();
  // }

  // onSizeSearch(term: string): void {
  //   this.cdr.markForCheck();
  // }

  // onFilterChange(filterType: string, optionId: string, checked: boolean): void {
  //   this.cdr.markForCheck();
  // }

  onDiscountPercentageChange(value: string): void {
    this.cdr.markForCheck();
  }

  onPriceRangeChange(): void {
    this.cdr.markForCheck();
  }

  applyFilters(): void {
    this.cdr.markForCheck();
  }
}
