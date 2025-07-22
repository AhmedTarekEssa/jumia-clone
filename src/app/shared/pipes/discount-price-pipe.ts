import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discountPrice'
})
export class DiscountPricePipe implements PipeTransform {

 transform(basePrice: number, discountRange: string): number {
    const match = discountRange.match(/(\d+(\.\d+)?)%/g);
    if (match && match.length > 0) {
      const discount = parseFloat(match[match.length - 1].replace('%', ''));
      return basePrice - (basePrice * discount / 100);
    }
    return basePrice; 
  }

}
