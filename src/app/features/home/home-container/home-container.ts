import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavbarMain } from "../../../shared/components/navbars/navbar-main/navbar-main";
import { FlashSale } from "../components/flash-sale/flash-sale";
import { AllEssentials } from "../components/all-essentials/all-essentials";
import { CategoryShowcase } from "../components/category-showcase/category-showcase";
import { MegaSale } from "../components/mega-sale/mega-sale";
import { InfoComponent } from "../components/info/info.component";
import { FooterMain } from "../../../shared/components/footers/footer-main/footer-main";
import { PromoSliderComponent } from "../components/promoSlider/promo-slider.component";
import { ImageContainer } from "../../../shared/components/image-container/image-container";
import { CategoryList } from '../../../shared/components/category-list/category-list';
import { CenterSliderComponent } from "../../../shared/components/center-slider/center-slider.component";
import { CategoryService } from '../../../core/services/Categories/category';
import { ProductService } from '../../../core/services/Product-Service/product';
import { RecommendedProducts } from "../../../shared/components/recommended-products/recommended-products";
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home-container',
  imports: [FlashSale, AllEssentials, CategoryShowcase, MegaSale, InfoComponent, PromoSliderComponent, ImageContainer, CategoryList, CenterSliderComponent, RecommendedProducts, CommonModule],
  templateUrl: './home-container.html',
  styleUrl: './home-container.css'
})
export class HomeContainer implements OnInit {
  categoriesWithProducts: {id: number, name: string}[] = [];
  isUser:boolean=false;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private cdr:ChangeDetectorRef,
    private cookieService: CookieService,

      
    
  ) {}

  ngOnInit(): void {
    this.checkUserLogin();

    this.loadCategoriesWithProducts();
  }

  checkUserLogin() {
    const userInfoCookie = this.cookieService.get('UserInfo');
    if (userInfoCookie) {
      try {
        // Decode the URL encoded cookie
        const decodedCookie = decodeURIComponent(userInfoCookie);
        if (decodedCookie){
          this.isUser = true;
          this.cdr.detectChanges();
        }

      } catch (e) {
        console.error('Error parsing user info cookie', e);
      }
    }
  }
  loadCategoriesWithProducts() {
  // First get all categories
  this.categoryService.getAllCategories().subscribe({
    next: (categories) => {
      // For each category, check if it has products
      categories.forEach(category => {
        this.categoriesWithProducts.push({
          id: category.id,
          name: category.name
        });
        this.cdr.detectChanges()
        console.log(`Category: ${category.name} (ID: ${category.id})`);
        console.log(this.categoriesWithProducts)

        // The commented-out product check code was missing a closing bracket
        // this.productService.productsByFilters({ categoryIds: [1] }, 1, 10).subscribe({
        //   next: (response) => {
        //     if (response.items.length > 0) {
        //       this.categoriesWithProducts.push({
        //         id: category.id,
        //         name: category.name
        //       });
        //     }
        //   },
        //   error: (err) => console.error(`Error checking products for category ${category.id}`, err)
        // });
      });
    },
    error: (err) => console.error('Error loading categories', err)
  });
}
}

