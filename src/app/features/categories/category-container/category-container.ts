import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input } from '@angular/core';
import { CategoryList } from "../components/category-list/category-list";
import { ProductGrid } from "../../../shared/components/product-containers/product-grid/product-grid";
import { ProductFilterRequest } from '../../products/product-models';

@Component({
  selector: 'app-category-container',
  imports: [CategoryList, ProductGrid],
  templateUrl: './category-container.html',
  styleUrl: './category-container.css'
})
export class CategoryContainer {

  productsFilters!:ProductFilterRequest;
  private cdr = inject(ChangeDetectorRef)

  applyingFilters(filters:ProductFilterRequest){
    this.productsFilters = filters;
    this.cdr.detectChanges();
  }
}
