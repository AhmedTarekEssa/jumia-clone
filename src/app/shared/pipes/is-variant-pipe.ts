import { Pipe, PipeTransform } from '@angular/core';
import { Variant } from '../../features/products/product-models';
import { CartSelectableItem } from '../../features/products/components/product-detail/product-detail';

@Pipe({
  name: 'isVariant'
})
export class IsVariantPipe implements PipeTransform {

  transform(value: CartSelectableItem): boolean {
    // This is a type guard check: if it has variantId, it's a Variant
    return (value as Variant).variantId !== undefined;
  }

}
