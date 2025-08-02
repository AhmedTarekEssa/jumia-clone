import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductUi } from '../../../products/product-models';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { environment } from '../../../../../environments/environment.development';
@Component({
  selector: 'app-flash-sale',
  imports: [CommonModule,RouterLink],
  templateUrl: './flash-sale.html',
  styleUrl: './flash-sale.css'
})
export class FlashSale implements OnInit {
flashSaleProducts: ProductUi[] = [
];

baseImageUrl = environment.ImageUrlBase;

constructor(private productService:ProductService,private cdr : ChangeDetectorRef ){

}
ngOnInit(): void {
  this.getAllProducts()
}
getStockPercentage(stock: number): number {
  const maxStock = 20;
  const percentage = (stock / maxStock) * 100;
  return Math.min(Math.max(percentage, 5), 100); // Clamp between 5% and 100%
}

getAllProducts() {
  this.productService.getAllUi().subscribe({
    next: (products: ProductUi[]) => {
      console.log('All products:============================================================');
      console.log(products);
      const filtered = products.filter(product =>
        product.discountPercentage > 0 &&
        product.approvalStatus === 'approved' &&
        product.isAvailable === true
      );

      // Shuffle the array
      const shuffled = filtered.sort(() => 0.5 - Math.random());

      // Take up to 10 random products
      console.log('All products:============================================================ /////////////////////');

      this.flashSaleProducts = shuffled.slice(0, 10);

      console.log(this.flashSaleProducts);

      this.cdr.detectChanges(); // Trigger change detection to update the view
    }
  });
}

  scrollLeft(container: HTMLElement) {
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(container: HTMLElement) {
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }


}
