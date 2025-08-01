import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountPricePipe } from "../../pipes/discount-price-pipe";
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { Recommendation } from '../../../core/services/recommendation';
import { RecProduct } from '../../../shared/models/rec-product';
import { CategoryService } from '../../../core/services/Categories/category';
import { Category } from '../../../shared/models/category-';
import { Loading } from "../loading/loading";

@Component({
  selector: 'app-recommended-products',
  imports: [CommonModule, DiscountPricePipe, Loading],
  templateUrl: './recommended-products.html',
  styleUrl: './recommended-products.css'
})
export class RecommendedProducts {
  private recommendationService = inject(Recommendation);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  base = environment.ImageUrlBase;
  products: RecProduct[] = [];
  categories: { [id: number]: Category } = {};
  title = "Recommended For You";
  isLoading = true;
  loadingError = false;
  headerCategory: Category | null = null;

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations() {
    this.isLoading = true;
    this.loadingError = false;
    
    this.recommendationService.getRecommendation().subscribe({
      next: (data) => {
        this.products = data;
        console.log(this.products)
        this.isLoading = false;
        // Get unique category IDs from products
        const categoryIds = [...new Set(data.map(p => p.categoryId))];
        
        if (categoryIds.length > 0) {
          this.loadCategories(categoryIds);
        } else {
          this.isLoading = false;
        }
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err) => {
        console.error('Error loading recommendations', err);
        this.isLoading = false;
        this.loadingError = true;
        this.cdr.detectChanges(); // Manually trigger change detection
      }
    });
  }

  loadCategories(categoryIds: number[]) {
    let loadedCount = 0;
    
    categoryIds.forEach(id => {
      this.categoryService.getCategoryById(id).subscribe({
        next: (category) => {
          this.categories[id] = category;
          
          // Set the first category as the header category
          if (!this.headerCategory) {
            this.headerCategory = category;
          }
          
          // Check if all categories are loaded
          loadedCount++;
          if (loadedCount === categoryIds.length) {
            this.isLoading = false;
            this.cdr.detectChanges(); // Manually trigger change detection
          }
        },
        error: (err) => {
          console.error(`Error loading category ${id}`, err);
          
          loadedCount++;
          if (loadedCount === categoryIds.length) {
            this.isLoading = false;
            this.cdr.detectChanges(); // Manually trigger change detection
          }
        }
      });
    });
  }

  getCategoryName(categoryId: number): string {
    return this.categories[categoryId]?.name || `Category ${categoryId}`;
  }

  goToProductDetails(productId: number) {
    this.router.navigate(['/Products', productId]);
  }

  goToCategory(categoryId: number) {
    if (this.categories[categoryId]) {
      this.router.navigate(['/Products'], { 
        queryParams: { category: categoryId } 
      });
    }
  }

  scrollLeft(container: HTMLElement) {
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(container: HTMLElement) {
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }

  retryLoading() {
    this.loadRecommendations();
  }
}