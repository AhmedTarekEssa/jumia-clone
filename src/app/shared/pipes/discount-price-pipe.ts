import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountPrice'
})
export class DiscountPricePipe implements PipeTransform {

 transform(basePrice: number, discount: number): number {
  
    
      return basePrice - (basePrice * discount / 100);

  }

}
