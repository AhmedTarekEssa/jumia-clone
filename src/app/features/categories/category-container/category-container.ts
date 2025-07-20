import { Component } from '@angular/core';
import { CategoryList } from "../components/category-list/category-list";

@Component({
  selector: 'app-category-container',
  imports: [CategoryList],
  templateUrl: './category-container.html',
  styleUrl: './category-container.css'
})
export class CategoryContainer {

}
