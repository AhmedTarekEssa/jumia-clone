import { AddProduct } from './../../../../seller/components/add-product/add-product';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../../core/services/Product-Service/product';
import { ProductDetails, ProductUi } from '../../../../products/product-models';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../../../../core/services/Categories/category';

interface Product {
  productId: number;
  name: string;
  basePrice: number;
  discountPercentage: number;
  imageUrl: any;
  discount?: number;
  approvalStatus: string;
  isAvailable: boolean;
  stockQuantity: number;
  variants: {
    variantId: number;
    color: string;
    size: string;
    price: number;
    stock: number;
    status: 'Active' | 'Inactive';
  }[];
}

interface ProductVariant {
  // Define based on your ProductVariantDto
  variantId: number;
  color: string;
  size: string;
  price: number;
  stock: number;
  status: 'Active' | 'Inactive';
}

interface NewProduct {
  sellerId: number;
  categoryId: number;
  name: string;
  description: string;
  basePrice: number;
  mainImage: File | null;
  additionalImages: File[];
  attributes: { attributeId: number; values: string[] }[];
  variants: {
    variantName: string;
    price: number;
    stockQuantity: number;
    sku: string;
    image: File | null;
  }[];
}

interface Category {
  id: number;
  name: string;
}

interface ProductAttribute {
  id: number;
  name: string;
  values: string[];
}


@Component({
  standalone: true ,
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProducts implements OnInit , OnDestroy {
  private destroyed = new Subject<void>();

  showAddForm = false;
  searchTerm = '';
  categoryFilter = '';
  statusFilter = '';

  products: Product[] = [];
  isLoading = true;
  error = '';

  editingProduct: Product | null = null ;

  newProduct: NewProduct = {
    sellerId: 2, // Set default or get from auth
    categoryId: 0,
    name: '',
    description: '',
    basePrice: 0,
    mainImage: null,
    additionalImages: [],
    attributes: [],
    variants: [{
      variantName: '',
      price: 0,
      stockQuantity: 0,
      sku: '',
      image: null
    }]
  };

  categories: Category[] = [];
  attributesForCategory: ProductAttribute[] = [];
  isSubmitting = false;

    private categoryService = inject( CategoryService);
    // private attributeService = inject(AttributeService);
    private cdr = inject(ChangeDetectorRef);

  constructor(private productService : ProductService){
  //   console.log(productService);
  //   console.log('getAllWithDetails exists:', 
  // typeof this.productService.getAllWithDetails === 'function');
  }

  ngOnInit(): void {
      console.log('Component initialized'); // Debug log

    this.loadProducts();
    this.loadCategories();
    
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

 
  loadProducts(): void {
    this.isLoading = true;
    this.error = '';
    
    this.productService.getAllUi().pipe(
      takeUntil(this.destroyed)
    ).subscribe({
      next: (apiProducts) => {
        this.products = this.mapApiProductsToUiModel(apiProducts);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Error loading products:', err);
      }
    });
  }

  // Add these methods to the component class
acceptProduct(product: Product): void {
  if (confirm('Are you sure you want to approve this product?')) {
    this.isLoading = true;
    
    this.productService.activateProduct(product.productId).pipe(
      takeUntil(this.destroyed)
    ).subscribe({
      next: (response) => {
        // Update local product status
        this.products = this.products.map(p => 
          p.productId === product.productId ? 
          { ...p, approvalStatus: 'Active', isAvailable: true } : 
          p
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to approve product';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Approve error:', err);
      }
    });
  }
}

declineProduct(product: Product): void {
  if (confirm('Are you sure you want to decline this product?')) {
    this.isLoading = true;
    
    this.productService.dactivateProduct(product.productId).pipe(
      takeUntil(this.destroyed))
    .subscribe({
      next: (response) => {
        // Update local product status
        this.products = this.products.map(p => 
          p.productId === product.productId ? 
          { ...p, approvalStatus: 'Inactive', isAvailable: false } : 
          p
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to decline product';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Decline error:', err);
      }
    });
  }
}

// Only show delete for non-pending products
// deleteProduct(product: Product): void {
//   if (confirm('Are you sure you want to permanently delete this product?')) {
//     this.isLoading = true;
    
//     this.productService.deleteProduct(product.productId).pipe(
//       takeUntil(this.destroyed))
//     .subscribe({
//       next: (response) => {
//         // Remove from local array
//         this.products = this.products.filter(p => p.productId !== product.productId);
//         this.isLoading = false;
//         this.cdr.detectChanges();
//       },
//       error: (err) => {
//         this.error = 'Failed to delete product';
//         this.isLoading = false;
//         this.cdr.detectChanges();
//         console.error('Delete error:', err);
//       }
//     });
//   }
// }


  loadCategories():void {
    this.categoryService.getAllCategories().pipe(
      takeUntil(this.destroyed)
    ).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:',err);
      }
    });
  }

  onCategoryChange(): void {
    if (this.newProduct.categoryId) {
      this.categoryService.getAttributes(this.newProduct.categoryId).pipe(
        takeUntil(this.destroyed)
      ).subscribe({
        next: (attributes) => {
          this.attributesForCategory = attributes.map(
            attr => ({
              id: attr.categoryId,
              name: attr.name,
              values: this.getPossibleValues(attr.name)
            })
          );
          // Initialize attributes array
          this.newProduct.attributes = attributes.map(attr => ({
            attributeId: attr.categoryId,
            values: []
          }));
        },
        error: (err) => {
          console.error('Error loading attributes:', err);
        }
      });
    }
  }

  getPossibleValues(attributeName: string): string[] {
  const valueMappings: {[key: string]: string[]} = {
    'Color': ['Red', 'Blue', 'Green', 'Black', 'White'],
    'Size': ['S', 'M', 'L', 'XL', 'XXL'],
    'Material': ['Cotton', 'Polyester', 'Wool', 'Silk']
  };
  return valueMappings[attributeName] || [];
}

onMainImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.newProduct.mainImage = file;
    }
  }

  onAdditionalImagesChange(event: any): void {
    this.newProduct.additionalImages = Array.from(event.target.files);
  }

  onVariantImageChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.newProduct.variants[index].image = file;
    }
  }

 onAttributeChange(event: Event, attributeId: number, value: string): void {
  const target = event.target as HTMLInputElement;
  const isChecked = target.checked;
  
  const attribute = this.newProduct.attributes.find(a => a.attributeId === attributeId);
  if (attribute) {
    if (isChecked) {
      attribute.values.push(value);
    } else {
      attribute.values = attribute.values.filter(v => v !== value);
    }
  }
}

   addVariant(): void {
    this.newProduct.variants.push({
      variantName: '',
      price: 0,
      stockQuantity: 0,
      sku: '',
      image: null
    });
  }

  removeVariant(index: number): void {
    if (this.newProduct.variants.length > 1) {
      this.newProduct.variants.splice(index, 1);
    }
  }


  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    const formData = new FormData();
    
    // Append basic product info
    formData.append('SellerId', this.newProduct.sellerId.toString());
    formData.append('CategoryId', this.newProduct.categoryId.toString());
    formData.append('Name', this.newProduct.name);
    formData.append('Description', this.newProduct.description);
    formData.append('BasePrice', this.newProduct.basePrice.toString());
    
    // Append main image
    if (this.newProduct.mainImage) {
      formData.append('MainImageUrl', this.newProduct.mainImage);
    }
    
    // Append additional images
    this.newProduct.additionalImages.forEach((image, index) => {
      formData.append(`AdditionalImageUrls`, image);
    });
    
    // Append attributes
    this.newProduct.attributes.forEach((attr, index) => {
      formData.append(`Attributes[${index}].AttributeName`, 
        this.attributesForCategory.find(a => a.id === attr.attributeId)?.name || '');
      attr.values.forEach((value, valueIndex) => {
        formData.append(`Attributes[${index}].Values[${valueIndex}]`, value);
      });
    });

     // Append variants
    this.newProduct.variants.forEach((variant, index) => {
      formData.append(`Variants[${index}].VariantName`, variant.variantName);
      formData.append(`Variants[${index}].Price`, variant.price.toString());
      formData.append(`Variants[${index}].StockQuantity`, variant.stockQuantity.toString());
      formData.append(`Variants[${index}].Sku`, variant.sku);
      if (variant.image) {
        formData.append(`Variants[${index}].VariantImageUrl`, variant.image);
      }
    });
    
    this.productService.AddProduct(formData).pipe(
      takeUntil(this.destroyed)
    ).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.showAddForm = false;
        this.resetForm();
        this.loadProducts(); // Refresh the product list
      },
      error: (error) => {
        this.isSubmitting = false;
        this.error = 'Failed to add product. Please try again.';
        console.error('Error adding product:', error);
      }
    });
  }

   resetForm(): void {
    this.newProduct = {
      sellerId: 1,
      categoryId: 0,
      name: '',
      description: '',
      basePrice: 0,
      mainImage: null,
      additionalImages: [],
      attributes: [],
      variants: [{
        variantName: '',
        price: 0,
        stockQuantity: 0,
        sku: '',
        image: null
      }]
    };
    this.attributesForCategory = [];
  
  // ... rest of the existing methods
   }




  private mapApiProductsToUiModel(apiProducts: ProductUi[]): Product[] {
    if (!apiProducts) return [];

    return apiProducts.map(apiProduct => ({
    productId: apiProduct.productId,
    name: apiProduct.name,
    basePrice: apiProduct.basePrice,
    discountPercentage: apiProduct.discountPercentage,
    imageUrl: apiProduct.imageUrl,
    discount: apiProduct.discount,
    approvalStatus: apiProduct.approvalStatus,
    isAvailable: apiProduct.isAvailable,
    stockQuantity: apiProduct.stockQuantity,
    variants: apiProduct.variants?.map(variant => ({
      variantId: variant.variantId,
      color: variant.variantName,
      size: variant.sku,
      price: variant.price,
      stock: variant.stockQuantity,
      status: variant.stockQuantity > 0 ? 'Active' : 'Inactive'
    })) || []
    }));
  }


  get filteredProducts(): Product[] {
    return this.products.filter(product => {
      return product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

 handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none'; // Hide the broken image
  // OR
  img.parentElement!.classList.add('no-image'); // Add CSS class to parent
}

editProduct(product: Product){
  this.editingProduct = {...product};
  this.showAddForm = true;

}

updateProduct(): void{
  if(!this.editingProduct) return;

  this.products = this.products.map(p => 
    p.productId === this.editingProduct!.productId ? this.editingProduct! : p
  );

  this.cancelEdit();
  this.loadProducts();

}

cancelEdit(): void {
    this.editingProduct = null;
    this.showAddForm = false;
  }

// DELETE PRODUCT
  deleteProduct(product: Product): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.isLoading = true;
      
      // Call the deactivate endpoint (assuming this is your delete functionality)
      this.productService.dactivateProduct(product.productId).pipe(
        takeUntil(this.destroyed)
      ).subscribe({
        next: () => {
          // Remove from local array
          this.products = this.products.filter(p => p.productId !== product.productId);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Failed to delete product';
          this.isLoading = false;
          this.cdr.detectChanges();
          console.error('Delete error:', err);
        }
      });
    }
  }

  // ACTIVATE PRODUCT
  activateProduct(productId: number): void {
    this.isLoading = true;
    this.productService.activateProduct(productId).pipe(
      takeUntil(this.destroyed)
    ).subscribe({
      next: () => {
        // Update local status
        this.products = this.products.map(p => {
          if (p.productId === productId) {
            p.variants.forEach(v => v.status = 'Active');
          }
          return p;
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to activate product';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


  private handleLoadError(error: any): void {
    this.isLoading = false;
    this.error = 'Failed to load products. Please try again later.';
    this.cdr.detectChanges();
    console.error('Error loading products:', error);
  }
  






}
