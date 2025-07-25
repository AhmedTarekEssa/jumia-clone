import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../../core/services/Categories/category';
import { Category } from '../../models/category-';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  
  hoveredCategory: any = null;
  private categoryService = inject(CategoryService)
  private cdr = inject(ChangeDetectorRef)
  sidebarCategories!:Category[];
  
  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(
      {
        next:(data)=>{
          console.log(data)
          this.sidebarCategories = data
          this.cdr.detectChanges();
        }
      }
    )
  }



}
