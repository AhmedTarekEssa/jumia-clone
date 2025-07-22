import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductUi } from '../../../products/product-models';
import { CommonModule } from '@angular/common';
import { DiscountPricePipe } from "../../../../shared/pipes/discount-price-pipe";
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-category-showcase',
  imports: [CommonModule, DiscountPricePipe],
  templateUrl: './category-showcase.html',
  styleUrl: './category-showcase.css'
})
export class CategoryShowcase implements OnInit {

private productService = inject(ProductService)
private cdr = inject(ChangeDetectorRef)
private router = inject(Router)
base = environment.ImageUrlBase;
products!:ProductUi[];


ngOnInit(): void {
  this.productService.productsByFilters({ categoryIds: [15] },1,10).subscribe({
    next: (data) => {
      this.products = data.items;
      console.log(this.products)
      this.cdr.detectChanges();
    }
})
}

goToProductDetails(productId: number) {
    this.router.navigate(['/product', productId]);
  }
}
