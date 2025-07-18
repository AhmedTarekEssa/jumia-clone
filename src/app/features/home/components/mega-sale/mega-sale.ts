import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductCard } from "../../../../shared/components/product-card/product-card";

@Component({
  selector: 'app-mega-sale',
  imports: [CommonModule, ProductCard],
  templateUrl: './mega-sale.html',
  styleUrl: './mega-sale.css'
})
export class MegaSale {
  products = [
  {
    id: 1,
    name: 'Nike Air Zoom Pegasus 39',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHf5n2IQep8_NEGfGaCc_zNJjaS2QfxW7XQw&s',
    finalPrice: 199,
    basePrice: 299,
    discount: 33
  },
  {
    id: 2,
    name: 'Adidas Ultraboost 22',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHf5n2IQep8_NEGfGaCc_zNJjaS2QfxW7XQw&s',
    finalPrice: 219,
    basePrice: 319,
    discount: 31
  },
  {
    id: 3,
    name: 'Puma Velocity Nitro 2',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHf5n2IQep8_NEGfGaCc_zNJjaS2QfxW7XQw&s',
    finalPrice: 180,
    basePrice: 270,
    discount: 33
  },
  {
    id: 4,
    name: 'New Balance Fresh Foam X',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHf5n2IQep8_NEGfGaCc_zNJjaS2QfxW7XQw&s',
    finalPrice: 250,
    basePrice: 330,
    discount: 24
  },
  {
    id: 5,
    name: 'Asics Gel-Kayano 30',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHf5n2IQep8_NEGfGaCc_zNJjaS2QfxW7XQw&s',
    finalPrice: 209,
    basePrice: 299,
    discount: 30
  },
  {
    id: 6,
    name: 'Reebok Floatride Energy 4',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHf5n2IQep8_NEGfGaCc_zNJjaS2QfxW7XQw&s',
    finalPrice: 189,
    basePrice: 259,
    discount: 27
  },
  {
    id: 7,
    name: 'Under Armour HOVR Sonic',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHf5n2IQep8_NEGfGaCc_zNJjaS2QfxW7XQw&s',
    finalPrice: 199,
    basePrice: 299,
    discount: 33
  },
  {
    id: 8,
    name: 'Saucony Ride 15',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHf5n2IQep8_NEGfGaCc_zNJjaS2QfxW7XQw&s',
    finalPrice: 215,
    basePrice: 310,
    discount: 31
  },
  {
    id: 9,
    name: 'Hoka Clifton 9',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHf5n2IQep8_NEGfGaCc_zNJjaS2QfxW7XQw&s',
    finalPrice: 230,
    basePrice: 320,
    discount: 28
  },
  {
    id: 10,
    name: 'Fila Running Shoes X',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHf5n2IQep8_NEGfGaCc_zNJjaS2QfxW7XQw&s',
    finalPrice: 175,
    basePrice: 240,
    discount: 27
  },
  {
    id: 11,
    name: 'Mizuno Wave Rider 26',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHf5n2IQep8_NEGfGaCc_zNJjaS2QfxW7XQw&s',
    finalPrice: 245,
    basePrice: 340,
    discount: 28
  },
  {
    id: 12,
    name: 'Li-Ning ARCN Sneakers',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHf5n2IQep8_NEGfGaCc_zNJjaS2QfxW7XQw&s',
    finalPrice: 159,
    basePrice: 220,
    discount: 28
  }
];


}
