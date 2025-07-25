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


  approved!: ProductUi[];
  rejected!: ProductUi[];
  pending!: ProductUi[];
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
          this.approved = this.products.filter(p => p.approvalStatus.toLowerCase() === 'approved');
          this.rejected = this.products.filter(p => p.approvalStatus.toLowerCase() === 'rejected');
          this.pending = this.products.filter(p => p.approvalStatus.toLowerCase() === 'pending');

          this.cdr.detectChanges()
        }
      }
    );

  }
}

  filterProducts(): void {
    let filtered = [...this.products];
    
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(product => product.approvalStatus.toLocaleLowerCase() === this.selectedStatus.toLocaleLowerCase());
    } 

   this.filteredProducts = filtered
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
      'pending': 'status-out-of-stock',
      'approved': 'status-active',
      'rejected': 'status-inactive',
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

searchProducts(){
  this.selectedStatus = 'all';
  this.filteredProducts = this.products.filter(p=>p.name.toLowerCase().includes(this.searchTerm.toLocaleLowerCase())||p.basePrice== +(this.searchTerm)||p.productId== +(this.searchTerm));
}

}
