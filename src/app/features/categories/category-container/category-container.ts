import { Component } from '@angular/core';
import { CategoryList } from "../components/category-list/category-list";
import { ProductGrid } from "../../../shared/components/product-containers/product-grid/product-grid";

@Component({
  selector: 'app-category-container',
  imports: [CategoryList, ProductGrid],
  templateUrl: './category-container.html',
  styleUrl: './category-container.css'
})
export class CategoryContainer {

}
