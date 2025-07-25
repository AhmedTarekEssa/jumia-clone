import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../core/services/Categories/category';
import { Category } from '../../../../shared/models/category-';
import { CategoryAttribute } from '../../../../shared/models/category-attribute';
import { JsonParsePipe } from "../../../../shared/pipes/json-parse-pipe";
import { CreateProduct, ProductDetails } from '../../../products/product-models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, JsonParsePipe],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct implements OnInit{
  
///services////
  private cdr = inject(ChangeDetectorRef);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  public readonly validators = Validators;
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Inject ActivatedRoute

  productForm!: FormGroup;
  categories: Category[] = [];
  displayedCategoryLevels: Category[][] = [[]];
  availableCategoryAttributes: CategoryAttribute[] = [];

  selectedMainImageFile: File | null = null;
  selectedAdditionalImageFiles: File[] = [];
  selectedVariantImageFiles: { index: number, file: File }[] = [];

  // New properties for edit mode
  productId: number | null = null; // To store the product ID if in edit mode
  isEditMode: boolean = false;
  originalProductData: ProductDetails | null = null; // To store the fetched product data

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initProductForm();
    this.loadCategories();
    
    this.route.paramMap.subscribe(params => {
      this.productId = Number( params.get('id'));
      this.isEditMode = !!this.productId; // Set isEditMode based on presence of ID

      if (this.isEditMode && this.productId) {
        this.loadProductForEdit(this.productId);
      }
    });
  
  }



populateForm(product: ProductDetails): void {
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      // mainImageUrl: product.mainImageUrl // Will be handled by showing image, not setting file input value
    });

    // Populate Category IDs (potentially complex due to nested categories)
    // You'll need to re-select categories from lowest to highest level
    // This part depends heavily on how your 'product' object stores category relations.
    // Assuming product.category.id gives the final category ID
    if (product.categoryId) {
        // You might need a helper function to recursively find the full path of category IDs
        // For simplicity, let's assume you only need to set the final category ID for now.
        // If your productDto has a list of categoryIds (like productForm.value.categoryIds),
        // you'd set that directly. Otherwise, you need to derive the path.
        // Example: If product.categoryId is the deepest, you might need to rebuild categoryIdsArray
        // this.categoryService.getCategoryPath(product.categoryId).subscribe({
        //     next: (path: Category[]) => { // Assuming an API that returns category path from root to leaf
        //         this.categoryIdsArray.clear();
        //         this.displayedCategoryLevels = [this.categories]; // Reset display levels

        //         path.forEach((catInPath, index) => {
        //             const control = this.fb.control(catInPath.id, Validators.required);
        //             this.categoryIdsArray.push(control);

        //             if (catInPath.subCategories && catInPath.subCategories.length > 0) {
        //                 this.displayedCategoryLevels.push(catInPath.subCategories);
        //             }
        //             // Trigger onCategorySelect logic for this level to load next subcategories
        //             // This is tricky: Directly calling onCategorySelect might be circular
        //             // A better way is to rebuild the displayedCategoryLevels manually as you populate
        //         });
                // After populating path, fetch attributes for the final category
                this.categoryService.getAttributes(product.categoryId);
                this.cdr.detectChanges();
            // },
            // error: (err) => console.error('Error getting category path:', err)
        // });
    }

    // Clear existing product attributes and then populate
    this.clearProductAttributes(); // This clears `attributesArray` and `availableCategoryAttributes`
    if (product.attributes && product.attributes.length > 0) {
        // You'll need to fetch `availableCategoryAttributes` *first* based on product.categoryId
        // before populating `product.attributes` into the form.
        // For product attributes, you're mapping fetched attributes.
        // Make sure `availableCategoryAttributes` is loaded before this runs.
        // This usually happens after category selection.

        // If fetchCategoryAttributes is called above, `this.availableCategoryAttributes`
        // should be populated.
        product.attributes.forEach(attr => {
            const categoryAttr = this.availableCategoryAttributes.find(ca => ca.attributeId === attr.attributeId);
            if (categoryAttr) {
                const validators = categoryAttr.isRequired ? [Validators.required] : [];
                this.attributesArray.push(this.fb.group({
                    attributeId: [attr.attributeId],
                    attributeName: [attr.attributeName], // Or categoryAttr.name
                    attributeType: [categoryAttr.type],
                    possibleValues: [categoryAttr.possibleValues],
                    value: [attr.values && attr.values.length > 0 ? (categoryAttr.type === 'select' ? attr.values : attr.values[0]) : '', validators]
                }));
            }
        });
    }

    // Clear existing variants and then populate
    this.clearProductVariants(); // This clears `variantsArray`
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant, index) => {
        const variantGroup = this.createVariantFormGroup(); // Get a new, empty variant form group
        variantGroup.patchValue({
          variantName: variant.variantName,
          sku: variant.sku,
          price: variant.price,
          discountPercentage: variant.discountPercentage,
          stockQuantity: variant.stockQuantity,
          variantImageUrl: variant.variantImageUrl, // This is the URL string
          isDefault: variant.isDefault,
          isAvailable: variant.isAvailable
        });

        // Populate variant attributes
        if (variant.attributes && variant.attributes.length > 0) {
          const variantAttributesArray = variantGroup.get('attributes') as FormArray;
          variant.attributes.forEach(vAttr => {
            variantAttributesArray.push(this.fb.group({
              attributeId: [vAttr.attributeId, this.validators.required],
              attributeName: [{ value: vAttr.attributeName, disabled: true }, this.validators.required],
              attributeValue: [vAttr.attributeValue, this.validators.required]
            }));
          });
        }
        this.variantsArray.push(variantGroup); // Add the populated variant group to the form array
      });
    }

    this.cdr.detectChanges(); // Ensure view updates
  }




loadProductForEdit(productId: number): void {
    this.productService.getProductDetails(productId).subscribe({ // Assuming getProductById method exists
      next: (product: ProductDetails) => {
        this.originalProductData = product; // Store original data
        this.populateForm(product); // Populate the form with fetched data
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading product for edit:', err);
        // Handle error, e.g., redirect to product list or show message
        this.router.navigate(['/seller/products']);
      }
    });
  }






  // Initializes the reactive form, specifically setting up the categoryIds FormArray.
  initProductForm(): void {
    this.productForm = this.fb.group({
      // You might have other form controls here for product details
      // For this example, we only include categoryIds
      categoryIds: this.fb.array([this.fb.control('', Validators.required)]), // Start with one category dropdown
      name: ['', Validators.required],
      description: ['', Validators.required],
      basePrice: [0, [Validators.required, Validators.min(0)]],
      mainImageUrl: [null],
      additionalImageUrls: this.fb.array([]),
      attributes: this.fb.array([]),
       variants: this.fb.array([])
    });
  }

  // Fetches categories from the API and sets up the first level of dropdowns.
  loadCategories(): void {
    this.categoryService.getAllCategories(true).subscribe(
      {
        next: (data) => {
          console.log('API Response for Categories:', data); // Log the API response to inspect its structure
          this.categories = data;
          this.displayedCategoryLevels[0] = this.categories;
          this.cdr.detectChanges(); // Ensure view updates after categories are loaded
        },
        error: (err) => {
          console.error('Error loading categories:', err);
          // Handle error (e.g., show a message to the user)
        }
      }
    );
  }

  // Getter to easily access the 'categoryIds' FormArray from the productForm.
  get categoryIdsArray(): FormArray {
    return this.productForm.get('categoryIds') as FormArray;
  }

  // Adds a new FormControl to the categoryIds FormArray, preparing for another category dropdown.
  addCategoryControl(): void {
    this.categoryIdsArray.push(this.fb.control('', Validators.required));
  }

  // Handles the selection of a category in any of the dropdowns.
  // It dynamically adds or removes subsequent dropdowns based on subcategories.
 onCategorySelect(levelIndex: number): void {
    // Explicitly convert the selected value to a number
    const selectedCategoryId = Number(this.categoryIdsArray.at(levelIndex).value);
    console.log(`Selected ID at level ${levelIndex}:`, selectedCategoryId, `(Type: ${typeof selectedCategoryId})`);

    let selectedCategory: Category | undefined;

    // Determine the source of categories for the current level.
    // If it's the first level, use the top-level 'categories' array.
    // Otherwise, find the parent category to get its subcategories.
    if (levelIndex === 0) {
      selectedCategory = this.categories.find(c => c.id === selectedCategoryId);
    } else {
      // Also convert parentCategoryId to a number
      const parentCategoryId = Number(this.categoryIdsArray.at(levelIndex - 1).value);
      const parentCategory = this.findCategoryInTree(this.categories, parentCategoryId);
      selectedCategory = parentCategory?.subCategories.find(c => c.id === selectedCategoryId);
    }

    console.log('Found selected category:', selectedCategory);

    // Clear any subsequent category dropdowns and their corresponding form controls.
    // This is crucial when a selection in an upper level is changed.
    this.displayedCategoryLevels.splice(levelIndex + 1);
    while (this.categoryIdsArray.length > levelIndex + 1) {
      this.categoryIdsArray.removeAt(this.categoryIdsArray.length - 1);
    }

    // If the selected category has subcategories, add a new dropdown level.
    if (selectedCategory && selectedCategory.subCategories && selectedCategory.subCategories.length > 0) {
      this.displayedCategoryLevels.push(selectedCategory.subCategories);
      this.addCategoryControl();
      console.log('Added new level. displayedCategoryLevels:', this.displayedCategoryLevels);
    } else {
      console.log('No subcategories found for selected category, or selected category is null/undefined.');
      this.fetchCategoryAttributes(selectedCategoryId);
    }

    // Manually trigger change detection to update the view
    this.cdr.detectChanges();
  }

  // Recursive helper function to find a category by its ID within the nested structure.
   private findCategoryInTree(categories: Category[], categoryId: number): Category | undefined {
    // The categoryId parameter is already a number due to the Number() conversion in onCategorySelect
    for (const category of categories) {
      if (category.id === categoryId) { // Now safe to use strict equality '==='
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
  




   onFileSelect(event: Event, controlName: 'mainImageUrl' | 'variantImageUrl', variantIndex?: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  

      if (controlName === 'mainImageUrl') {
        this.selectedMainImageFile = file;
        this.cdr.detectChanges()
        // Optionally, if you want a preview:
        const reader = new FileReader();
        reader.onload = () => {
          this.productForm.get('mainImageUrl')?.setValue(reader.result as string);
          this.cdr.detectChanges()
        };
        reader.readAsDataURL(file);
      } else if (controlName === 'variantImageUrl' && variantIndex !== undefined) {
        // Store the file and its associated variant index
        const existingIndex = this.selectedVariantImageFiles.findIndex(f => f.index === variantIndex);
        if (existingIndex > -1) {
          this.selectedVariantImageFiles[existingIndex].file = file;
          this.cdr.detectChanges()
        } else {
          this.selectedVariantImageFiles.push({ index: variantIndex, file: file });
          this.cdr.detectChanges()
        }
        // Optionally, for preview:
        const reader = new FileReader();
        reader.onload = () => {
          (this.variantsArray.at(variantIndex) as FormGroup).get('variantImageUrl')?.setValue(reader.result as string);
          this.cdr.detectChanges()
        };
        reader.readAsDataURL(file);
        this.cdr.detectChanges()
      }
    } else {
      // If file selection is cleared
      if (controlName === 'mainImageUrl') {
        this.selectedMainImageFile = null;
        this.cdr.detectChanges()
        this.productForm.get('mainImageUrl')?.setValue('');
        this.cdr.detectChanges()
      } else if (controlName === 'variantImageUrl' && variantIndex !== undefined) {
        this.selectedVariantImageFiles = this.selectedVariantImageFiles.filter(f => f.index !== variantIndex);
        (this.variantsArray.at(variantIndex) as FormGroup).get('variantImageUrl')?.setValue('');
        this.cdr.detectChanges()
      }
    }
  }

  // onMultipleFileSelect now stores File objects
  onMultipleFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAdditionalImageFiles = Array.from(input.files); // Store all selected files
      this.cdr.detectChanges()
      const additionalImagesArray = this.productForm.get('additionalImageUrls') as FormArray;
      this.cdr.detectChanges()
      // Optionally, clear existing previews and generate new ones
      while (additionalImagesArray.length !== 0) {
        additionalImagesArray.removeAt(0);
        this.cdr.detectChanges()
      }
      this.selectedAdditionalImageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          additionalImagesArray.push(this.fb.control(reader.result as string)); // For preview only
          this.cdr.detectChanges()
        };
        reader.readAsDataURL(file);
        this.cdr.detectChanges()
      });
    } else {
      this.selectedAdditionalImageFiles = [];
      (this.productForm.get('additionalImageUrls') as FormArray).clear();
      this.cdr.detectChanges();
    }
  }



// --- New Methods for Attributes ---

  // Clears all existing product attributes from the form array
  clearProductAttributes(): void {
    while (this.attributesArray.length !== 0) {
      this.attributesArray.removeAt(0);
    }
    this.availableCategoryAttributes = []; // Also clear the available list
    this.cdr.detectChanges(); // Ensure UI reflects removal
  }


fetchCategoryAttributes(categoryId: number): void {
    this.clearProductAttributes(); // Clear previous attributes before loading new ones

    this.categoryService.getAttributes(categoryId).subscribe({
      next: (attributes) => {
        console.log(`Attributes fetched for category ${categoryId}:`, attributes);
        this.availableCategoryAttributes = attributes; // Store for options in HTML (if needed)

        // Add each fetched attribute to the productForm.attributes FormArray
        attributes.forEach(attr => {
          // Determine initial value based on attribute type or if it's required
          let initialValue: any = ''; 
          if (attr.type === 'number') {
            initialValue = 0; // Default number value
          } else if (attr.type === 'select') {
            // No default value needed for select, it will be the empty option
          }

          // Add validators based on isRequired
          const validators = attr.isRequired ? [Validators.required] : [];

          // Add a new FormGroup for each attribute
          this.attributesArray.push(this.fb.group({
            attributeId: [attr.attributeId],
            attributeName: [attr.name], // Display name, not editable
            attributeType: [attr.type], // Store type for conditional rendering
            possibleValues: [attr.possibleValues], // Store JSON string of possible values
            value: [initialValue, validators] // The actual value entered by the user
          }));
        });
        this.cdr.detectChanges(); // Update view after adding attributes
      },
      error: (err) => {
        console.error(`Error fetching attributes for category ${categoryId}:`, err);
        // Handle error (e.g., show a message)
      }
    });
  }

get attributesArray(): FormArray {
    return this.productForm.get('attributes') as FormArray;
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
  }

createVariantFormGroup(): FormGroup {
    return this.fb.group({
      variantName: ['', this.validators.required],
      sku: ['', this.validators.required],
      price: ['', [this.validators.required, this.validators.min(0)]],
      discountPercentage: [0, [this.validators.min(0), this.validators.max(100)]],
      stockQuantity: [0, [this.validators.required, this.validators.min(0)]],
      variantImageUrl: [''], // Will store the URL after file upload
      isDefault: [false],
      isAvailable: [true],
      attributes: this.fb.array([]) // Each variant has its own attribute FormArray
    });
  }


addVariant(): void {
    this.variantsArray.push(this.createVariantFormGroup());
    this.cdr.detectChanges();
  }

  // Removes a variant from the form
  removeVariant(index: number): void {
    this.variantsArray.removeAt(index);
    this.cdr.detectChanges();
  }

  // Gets the attributes FormArray for a specific variant
  getVariantAttributesArray(variantIndex: number): FormArray {
    const variantGroup = this.variantsArray.at(variantIndex) as FormGroup;
    return variantGroup.get('attributes') as FormArray;
  }

  // Creates a FormGroup for a single variant attribute
  createVariantAttributeFormGroup(): FormGroup {
    return this.fb.group({
      attributeId: ['', this.validators.required],
      attributeName: [{ value: '', disabled: true }, this.validators.required], // Name derived from ID
      attributeValue: ['', this.validators.required] // The single value for this attribute
    });
  }

  // Adds a new attribute to a specific variant
  addVariantAttribute(variantIndex: number): void {
    this.getVariantAttributesArray(variantIndex).push(this.createVariantAttributeFormGroup());
    this.cdr.detectChanges();
  }

  // Removes an attribute from a specific variant
  removeVariantAttribute(variantIndex: number, attributeIndex: number): void {
    this.getVariantAttributesArray(variantIndex).removeAt(attributeIndex);
    this.cdr.detectChanges();
  }

  // Handles the change event for a variant attribute selection (attributeId)
  onVariantAttributeChange(variantIndex: number, attributeIndex: number): void {
    const variantAttributeGroup = this.getVariantAttributesArray(variantIndex).at(attributeIndex) as FormGroup;
    const selectedAttributeId = Number(variantAttributeGroup.get('attributeId')?.value);

    // Find the attribute name from your general `availableAttributes` list
    const selectedAttribute = this.availableCategoryAttributes.find(attr => attr.attributeId === selectedAttributeId);

    if (selectedAttribute) {
      variantAttributeGroup.get('attributeName')?.setValue(selectedAttribute.name);
      // You might want to clear `attributeValue` or set a default based on `selectedAttribute.type` here
      // if `availableAttributes` contained type info. For now, it's just 'name'.
    } else {
      variantAttributeGroup.get('attributeName')?.setValue('');
    }
    this.cdr.detectChanges();
  }

  // Submits the form, logging the selected category IDs.
  onSubmit(): void {
    if (this.productForm.valid) {
      const selectedCategoryIds = this.productForm.value.categoryIds;
      const finalCategoryId = selectedCategoryIds[selectedCategoryIds.length - 1];

      const formData = new FormData();

      // ... (existing formData appends for basic product details) ...
      formData.append('sellerId', '1');
      formData.append('categoryId', finalCategoryId.toString());
      formData.append('name', this.productForm.value.name);
      formData.append('description', this.productForm.value.description);
      formData.append('basePrice', this.productForm.value.basePrice.toString());
  if (this.isEditMode && this.productId) {
        formData.append('productId', this.productId.toString()); // Append the product ID to formData
      }
      // Main Image
      if (this.selectedMainImageFile) {
        formData.append('mainImageUrl', this.selectedMainImageFile, this.selectedMainImageFile.name);
      } else if (this.isEditMode && this.originalProductData?.mainImageUrl) {
        // If in edit mode and no new file selected, but there was an original image URL,
        // send the URL string. Your backend DTO might need a string property for this.
        // OR, the backend handles missing file gracefully if the original URL is stored there.
        // Generally, for files, if you send a file, the backend replaces. If not, it keeps existing.
        // If your backend DTO for `mainImageUrl` is `IFormFile`, you should NOT append the URL.
        // If it's a separate string property for 'existing image url', then you would.
        // This is a common point of confusion. Assume IFormFile is only for new uploads.
        // If the backend handles this via another property like `existingMainImageUrl`, you'd add:
        // formData.append('existingMainImageUrl', this.originalProductData.mainImageUrl);
      }


      // Additional Images
      if (this.selectedAdditionalImageFiles && this.selectedAdditionalImageFiles.length > 0) {
        this.selectedAdditionalImageFiles.forEach((file: File, index: number) => {
          formData.append(`additionalImageUrls[${index}]`, file, file.name);
        });
      }
      // If in edit mode, and no new additional images were selected, but there were original ones,
      // you might need to send a list of their URLs if your backend expects it for preservation.
      // This is less common for files; usually, if files aren't sent, backend assumes no change.
      // If your backend DTO for `AdditionalImageUrls` is `List<IFormFile>`, you should NOT append URLs.
      // If it's a separate string list property for 'existing image urls', then you would.


      // Product Attributes (already handled as JSON string)
      const productAttributes = this.productForm.value.attributes.map((attr: any) => ({
        attributeId: attr.attributeId,
        values: Array.isArray(attr.value) ? attr.value : [attr.value]
      }));
      formData.append('attributes', JSON.stringify(productAttributes));

      // Product Variants
      this.productForm.value.variants.forEach((variantFormValue: any, variantIndex: number) => {
        const variantImageFileEntry = this.selectedVariantImageFiles.find(f => f.index === variantIndex);
        const variantImageFile = variantImageFileEntry ? variantImageFileEntry.file : null;

        const variantDataToSerialize = {
          variantId: variantFormValue.variantId || 0, // IMPORTANT: Include variantId for updates
          variantName: variantFormValue.variantName,
          sku: variantFormValue.sku,
          price: variantFormValue.price,
          discountPercentage: variantFormValue.discountPercentage,
          stockQuantity: variantFormValue.stockQuantity,
          isDefault: variantFormValue.isDefault,
          isAvailable: variantFormValue.isAvailable,
          attributes: variantFormValue.attributes.map((vAttr: any) => ({
            attributeId: vAttr.attributeId,
            attributeName: vAttr.attributeName,
            attributeValue: vAttr.attributeValue
          }))
        };

        formData.append(`variants[${variantIndex}].variantId`, variantDataToSerialize.variantId.toString()); // **NEW**
        formData.append(`variants[${variantIndex}].variantName`, variantDataToSerialize.variantName);
        formData.append(`variants[${variantIndex}].sku`, variantDataToSerialize.sku);
        formData.append(`variants[${variantIndex}].price`, variantDataToSerialize.price.toString());
        formData.append(`variants[${variantIndex}].discountPercentage`, variantDataToSerialize.discountPercentage.toString());
        formData.append(`variants[${variantIndex}].stockQuantity`, variantDataToSerialize.stockQuantity.toString());
        formData.append(`variants[${variantIndex}].isDefault`, variantDataToSerialize.isDefault.toString());
        formData.append(`variants[${variantIndex}].isAvailable`, variantDataToSerialize.isAvailable.toString());
        formData.append(`variants[${variantIndex}].attributes`, JSON.stringify(variantDataToSerialize.attributes));

        if (variantImageFile) {
          formData.append(`variants[${variantIndex}].variantImageUrl`, variantImageFile, variantImageFile.name);
        } else if (this.isEditMode && variantFormValue.variantImageUrl) {
          // If in edit mode, no new file selected, but an original image URL exists
          // Your backend DTO for variant might need a string property for existing image URL.
          // OR, the backend handles missing file by preserving existing.
          // This depends on your C# DTO. If IFormFile is the ONLY image property, don't send string.
          // If you have `public string ExistingVariantImageUrl {get;set;}`:
          // formData.append(`variants[${variantIndex}].ExistingVariantImageUrl`, variantFormValue.variantImageUrl);
        }
      });

      console.log('Constructed FormData:');
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      // Conditional API call based on mode
      if (this.isEditMode && this.productId) {
        // Send PUT request for update
        this.productService.updateProduct(formData).subscribe({ // Assuming updateProduct method exists
          next: () => {
            console.log('Product updated successfully!');
            this.router.navigate(['/seller/products']);
          },
          error: (err) => console.error('Error updating product:', err)
        });
      } else {
        // Send POST request for add
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
          error: (err) => console.error('Error adding product:', err)
        });
      }
    } else {
      console.log('Form is invalid. Please check the fields.');
      this.markAllAsTouched(this.productForm);
    }
  }

  // Helper to mark all form controls as touched to display validation messages.
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
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      this.router.navigate(['/seller/products']);
    }
  }

  }
