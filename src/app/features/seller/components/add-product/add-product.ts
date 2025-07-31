  import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
  import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
  import { ProductService } from '../../../../core/services/Product-Service/product';
  import { CommonModule } from '@angular/common';
  import { CategoryService } from '../../../../core/services/Categories/category';
  import { Category } from '../../../../shared/models/category-';
  import { CategoryAttribute } from '../../../../shared/models/category-attribute'; // Ensure this is string | null
  import { JsonParsePipe } from "../../../../shared/pipes/json-parse-pipe"; // We'll use this in the template
  import { CreateProduct, ProductDetails } from '../../../products/product-models';
  import { ActivatedRoute, Router } from '@angular/router';

  import { Subscription } from 'rxjs';

  import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment.development';


  @Component({
    selector: 'app-add-product',
    standalone: true,
    imports: [FormsModule, CommonModule, ReactiveFormsModule, JsonParsePipe], // Keep JsonParsePipe
    templateUrl: './add-product.html',
    styleUrl: './add-product.css'
  })

  export class AddProduct implements OnInit, OnDestroy {


    private cdr = inject(ChangeDetectorRef);
    private categoryService = inject(CategoryService);
    private productService = inject(ProductService);
    public readonly validators = Validators;
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    productForm!: FormGroup;
    categories: Category[] = [];
    displayedCategoryLevels: Category[][] = [[]];
    availableCategoryAttributes: CategoryAttribute[] = []; // This will hold attributes as received (possibleValues: string | null)

    selectedMainImageFile: File | null = null;
    selectedAdditionalImageFiles: File[] = [];
    selectedVariantImageFiles: { index: number, file: File }[] = [];

    productId: number | null = null;
    isEditMode: boolean = false;
    originalProductData: ProductDetails | null = null;
    userInfoCookie!: string | null;
    userInfo!:any;
    userTypeId!:string;
    baseImageUrl = environment.ImageUrlBase
    private variantQuantitySubscription: Subscription | null = null;

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {
      this.initProductForm();
      this.cdr.detectChanges()
      this.loadCategories();

      this.cdr.detectChanges()
      this.userInfoCookie = this.getCookie('UserInfo');

      if (this.userInfoCookie) {
        this.userInfo = JSON.parse(this.userInfoCookie);
        this.userTypeId = this.userInfo.UserTypeId;
        this.cdr.detectChanges();
      }
      this.route.paramMap.subscribe(params => {
        this.productId = Number(params.get('id'));
        this.cdr.detectChanges()
        this.isEditMode = !!this.productId && !isNaN(this.productId);
        this.cdr.detectChanges()

        if (this.isEditMode && this.productId) {
          this.loadProductForEdit(this.productId);
          this.cdr.detectChanges()
        }
      });
      this.variantQuantitySubscription = this.variantsArray.valueChanges.subscribe(() => {
        this.updateProductQuantityBasedOnVariants();
        this.cdr.detectChanges()
        this.manageProductAttributesState();
        this.cdr.detectChanges()
      });
    }

    ngOnDestroy(): void {
      if (this.variantQuantitySubscription) {
        this.variantQuantitySubscription.unsubscribe();
        this.cdr.detectChanges()
      }
    }

    populateForm(product: ProductDetails): void {
      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        productDiscount: (product.variants && product.variants.length > 0) ? 0 : (product.discountPercentage || 0),
      });

    
        this.cdr.detectChanges()
      if (product.mainImageUrl) {
        this.productForm.get('mainImageUrl')?.setValue(product.mainImageUrl);
        this.cdr.detectChanges()
      }
      if (product.additionalImageUrls && product.additionalImageUrls.length > 0) {
        const additionalImagesArray = this.productForm.get('additionalImageUrls') as FormArray;
        additionalImagesArray.clear();
        this.cdr.detectChanges()
        product.additionalImageUrls.forEach(url => {
          additionalImagesArray.push(this.fb.control(url));
          this.cdr.detectChanges()
        });
      }

      this.clearProductAttributes();
      // Delay populating product attributes until availableCategoryAttributes are loaded
      // A simple setTimeout or waiting for fetchCategoryAttributes to complete might be needed
      // For now, let's assume fetchCategoryAttributes will trigger the repopulation via manageProductAttributesState
      // Or you could adjust the loadProductForEdit to chain calls
      if (!product.variants || product.variants.length === 0) {
          // We defer populating attributes until fetchCategoryAttributes completes
          // which will then call manageProductAttributesState.
          // It's crucial that `this.availableCategoryAttributes` is populated first.
          // We will store the actual values from product.attributes here.
          if (product.attributes && product.attributes.length > 0) {
              // Store product's actual attribute values
              product.attributes.forEach(attr => {
                  const categoryAttr = this.availableCategoryAttributes.find(ca => ca.attributeId === attr.attributeId);
                  this.cdr.detectChanges()
                  if (categoryAttr) {
                      const validators = categoryAttr.isRequired ? [Validators.required] : [];
                      this.cdr.detectChanges()
                      this.attributesArray.push(this.fb.group({
                          attributeId: [attr.attributeId],
                          attributeName: [attr.attributeName],
                          attributeType: [categoryAttr.type],
                          // possibleValues should still be the original string from `categoryAttr` for the form control
                          possibleValues: [categoryAttr.possibleValues],
                          // Use product's actual value
                          value: [attr.values && attr.values.length > 0 ? attr.values[0] : '', validators]
                      }));
                  }
              });
          }
      }


      this.clearProductVariants();
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          const variantGroup = this.createVariantFormGroup();
          this.cdr.detectChanges()
          variantGroup.patchValue({
            variantId: variant.variantId,
            variantName: variant.variantName,
            sku: variant.sku,
            price: variant.price,
            discountPercentage: variant.discountPercentage,
            stockQuantity: variant.stockQuantity,
            variantImageUrl: variant.variantImageUrl,
            isDefault: variant.isDefault,
            isAvailable: variant.isAvailable
          });

          if (variant.attributes && variant.attributes.length > 0) {
            const variantAttributesArray = variantGroup.get('attributes') as FormArray;
            this.cdr.detectChanges()
            variant.attributes.forEach(vAttr => {
              variantAttributesArray.push(this.fb.group({
                attributeId: [vAttr.attributeId, this.validators.required],
                 attributeName: [vAttr.attributeName, this.validators.required],
                attributeValue: [vAttr.attributeValue, this.validators.required]
              }));
            });
          }
          this.variantsArray.push(variantGroup);
        });
      }

      this.updateProductQuantityBasedOnVariants();
      this.manageProductAttributesState();
      this.cdr.detectChanges();
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


    loadProductForEdit(productId: number): void {
      this.productService.getProductDetails(productId).subscribe({
        next: (product: ProductDetails) => {
          this.originalProductData = product;
          this.cdr.detectChanges()
          this.populateForm(product);
          
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading product for edit:', err);
          this.router.navigate(['/seller/products']);
        }
      });
    }

    initProductForm(): void {
      this.productForm = this.fb.group({
        categoryIds: this.fb.array([this.fb.control('', Validators.required)]),
        name: ['', Validators.required],
        description: ['', Validators.required],
        basePrice: [0, [Validators.required, Validators.min(0)]],
        productDiscount: [0, [Validators.min(0), Validators.max(100)]],
        quantity: [0, [Validators.required, Validators.min(0)]],
        mainImageUrl: [null],
        additionalImageUrls: this.fb.array([]),
        attributes: this.fb.array([]),
        variants: this.fb.array([])
      });

      this.productForm.get('quantity')?.enable();
    }

    loadCategories(): void {
      this.categoryService.getAllCategories(true).subscribe(
        {
          next: (data) => {
            this.categories = data;
            this.displayedCategoryLevels[0] = this.categories;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading categories:', err);
          }
        }
      );
    }

    get categoryIdsArray(): FormArray {
      return this.productForm.get('categoryIds') as FormArray;
    }

    addCategoryControl(): void {
      this.categoryIdsArray.push(this.fb.control('', Validators.required));
    }

    onCategorySelect(levelIndex: number): void {
      const selectedCategoryId = Number(this.categoryIdsArray.at(levelIndex).value);

      let selectedCategory: Category | undefined;

      if (levelIndex === 0) {
        selectedCategory = this.categories.find(c => c.id === selectedCategoryId);
      } else {
        const parentCategoryId = Number(this.categoryIdsArray.at(levelIndex - 1).value);
        const parentCategory = this.findCategoryInTree(this.categories, parentCategoryId);
        selectedCategory = parentCategory?.subCategories.find(c => c.id === selectedCategoryId);
      }

      this.displayedCategoryLevels.splice(levelIndex + 1);
      while (this.categoryIdsArray.length > levelIndex + 1) {
        this.categoryIdsArray.removeAt(this.categoryIdsArray.length - 1);
      }

      if (selectedCategory && selectedCategory.subCategories && selectedCategory.subCategories.length > 0) {
        this.displayedCategoryLevels.push(selectedCategory.subCategories);
        this.addCategoryControl();
        this.clearProductAttributes(); // Clear attributes when selecting a new, deeper category
      } else {
        // If no more subcategories, fetch attributes for the selected category
        this.fetchCategoryAttributes(selectedCategoryId);
      }

      this.cdr.detectChanges();
    }

    private findCategoryInTree(categories: Category[], categoryId: number): Category | undefined {
      for (const category of categories) {
        if (category.id === categoryId) {
          return category;
        }
        if (category.subCategories && category.subCategories.length > 0) {
          const found = this.findCategoryInTree(category.subCategories, categoryId);
          if (found) {
            return found;
          }
        }
      }
      return undefined;
    }

    manageProductDiscountState(): void {
      const productDiscountControl = this.productForm.get('productDiscount');
      if (productDiscountControl) {
        if (this.variantsArray.length > 0) {
          productDiscountControl.disable();
          productDiscountControl.setValue(0); // Set to 0 if variants are present
        } else {
          productDiscountControl.enable();
          // If in edit mode and product had no variants, re-apply its discount
          if (this.isEditMode && this.originalProductData && (!this.originalProductData.variants || this.originalProductData.variants.length === 0)) {
            productDiscountControl.setValue(this.originalProductData.discountPercentage || 0);
          }
        }
        productDiscountControl.updateValueAndValidity(); // Crucial for validation to re-evaluate
        this.cdr.detectChanges();
      }
    }

    onFileSelect(event: Event, controlName: 'mainImageUrl' | 'variantImageUrl', variantIndex?: number): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];


        if (controlName === 'mainImageUrl') {
          this.selectedMainImageFile = file;
          const reader = new FileReader();
          reader.onload = () => {
            this.productForm.get('mainImageUrl')?.setValue(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else if (controlName === 'variantImageUrl' && variantIndex !== undefined) {
          const existingIndex = this.selectedVariantImageFiles.findIndex(f => f.index === variantIndex);
          if (existingIndex > -1) {
            this.selectedVariantImageFiles[existingIndex].file = file;
            this.cdr.detectChanges()
          } else {
            this.selectedVariantImageFiles.push({ index: variantIndex, file: file });
            this.cdr.detectChanges()
          }
          const reader = new FileReader();
          reader.onload = () => {
            (this.variantsArray.at(variantIndex) as FormGroup).get('variantImageUrl')?.setValue(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      } else {
        if (controlName === 'mainImageUrl') {
          this.selectedMainImageFile = null;
          this.productForm.get('mainImageUrl')?.setValue(null);
        } else if (controlName === 'variantImageUrl' && variantIndex !== undefined) {
          this.selectedVariantImageFiles = this.selectedVariantImageFiles.filter(f => f.index !== variantIndex);
          (this.variantsArray.at(variantIndex) as FormGroup).get('variantImageUrl')?.setValue(null);
        }
      }
      this.cdr.detectChanges();
    }

    onMultipleFileSelect(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedAdditionalImageFiles = Array.from(input.files);
        const additionalImagesArray = this.productForm.get('additionalImageUrls') as FormArray;
        while (additionalImagesArray.length !== 0) {
          additionalImagesArray.removeAt(0);
        }
        this.selectedAdditionalImageFiles.forEach(file => {
          const reader = new FileReader();
          reader.onload = () => {
            additionalImagesArray.push(this.fb.control(reader.result as string));
          };
          reader.readAsDataURL(file);
        });
      } else {
        this.selectedAdditionalImageFiles = [];
        (this.productForm.get('additionalImageUrls') as FormArray).clear();
      }
      this.cdr.detectChanges();
    }

    // --- Methods for Product Attributes (Non-Variant Specific) ---

    clearProductAttributes(): void {
      while (this.attributesArray.length !== 0) {
        this.attributesArray.removeAt(0);
      }
      this.availableCategoryAttributes = []; // Clear this when attributes are cleared
      this.cdr.detectChanges();
    }

    fetchCategoryAttributes(categoryId: number): void {
      this.clearProductAttributes(); // Clear existing attributes first
      this.categoryService.getAttributes(categoryId).subscribe({
        next: (attributes) => {

          // Store attributes as they are received (possibleValues is string | null)
          this.availableCategoryAttributes = attributes;

          // Populate product attributes only if no variants exist
          if (this.variantsArray.length === 0) {
            this.availableCategoryAttributes.forEach(attr => {
              let initialValue: any = '';
              if (attr.type === 'number') {
                initialValue = 0;
              } else if (attr.type === 'boolean') {
                  initialValue = false;
              }
              const validators = attr.isRequired ? [Validators.required] : [];
              this.attributesArray.push(this.fb.group({
                attributeId: [attr.attributeId],
                attributeName: [attr.name],
                attributeType: [attr.type],
                possibleValues: [attr.possibleValues], // Store the string here
                value: [initialValue, validators]
              }));
            });
          }
          this.manageProductAttributesState();
          this.cdr.detectChanges();


        },
        error: (err) => {
          console.error(`Error fetching attributes for category ${categoryId}:`, err);
        }
      });
    }

    get attributesArray(): FormArray {
      return this.productForm.get('attributes') as FormArray;
    }

    manageProductAttributesState(): void {
      const attributesControl = this.productForm.get('attributes') as FormArray;
      if (this.variantsArray.length > 0) {
        attributesControl.disable();
        while (attributesControl.length !== 0) {
          attributesControl.removeAt(0);
        }
      } else {
        attributesControl.enable();
        const lastCategoryId = this.categoryIdsArray.at(this.categoryIdsArray.length - 1)?.value;
        // Repopulate only if category selected, attributes are empty, AND we have available category attributes
        // This is crucial for when the user removes all variants and then product attributes should reappear.
        if (lastCategoryId && this.attributesArray.length === 0 && this.availableCategoryAttributes.length > 0) {
            this.availableCategoryAttributes.forEach(attr => {
              let initialValue: any = '';
              if (attr.type === 'number') {
                initialValue = 0;
              } else if (attr.type === 'boolean') {
                  initialValue = false;
              }
              const validators = attr.isRequired ? [Validators.required] : [];
              this.attributesArray.push(this.fb.group({
                attributeId: [attr.attributeId],
                attributeName: [attr.name],
                attributeType: [attr.type],
                possibleValues: [attr.possibleValues], // Store the string here
                value: [initialValue, validators]
              }));
            });
        }
      }
      this.cdr.detectChanges();
    }


    ///////////////////////Variants//////////////////

    get variantsArray(): FormArray {
      return this.productForm.get('variants') as FormArray;
    }

    clearProductVariants(): void {
      while (this.variantsArray.length !== 0) {
        this.variantsArray.removeAt(0);
      }
      this.cdr.detectChanges();
      this.manageProductAttributesState(); // Re-evaluate product attribute display
      this.updateProductQuantityBasedOnVariants();
      this.manageProductDiscountState();
    }

    createVariantFormGroup(): FormGroup {
      const variantGroup = this.fb.group({
        variantId: [0],
        variantName: ['', this.validators.required],
        sku: ['', this.validators.required],
        price: [0, [this.validators.required, this.validators.min(0)]],
        discountPercentage: [0, [this.validators.min(0), this.validators.max(100)]],
        stockQuantity: [0, [this.validators.required, this.validators.min(0)]],
        variantImageUrl: [''],
        isDefault: [false],
        isAvailable: [true],
        attributes: this.fb.array([])
      });

      variantGroup.get('stockQuantity')?.valueChanges.subscribe(() => {
        this.updateProductQuantityBasedOnVariants();
      });

      return variantGroup;
    }

    addVariant(): void {
      this.variantsArray.push(this.createVariantFormGroup());
      this.manageProductAttributesState(); // Hide product attributes
      this.updateProductQuantityBasedOnVariants();
      this.manageProductDiscountState();
      this.cdr.detectChanges();
    }

    removeVariant(index: number): void {
      this.variantsArray.removeAt(index);
      this.selectedVariantImageFiles = this.selectedVariantImageFiles.filter(f => f.index !== index);
      this.manageProductAttributesState(); // Potentially show product attributes again
      this.updateProductQuantityBasedOnVariants();
      this.manageProductDiscountState();
      this.cdr.detectChanges();
    }

    getVariantAttributesArray(variantIndex: number): FormArray {
      const variantGroup = this.variantsArray.at(variantIndex) as FormGroup;
      return variantGroup.get('attributes') as FormArray;
    }

    createVariantAttributeFormGroup(): FormGroup {
      return this.fb.group({
        attributeId: ['', this.validators.required],
        attributeName: ['', this.validators.required],
        attributeValue: ['', this.validators.required]
      });
    }

    addVariantAttribute(variantIndex: number): void {
      this.getVariantAttributesArray(variantIndex).push(this.createVariantAttributeFormGroup());
      this.cdr.detectChanges();
    }

    removeVariantAttribute(variantIndex: number, attributeIndex: number): void {
      this.getVariantAttributesArray(variantIndex).removeAt(attributeIndex);
      this.cdr.detectChanges();
    }

    onVariantAttributeChange(variantIndex: number, attributeIndex: number): void {
      const variantAttributeGroup = this.getVariantAttributesArray(variantIndex).at(attributeIndex) as FormGroup;
      const selectedAttributeId = Number(variantAttributeGroup.get('attributeId')?.value);

      // Find the attribute in availableCategoryAttributes (which now holds string | null for possibleValues)
      const selectedAttribute = this.availableCategoryAttributes.find(attr => attr.attributeId === selectedAttributeId);

      if (selectedAttribute) {
        variantAttributeGroup.get('attributeName')?.setValue(selectedAttribute.name);
      } else {
        variantAttributeGroup.get('attributeName')?.setValue('');
      }
      this.cdr.detectChanges();
    }

    updateProductQuantityBasedOnVariants(): void {
      const quantityControl = this.productForm.get('quantity');
      if (this.variantsArray.length > 0) {
        const totalQuantity = this.variantsArray.controls.reduce((sum, variantGroup) => {
          const stockQuantityControl = variantGroup.get('stockQuantity');
          return sum + (stockQuantityControl && typeof stockQuantityControl.value === 'number' ? stockQuantityControl.value : 0);
        }, 0);
        quantityControl?.setValue(totalQuantity);
        quantityControl?.disable();
      } else {
        quantityControl?.enable();
        if (!this.isEditMode) {
            quantityControl?.setValue(0);
        } else if (this.isEditMode && this.originalProductData && (!this.originalProductData.variants || this.originalProductData.variants.length === 0)) {
            quantityControl?.setValue(this.originalProductData.stockQuantity);
        } else {
            quantityControl?.setValue(0);
        }
      }
      this.cdr.detectChanges();
    }


    onSubmit(): void {
      const quantityControl = this.productForm.get('quantity');
      if (this.variantsArray.length === 0) {
          quantityControl?.enable(); // Temporarily enable to get value for submission
      }

      if (this.productForm.valid) {
        const selectedCategoryIds = this.productForm.value.categoryIds;
        const finalCategoryId = selectedCategoryIds[selectedCategoryIds.length - 1];

        const formData = new FormData();
        console.log(this.userTypeId)
        formData.append('SellerId',this.userTypeId.toString());
        formData.append('CategoryId', finalCategoryId.toString());
        formData.append('Name', this.productForm.value.name);
        formData.append('Description', this.productForm.value.description);
        formData.append('BasePrice', this.productForm.value.basePrice.toString());
        if (this.variantsArray.length === 0) {
        // Only append if there are no variants
        formData.append('discountPercentage', this.productForm.get('productDiscount')?.value || 0);
      } else {
        // If variants exist, ensure ProductDiscount is explicitly 0 for the main product
        formData.append('discountPercentage', '0');
      }
        formData.append('StockQuantity', this.productForm.get('quantity')?.value.toString()); // Use get().value for disabled controls

        if (this.isEditMode && this.productId) {
          formData.append('ProductId', this.productId.toString());
        }

        if (this.selectedMainImageFile) {
          formData.append('MainImageUrl', this.selectedMainImageFile, this.selectedMainImageFile.name);
        }

        if (this.selectedAdditionalImageFiles && this.selectedAdditionalImageFiles.length > 0) {
          this.selectedAdditionalImageFiles.forEach((file: File, index: number) => {
            formData.append(`AdditionalImageUrls`, file, file.name);
          });
        }

        // Product Attributes (ONLY if no variants)
        if (this.variantsArray.length === 0 && this.attributesArray.length > 0) {
            this.attributesArray.controls.forEach((attrGroup: AbstractControl, attrIndex: number) => {
                const productAttrValue = attrGroup.value;
                formData.append(`Attributes[${attrIndex}].AttributeId`, productAttrValue.attributeId.toString());
                if (productAttrValue.attributeName) {
                    formData.append(`Attributes[${attrIndex}].AttributeName`, productAttrValue.attributeName);
                }
          
                let valuesToAppend: string[] = [];
                if (productAttrValue.value !== null && productAttrValue.value !== undefined) {
                    // Ensure it's converted to a string for FormData
                    valuesToAppend.push(String(productAttrValue.value));
                }

                valuesToAppend.forEach((val: string, valIndex: number) => {
                    formData.append(`Attributes[${attrIndex}].Values[${valIndex}]`, val);
                });
            });
        }

        // Product Variants (ONLY if variants exist)
        if (this.variantsArray.length > 0) {
          this.variantsArray.controls.forEach((variantGroup: AbstractControl, variantIndex: number) => {
            const variantFormValue = variantGroup.value;
            const variantImageFileEntry = this.selectedVariantImageFiles.find(f => f.index === variantIndex);
            const variantImageFile = variantImageFileEntry ? variantImageFileEntry.file : null;

            const isDefaultValue = variantFormValue.isDefault === true;
            const isAvailableValue = variantFormValue.isAvailable === true;

            formData.append(`Variants[${variantIndex}].VariantId`, (variantFormValue.variantId || 0).toString());
            formData.append(`Variants[${variantIndex}].VariantName`, variantFormValue.variantName);
            formData.append(`Variants[${variantIndex}].SKU`, variantFormValue.sku);
            formData.append(`Variants[${variantIndex}].Price`, variantFormValue.price.toString());

            if (variantFormValue.discountPercentage !== null && variantFormValue.discountPercentage !== undefined) {
              formData.append(`Variants[${variantIndex}].DiscountPercentage`, variantFormValue.discountPercentage.toString());
            }

            formData.append(`Variants[${variantIndex}].StockQuantity`, variantFormValue.stockQuantity.toString());
            formData.append(`Variants[${variantIndex}].IsDefault`, isDefaultValue.toString());
            formData.append(`Variants[${variantIndex}].IsAvailable`, isAvailableValue.toString());

            const variantAttributes = variantFormValue.attributes;
            variantAttributes.forEach((vAttr: any, attrSubIndex: number) => {
              formData.append(`Variants[${variantIndex}].Attributes[${attrSubIndex}].AttributeId`, vAttr.attributeId.toString());
              
                formData.append(`Variants[${variantIndex}].Attributes[${attrSubIndex}].AttributeName`, vAttr.attributeName);
            
              if (vAttr.attributeValue !== null && vAttr.attributeValue !== undefined && vAttr.attributeValue !== '') {
                formData.append(`Variants[${variantIndex}].Attributes[${attrSubIndex}].AttributeValue`, vAttr.attributeValue);
              }
            });

            if (variantImageFile) {
              formData.append(`Variants[${variantIndex}].VariantImageUrl`, variantImageFile, variantImageFile.name);
            }
          });
        }

        console.log('Constructed FormData:');
        formData.forEach((value, key) => {
          if (value instanceof File) {
            console.log(`${key}: File Name: ${value.name}, Type: ${value.type}, Size: ${value.size} bytes`);
          } else {
            console.log(`${key}:`, value);
          }
        });

        if (this.isEditMode && this.productId) {
          this.productService.updateProduct(formData).subscribe({
            next: () => {
              console.log('Product updated successfully!');
              this.router.navigate(['/seller/products']);
            },
            error: (err) => {
              console.error('Error updating product:', err);
              if (err.error) {
                  console.error('Backend validation errors:', err.error);
              }
            }
          });
        } else {
          this.productService.AddProduct(formData).subscribe({
            next: () => {
              console.log('Product added successfully!');
              this.productForm.reset();
              this.clearProductAttributes();
              this.clearProductVariants();
              this.categoryIdsArray.clear();
              this.categoryIdsArray.push(this.fb.control('', this.validators.required));
              this.displayedCategoryLevels = [this.categories];
              this.selectedMainImageFile = null;
              this.selectedAdditionalImageFiles = [];
              this.selectedVariantImageFiles = [];
              this.cdr.detectChanges();
              this.router.navigate(['/seller/products']);
            },
            error: (err) => {
              console.error('Error adding product:', err);
              if (err.error) {
                  console.error('Backend validation errors:', err.error);
              }
            }
          });
        }
      } else {
        console.log('Form is invalid. Please check the fields.');
        this.markAllAsTouched(this.productForm);
        this.cdr.detectChanges();
      }
      // Re-disable quantity if variants exist after submission attempt
      if (this.variantsArray.length > 0) {
          quantityControl?.disable();
      }
    }

    private markAllAsTouched(formGroup: FormGroup | FormArray): void {
      Object.values(formGroup.controls).forEach(control => {
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.markAllAsTouched(control);
        } else {
          control.markAsTouched();
        }
      });
    }

    cancel(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'All changes will be lost!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/seller/products']);
      }

    });
  }
  }

    