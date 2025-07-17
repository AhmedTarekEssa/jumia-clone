import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';

@Component({
  selector: 'app-seller-product-edit',
  imports: [],
  templateUrl: './seller-product-edit.html',
  styleUrl: './seller-product-edit.css'
})
export class SellerProductEdit {

    // Component state
  isEditMode = false;
  isLoading = false;
  isCollapsed = false;
  showSidebar = false;
  maxAdditionalImages = 4; // Max number of additional images allowed

  // Form groups
  productForm: FormGroup;
  approvalForm: FormGroup;

  // Image handling
  imagePreview: string | ArrayBuffer | null = null;
  additionalImageInputs: number[] = []; // Tracks additional image inputs
  additionalImagePreviews: (string | ArrayBuffer | null)[] = [];

  // Data lists
  categories: any[] = []; // Replace 'any' with your Category interface
  filteredCategories: any[] = [];
  subcategories: any[] = []; // Replace 'any' with your Subcategory interface
  filteredSellers: any[] = []; // Replace 'any' with your Seller interface
  productAttributes: any[] = []; // Replace 'any' with your Attribute interface

  // Signals for reactive state
  searchQuery = signal('');

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      subcategoryId: ['', Validators.required],
      sellerId: ['', Validators.required],
      hasVariants: [false],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      isAvailable: [true],
      mainImageFile: [null, Validators.required],
      mainImageBase64: [''],
      additionalImages: this.fb.array([]),
      attributeValues: this.fb.array([]),
      variants: this.fb.array([]),
      approvalStatus: ['pending']
    });

    this.approvalForm = this.fb.group({
      adminNotes: ['']
    });
  }

  ngOnInit(): void {
    // Initialize component
    this.checkEditMode();
    this.loadCategories();
    this.loadSubcategories();
    this.loadSellers();
    this.loadProductAttributes();
  }

  // Form array getters
  get variants(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  get attributeValues(): FormArray {
    return this.productForm.get('attributeValues') as FormArray;
  }

  get additionalImages(): FormArray {
    return this.productForm.get('additionalImages') as FormArray;
  }

  // Helper methods
  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.loadProduct(params['id']);
      }
    });
  }

  loadProduct(productId: string): void {
    // Implement product loading logic
    this.isLoading = true;
    // API call to get product details
    this.isLoading = false;
  }

  loadCategories(): void {
    // Implement category loading
  }

  loadSubcategories(): void {
    // Implement subcategory loading
  }

  loadSellers(): void {
    // Implement seller loading
  }

  loadProductAttributes(): void {
    // Implement attribute loading
  }

  // Form methods
  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  createProduct(): void {
    // Implement create product logic
  }

  updateProduct(): void {
    // Implement update product logic
  }

  onApprove(): void {
    if (this.approvalForm.valid) {
      // Implement approval logic
    }
  }

  onReject(): void {
    if (this.approvalForm.valid && this.approvalForm.value.adminNotes) {
      // Implement rejection logic
    }
  }

  // Image handling
  onMainImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.productForm.patchValue({ mainImageFile: file });

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.productForm.patchValue({ mainImageBase64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onAdditionalImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.additionalImagePreviews[index] = reader.result;
        // Store in form array
        if (this.additionalImages.at(index)) {
          this.additionalImages.at(index).patchValue({
            file: file,
            base64: reader.result
          });
        } else {
          this.additionalImages.push(this.fb.group({
            file: file,
            base64: reader.result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  }

  addImageInput(): void {
    if (this.additionalImageInputs.length < this.maxAdditionalImages) {
      this.additionalImageInputs.push(this.additionalImageInputs.length);
      this.additionalImagePreviews.push(null);
      this.additionalImages.push(this.fb.group({
        file: [null],
        base64: ['']
      }));
    }
  }

  removeAdditionalImageInput(index: number): void {
    this.additionalImageInputs.splice(index, 1);
    this.additionalImagePreviews.splice(index, 1);
    this.additionalImages.removeAt(index);
  }

  // Variant methods
  addVariant(): void {
    this.variants.push(this.fb.group({
      variantName: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      discountPercentage: [0, [Validators.min(0), Validators.max(100)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      sku: ['', Validators.required],
      variantImageFile: [null],
      variantImageBase64: [''],
      isDefault: [false],
      isAvailable: [true],
      attributeValues: this.fb.array([])
    }));
  }

  removeVariant(index: number): void {
    if (this.variants.length > 1) {
      this.variants.removeAt(index);
    }
  }

  onDefaultVariantChange(index: number): void {
    this.variants.controls.forEach((variant, i) => {
      variant.get('isDefault')?.setValue(i === index);
    });
  }

  onVariantImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const variantGroup = this.getVariantFormGroup(index);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        variantGroup.patchValue({
          variantImageFile: file,
          variantImageBase64: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // Attribute methods
  addAttribute(): void {
    this.attributeValues.push(this.fb.group({
      attributeName: ['', Validators.required],
      attributeType: ['text', Validators.required],
      value: [''],
      options: [[]],
      isRequired: [false]
    }));
  }

  // Search methods
  onCategorySearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm)
    );
  }

  onSellerSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();
    this.filteredSellers = this.filteredSellers.filter(seller =>
      seller.name.toLowerCase().includes(searchTerm)
    );
  }

  // Helper getters
  getVariantFormGroup(index: number): FormGroup {
    return this.variants.at(index) as FormGroup;
  }

  getVariantAttributeValues(index: number): FormArray {
    return this.getVariantFormGroup(index).get('attributeValues') as FormArray;
  }

  getAttributeFormGroup(index: number): FormGroup {
    return this.attributeValues.at(index) as FormGroup;
  }

  getAttributeControl(variantIndex: number, attributeIndex: number): FormGroup {
    return this.getVariantAttributeValues(variantIndex).at(attributeIndex) as FormGroup;
  }

  // Field validation
  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  isVariantFieldInvalid(variantIndex: number, field: string): boolean {
    const variantGroup = this.getVariantFormGroup(variantIndex);
    const control = variantGroup.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  isVariantAttributeInvalid(variantIndex: number, attributeIndex: number): boolean {
    const attributeGroup = this.getAttributeControl(variantIndex, attributeIndex);
    return attributeGroup.invalid && (attributeGroup.dirty || attributeGroup.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.productForm.get(field);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'This field is required';
    } else if (control.hasError('min')) {
      return `Value must be at least ${control.errors?.['min'].min}`;
    } else if (control.hasError('max')) {
      return `Value must be at most ${control.errors?.['max'].max}`;
    }
    return 'Invalid value';
  }

  getVariantAttributeErrorMessage(variantIndex: number, attributeIndex: number): string {
    const attributeGroup = this.getAttributeControl(variantIndex, attributeIndex);
    if (attributeGroup.hasError('required')) {
      return 'This attribute is required';
    }
    return 'Invalid attribute value';
  }

  // Data lookup
  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.categoryId === categoryId);
    return category ? category.name : 'Unknown category';
  }

  getSubcategoryName(subcategoryId: string): string {
    const subcategory = this.subcategories.find(s => s.subcategoryId === subcategoryId);
    return subcategory ? subcategory.name : 'Unknown subcategory';
  }

  getVariantAttributeValue(variantIndex: number, attributeIndex: number, field: string): any {
    const attributeGroup = this.getAttributeControl(variantIndex, attributeIndex);
    return attributeGroup.get(field)?.value;
  }

  getAttributeValue(attributeIndex: number, field: string): any {
    const attributeGroup = this.getAttributeFormGroup(attributeIndex);
    return attributeGroup.get(field)?.value;
  }

  // Utility methods
  markAllAsTouched(): void {
    Object.values(this.productForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.showSidebar = !this.showSidebar;
  }

}
