import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../core/services/Categories/category';
import { Category } from '../../../../shared/models/category-';
import { CategoryAttribute } from '../../../../shared/models/category-attribute';
import { JsonParsePipe } from "../../../../shared/pipes/json-parse-pipe";
import { CreateProduct } from '../../../products/product-models';

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

  productForm!: FormGroup;

  // This will hold the initial top-level categories from the API
  categories: Category[] = [];

  // This will hold the active categories displayed in the dropdowns.
  // Each array in displayedCategoryLevels represents a level of subcategories.
  displayedCategoryLevels: Category[][] = [[]];

  // Store attributes fetched for the LAST selected category
  availableCategoryAttributes: CategoryAttribute[] = []; 
 selectedMainImageFile: File | null = null;
  selectedAdditionalImageFiles: File[] = [];
  selectedVariantImageFiles: { index: number, file: File }[] = [];
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initProductForm();
    this.loadCategories();
    // this.cdr.detectChanges(); // Initial detectChanges for form setup
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
    // if (this.productForm.valid) {
    //    const selectedCategoryIds = this.productForm.value.categoryIds;
    //   const finalCategoryId = selectedCategoryIds[selectedCategoryIds.length - 1];
    //   const productPayload :CreateProduct = {
    //     sellerId:1,
    //     name: this.productForm.value.name,
    //     basePrice: this.productForm.value.basePrice,
    //     description: this.productForm.value.description,
    //     categoryId: finalCategoryId, // The ID of the last selected category
    //     mainImageUrl: this.productForm.value.mainImageUrl,
    //     additionalImageUrls: this.productForm.value.additionalImageUrls, // Array of URLs

    //     // Map product attributes to match backend expected format (e.g., Array of { attributeId, value })
    //     attributes: this.productForm.value.attributes.map((attr: any) => ({
    //       attributeId: attr.attributeId,
    //       value: attr.value // This is the chosen value (string, number, or array for multi-select)
    //     })),

    //     // Map product variants to match backend expected format
    //     variants: this.productForm.value.variants.map((variant: any) => ({
    //       variantName: variant.variantName,
    //       sku: variant.sku,
    //       price: variant.price,
    //       discountPercentage: variant.discountPercentage,
    //       stockQuantity: variant.stockQuantity,
    //       variantImageUrl: variant.variantImageUrl,
    //       isDefault: variant.isDefault,
    //       isAvailable: variant.isAvailable,
    //       // Map variant attributes
    //       attributes: variant.attributes.map((vAttr: any) => ({
          
    //         attributeName: vAttr.attributeName, 
    //         attributeValue: vAttr.attributeValue
    //       }))
    //     }))
    //   };

    //   console.log(productPayload)
      
    //   this.productService.AddProduct(productPayload).subscribe({
    //     next:()=>{
    //       console.log("sucssessssssssssssssssssss")
    //     this.productForm.reset();
    //       this.clearProductAttributes();
    //       this.clearProductVariants();
    //       // Reset category dropdowns to initial state
    //       this.categoryIdsArray.clear();
    //       this.categoryIdsArray.push(this.fb.control('', this.validators.required));
    //       this.displayedCategoryLevels[0] = this.categories;
    //       this.cdr.detectChanges();
    //     },
    //     error:(err)=>console.error("errorroror" , err)
    //   })


    // } else {
    //   console.log('Form is invalid. Please check the fields.');
    //   this.markAllAsTouched(this.productForm); // Mark fields to show validation errors
    // }

  //    if (this.productForm.valid) {
  //   const selectedCategoryIds = this.productForm.value.categoryIds;
  //   const finalCategoryId = selectedCategoryIds[selectedCategoryIds.length - 1];

  //   // Create a FormData object
  //   const formData = new FormData();

  //   // 1. Append simple properties directly
  //   formData.append('sellerId', '1'); // Assuming fixed sellerId for now
  //   formData.append('categoryId', finalCategoryId.toString()); // Ensure it's a string
  //   formData.append('name', this.productForm.value.name);
  //   formData.append('description', this.productForm.value.description);
  //   formData.append('basePrice', this.productForm.value.basePrice.toString());

  //   // 2. Append MainImageUrl (the actual File object)
  //   if (this.selectedMainImageFile) {
  //     formData.append('mainImageUrl', this.selectedMainImageFile, this.selectedMainImageFile.name);
  //   } else {
  //     // If mainImageUrl is optional, you might not append anything if null.
  //     // If it's required, you'd add validation or ensure a default.
  //     // For now, let's append an empty string or nothing if it's not selected.
  //     // formData.append('mainImageUrl', ''); // Or skip if optional and not present
  //   }


  //   // 3. Append AdditionalImageUrls (array of File objects)
  //   if (this.selectedAdditionalImageFiles && this.selectedAdditionalImageFiles.length > 0) {
  //     this.selectedAdditionalImageFiles.forEach((file: File, index: number) => {
  //       // The key for array of files should be `propertyName[index]`
  //       formData.append(`additionalImageUrls[${index}]`, file, file.name);
  //     });
  //   }


  //   // 4. Append Product Attributes (JSON string)
  //   // Map your form attributes to the DTO structure and stringify
  //   const productAttributes = this.productForm.value.attributes.map((attr: any) => ({
  //     attributeId: attr.attributeId,
  //     // 'Values' is a List<string> in C#. 'value' from your form maps to it.
  //     // If your attribute.value is a single string, it will become List<string> with one item.
  //     // If it's an array of strings, it will be the List<string>.
  //     values: Array.isArray(attr.value) ? attr.value : [attr.value]
  //   }));
  //   formData.append('attributes', JSON.stringify(productAttributes));


  //   // 5. Append Product Variants (JSON string and Variant Image Files)
  //   const variantsForApi: any[] = [];
  //   this.productForm.value.variants.forEach((variantFormValue: any, variantIndex: number) => {
  //     // Find the corresponding File object for this variant's image
  //     const variantImageFile = this.selectedVariantImageFiles.find(f => f.index === variantIndex)?.file;

  //     // Construct the variant DTO data (excluding the file itself for JSON part)
  //     const variantDto = {
  //       variantId: variantFormValue.variantId, // If you have a hidden variantId for existing variants
  //       variantName: variantFormValue.variantName,
  //       sku: variantFormValue.sku,
  //       price: variantFormValue.price,
  //       discountPercentage: variantFormValue.discountPercentage,
  //       stockQuantity: variantFormValue.stockQuantity,
  //       isDefault: variantFormValue.isDefault,
  //       isAvailable: variantFormValue.isAvailable,
  //       // Map variant attributes
  //       attributes: variantFormValue.attributes.map((vAttr: any) => ({
  //         attributeId: vAttr.attributeId, // Ensure attributeId is included if backend needs it
  //         attributeName: vAttr.attributeName,
  //         attributeValue: vAttr.attributeValue
  //       }))
  //     };
  //     variantsForApi.push(variantDto); // Add to a list that will be stringified

  //     // Append the variant image file separately to FormData
  //     if (variantImageFile) {
  //       // Use a distinct key for each variant image, e.g., 'variants[0].variantImageUrl'
  //       formData.append(`variants[${variantIndex}].variantImageUrl`, variantImageFile, variantImageFile.name);
  //     }
  //   });

  //   // Append the JSON string of all variant data (excluding files which are appended above)
  //   formData.append('variants', JSON.stringify(variantsForApi));


  //   // Log the FormData content (for debugging)
  //   // Note: You cannot directly inspect FormData content with console.log(formData) in all browsers.
  //   // Use an iterator to see entries:
  //   formData.forEach((value, key) => {
  //     console.log(`${key}:`, value);
  //   });

  //   // Call your service with the FormData object
  //   this.productService.AddProduct(formData).subscribe({
  //     next: () => {
  //       console.log('Product added successfully!');
  //       this.productForm.reset();
  //       this.clearProductAttributes();
  //       this.clearProductVariants();
  //       // Reset category dropdowns to initial state
  //       this.categoryIdsArray.clear();
  //       this.categoryIdsArray.push(this.fb.control('', this.validators.required));
  //       this.displayedCategoryLevels = [this.categories]; // Reset display levels
  //       this.selectedMainImageFile = null; // Clear selected files
  //       this.selectedAdditionalImageFiles = [];
  //       this.selectedVariantImageFiles = [];
  //       this.cdr.detectChanges();
  //     },
  //     error: (err) => console.error('Error adding product:', err)
  //   });

  // } else {
  //   console.log('Form is invalid. Please check the fields.');
  //   this.markAllAsTouched(this.productForm); // Mark fields to show validation errors
  // }

  if (this.productForm.valid) {
    const selectedCategoryIds = this.productForm.value.categoryIds;
    const finalCategoryId = selectedCategoryIds[selectedCategoryIds.length - 1];

    const formData = new FormData();

    // 1. Append simple properties directly (as strings)
    formData.append('sellerId', '1'); // Assuming fixed sellerId for now
    formData.append('categoryId', finalCategoryId.toString());
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('basePrice', this.productForm.value.basePrice.toString());

    // 2. Append Main Image File
    if (this.selectedMainImageFile) {
      // The key should match the property name in your C# DTO: 'MainImageUrl'
      formData.append('mainImageUrl', this.selectedMainImageFile, this.selectedMainImageFile.name);
    }

    // 3. Append Additional Image Files (array of File objects)
    if (this.selectedAdditionalImageFiles && this.selectedAdditionalImageFiles.length > 0) {
      this.selectedAdditionalImageFiles.forEach((file: File, index: number) => {
        // The key should match the property name in your C# DTO: 'AdditionalImageUrls[index]'
        formData.append(`additionalImageUrls[${index}]`, file, file.name);
      });
    }

    // 4. Append Product Attributes (JSON string)
    // Ensure the structure matches your ProductAttributeDto for the main product
    const productAttributes = this.productForm.value.attributes.map((attr: any) => ({
      attributeId: attr.attributeId,
      // Assuming 'values' is what your C# backend expects as List<string>
      values: Array.isArray(attr.value) ? attr.value : [attr.value]
    }));
    formData.append('attributes', JSON.stringify(productAttributes));

    // 5. Append Product Variants
    // Iterate through each variant from the form
    this.productForm.value.variants.forEach((variantFormValue: any, variantIndex: number) => {

      // Find the corresponding File object for this variant's image
      const variantImageFileEntry = this.selectedVariantImageFiles.find(f => f.index === variantIndex);
      const variantImageFile = variantImageFileEntry ? variantImageFileEntry.file : null;

      // Construct the variant's non-file properties to be stringified
      // Use the exact casing expected by your C# DTO for these properties
      const variantDataToSerialize = {
        variantId: variantFormValue.variantId || 0, // Ensure it's a number, default to 0 if not present
        variantName: variantFormValue.variantName,
        sku: variantFormValue.sku,
        price: variantFormValue.price,
        discountPercentage: variantFormValue.discountPercentage,
        stockQuantity: variantFormValue.stockQuantity,
        isDefault: variantFormValue.isDefault,
        isAvailable: variantFormValue.isAvailable,
        // Map variant attributes, ensuring `attributeId` is included as per your Swagger
        attributes: variantFormValue.attributes.map((vAttr: any) => ({
          attributeId: vAttr.attributeId, // Make sure this is captured from your form
          attributeName: vAttr.attributeName,
          attributeValue: vAttr.attributeValue
        }))
      };

      // Append each non-file property of the variant individually to FormData
      // The key format is crucial: `Variants[index].PropertyName`
      // These properties will be bound directly by FromForm
      formData.append(`variants[${variantIndex}].variantName`, variantDataToSerialize.variantName);
      formData.append(`variants[${variantIndex}].sku`, variantDataToSerialize.sku);
      formData.append(`variants[${variantIndex}].price`, variantDataToSerialize.price.toString());
      formData.append(`variants[${variantIndex}].discountPercentage`, variantDataToSerialize.discountPercentage.toString());
      formData.append(`variants[${variantIndex}].stockQuantity`, variantDataToSerialize.stockQuantity.toString());
      formData.append(`variants[${variantIndex}].isDefault`, variantDataToSerialize.isDefault.toString());
      formData.append(`variants[${variantIndex}].isAvailable`, variantDataToSerialize.isAvailable.toString());

      // Stringify the attributes array for this specific variant
      formData.append(`variants[${variantIndex}].attributes`, JSON.stringify(variantDataToSerialize.attributes));

      // Append the variant image file, if selected
      // The key must match the IFormFile property name in your C# DTO: `Variants[index].VariantImageUrl`
      if (variantImageFile) {
        formData.append(`variants[${variantIndex}].variantImageUrl`, variantImageFile, variantImageFile.name);
      }
    });

    // Log the FormData content for debugging
    console.log('Constructed FormData:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    // Call your service with the FormData object
    this.productService.AddProduct(formData).subscribe({
      next: () => {
        console.log('Product added successfully!');
        this.productForm.reset();
        this.clearProductAttributes();
        this.clearProductVariants();
        // Reset category dropdowns to initial state
        this.categoryIdsArray.clear();
        this.categoryIdsArray.push(this.fb.control('', this.validators.required));
        this.displayedCategoryLevels = [this.categories]; // Reset display levels
        this.selectedMainImageFile = null; // Clear selected files
        this.selectedAdditionalImageFiles = [];
        this.selectedVariantImageFiles = [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error adding product:', err)
    });

  } else {
    console.log('Form is invalid. Please check the fields.');
    this.markAllAsTouched(this.productForm); // Mark fields to show validation errors
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

  }
