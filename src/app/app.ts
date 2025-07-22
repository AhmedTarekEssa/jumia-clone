import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarMain } from "./shared/components/navbars/navbar-main/navbar-main";
import { HomeContainer } from "./features/home/home-container/home-container";
import AuthService from './core/services/auth';
import { Login } from "./features/auth/components/login/login";
import { CheckEmail } from "./features/auth/components/check-email/check-email";

import { Products } from './features/seller/components/products/products';
import { ProductDetailC } from './features/products/components/product-detail/product-detail';
import { CartItems } from "./features/cart/components/cart-items/cart-items";
import { ProductGrid } from "./shared/components/product-containers/product-grid/product-grid";
import { CategoryShowcase } from "./features/home/components/category-showcase/category-showcase";

@Component({
  selector: 'app-root',

  imports: [RouterOutlet, NavbarMain, HomeContainer, ProductDetailC,Login, CheckEmail, CartItems, ProductGrid, CategoryShowcase],


 


  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'jumia-clone';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    //when user refreshes the page , the cookie is read and user is logged in automatically
    this.authService.initUserFromCookie();
  }

}
