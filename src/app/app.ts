import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarMain } from "./shared/components/navbars/navbar-main/navbar-main";
import { HomeContainer } from "./features/home/home-container/home-container";

import { Products } from './features/seller/components/products/products';
import { ProductDetailC } from './features/products/components/product-detail/product-detail';
import { CartItems } from "./features/cart/components/cart-items/cart-items";
import { ProductGrid } from "./shared/components/product-containers/product-grid/product-grid";
import { CategoryShowcase } from "./features/home/components/category-showcase/category-showcase";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarMain, HomeContainer, ProductDetailC, CartItems, ProductGrid, CategoryShowcase],


  imports: [RouterOutlet, NavbarMain, HomeContainer],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'jumia-clone';
}
