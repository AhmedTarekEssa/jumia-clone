import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductDetails, ProductUi } from '../../../products/product-models';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule,],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  products: ProductUi[]=[] ;

  filteredProducts: ProductUi[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';
  selectedStatus: string = 'all';
  userInfoCookie!:string|null
  baseImageUrl = environment.ImageUrlBase;
  //////////////////////services///////////////
  private productService = inject(ProductService);

  constructor(private router: Router ,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {

    this.userInfoCookie = this.getCookie('UserInfo');

if (this.userInfoCookie) {
  
    const userInfo = JSON.parse(this.userInfoCookie);
    const userTypeId = userInfo.UserTypeId;
    console.log('UserTypeId:', userTypeId);
  

    this.productService.getBySellerIdUi(1,"Seller").subscribe(
      {
        next:(data)=>{
          console.log(data)
          this.products = data
          this.filteredProducts = [...this.products];
          
          this.cdr.detectChanges()
        }
      }
    );

  }
}

  filterProducts(): void {
    let filtered = [...this.filteredProducts];

    if(!this.searchTerm){
      this.filteredProducts = this.products

      this.cdr.detectChanges();
      return
    }
    
    if (this.searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.productId.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        
      );
    }

    // if (this.selectedCategory !== 'all') {
    //   filtered = filtered.filter(product => product.category === this.selectedCategory);
    // }

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(product => product.approvalStatus === this.selectedStatus);
    }

    this.filteredProducts = filtered;
  }

  editProduct(productId: number): void {
    this.router.navigate(['/seller/product-edit', productId]);
  }

  toggleProductStatus(productId: number): void {
    const product = this.products.find(p => p.productId === productId);
    if (product) {
      product.approvalStatus = product.approvalStatus === 'active' ? 'inactive' : 'active';
      this.filterProducts();
    }
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
     this.productService.dactivateProduct(productId).subscribe({
      next:()=>{
        const product = this.products.find(p=>p.productId==productId)
        product!.approvalStatus = "Deleted"
        this.cdr.detectChanges();
        this.filterProducts();
      }
     })
      
    }
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Accepted': 'status-active',
      'Deleted': 'status-inactive',
      'pending': 'status-out-of-stock'
    };
    return statusClasses[status] || '';
  }

  navigateToAddProduct(): void {
    this.router.navigate(['/seller/add-product']);
  }

  getUniqueCategories(): string[] {
    // const categories = this.products.map(p => p.category);
    // return [...new Set(categories)];
    return ["hell"]
  }


 getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

}
