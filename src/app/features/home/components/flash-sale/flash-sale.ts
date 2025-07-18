import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
interface Product {
  productId: number;
  name: string;
  description: string;
  basePrice: number;
  discountPercentage: number;
  finalPrice: number;
  isAvailable: boolean;
  mainImageUrl: string;
  averageRating: number;
  sellerId: number;
  sellerName: string;
  categoryId?: string; 
  categoryName?: string; 
  subcategoryId?: string;
  subcategoryName: string;
  stockQuantity: number;
}
@Component({
  selector: 'app-flash-sale',
  imports: [CommonModule,RouterLink],
  templateUrl: './flash-sale.html',
  styleUrl: './flash-sale.css'
})
export class FlashSale {
flashSaleProducts: Product[] = [
  {
    productId: 301,
    name: 'Ninja Foodi 5L Air Fryer',
    description: 'Oil-free healthy cooking',
    basePrice: 2999,
    discountPercentage: 40,
    finalPrice: 1799,
    isAvailable: true,
    mainImageUrl: 'https://m.media-amazon.com/images/I/71xzo2u6hyL._AC_SL1500_.jpg',
    averageRating: 4.5,
    sellerId: 101,
    sellerName: 'HomeStore',
    categoryId: '3',
    categoryName: 'Home & Kitchen',
    subcategoryId: '31',
    subcategoryName: 'Appliances',
    stockQuantity: 5
  },
  {
    productId: 302,
    name: 'Vitamix E310 Power Blender',
    description: 'Smoothies in seconds',
    basePrice: 799,
    discountPercentage: 25,
    finalPrice: 599,
    isAvailable: true,
    mainImageUrl: 'https://m.media-amazon.com/images/I/71xzo2u6hyL._AC_SL1500_.jpg',
    averageRating: 4.2,
    sellerId: 102,
    sellerName: 'BlenderWorld',
    categoryId: '3',
    categoryName: 'Home & Kitchen',
    subcategoryId: '32',
    subcategoryName: 'Blenders',
    stockQuantity: 18
  },
  {
    productId: 303,
    name: 'Rowenta DW9280 Steam Iron',
    description: 'Wrinkle-free in seconds',
    basePrice: 500,
    discountPercentage: 10,
    finalPrice: 450,
    isAvailable: true,
    mainImageUrl: 'https://m.media-amazon.com/images/I/71xzo2u6hyL._AC_SL1500_.jpg',
    averageRating: 4.0,
    sellerId: 103,
    sellerName: 'IronShop',
    categoryId: '3',
    categoryName: 'Home & Kitchen',
    subcategoryId: '33',
    subcategoryName: 'Irons',
    stockQuantity: 12
  },
  {
    productId: 304,
    name: 'Keurig K-Mini Coffee Maker',
    description: 'Single-serve coffee in minutes',
    basePrice: 999,
    discountPercentage: 30,
    finalPrice: 699,
    isAvailable: true,
    mainImageUrl: 'https://m.media-amazon.com/images/I/71xzo2u6hyL._AC_SL1500_.jpg',
    averageRating: 4.3,
    sellerId: 104,
    sellerName: 'CoffeeHaven',
    categoryId: '3',
    categoryName: 'Home & Kitchen',
    subcategoryId: '34',
    subcategoryName: 'Coffee Makers',
    stockQuantity: 10
  },
  {
    productId: 305,
    name: 'Cuisinart CPT-180 Toaster',
    description: 'Perfect toast with wide slots',
    basePrice: 699,
    discountPercentage: 20,
    finalPrice: 559,
    isAvailable: true,
    mainImageUrl: 'https://m.media-amazon.com/images/I/71xzo2u6hyL._AC_SL1500_.jpg',
    averageRating: 4.1,
    sellerId: 105,
    sellerName: 'ToastMaster',
    categoryId: '3',
    categoryName: 'Home & Kitchen',
    subcategoryId: '35',
    subcategoryName: 'Toasters',
    stockQuantity: 15
  },
  {
    productId: 306,
    name: 'Philips HD9252 Electric Kettle',
    description: 'Fast boiling for tea and more',
    basePrice: 399,
    discountPercentage: 15,
    finalPrice: 339,
    isAvailable: true,
    mainImageUrl: 'https://m.media-amazon.com/images/I/71xzo2u6hyL._AC_SL1500_.jpg',
    averageRating: 4.4,
    sellerId: 106,
    sellerName: 'KettleWorks',
    categoryId: '3',
    categoryName: 'Home & Kitchen',
    subcategoryId: '36',
    subcategoryName: 'Kettles',
    stockQuantity: 8
  }
];
getStockPercentage(stock: number): number {
  const maxStock = 20;
  const percentage = (stock / maxStock) * 100;
  return Math.min(Math.max(percentage, 5), 100); // Clamp between 5% and 100%
}

}
