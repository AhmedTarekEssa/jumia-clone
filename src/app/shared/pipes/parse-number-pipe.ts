import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseNumber'
})
export class ParseNumberPipe implements PipeTransform {
transform(value: string | number | null | undefined): number {
    if (typeof value === 'string') {
      return parseFloat(value) || 0; // Convert string to float, default to 0 if invalid
    }
    return value || 0; // Return number directly, default to 0 if null/undefined
  }

}
