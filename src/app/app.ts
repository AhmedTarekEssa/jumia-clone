import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarMain } from "./shared/components/navbars/navbar-main/navbar-main";
import { HomeContainer } from "./features/home/home-container/home-container";
import {AuthService} from './core/services/auth';
import { Login } from "./features/auth/components/login/login";
import { CheckEmail } from "./features/auth/components/check-email/check-email";

import { Products } from './features/seller/components/products/products';
import { ProductDetailC } from './features/products/components/product-detail/product-detail';
import { CartItems } from "./features/cart/components/cart-items/cart-items";
import { ProductGrid } from "./shared/components/product-containers/product-grid/product-grid";
import { CategoryShowcase } from "./features/home/components/category-showcase/category-showcase";

import { Dashboard } from "./features/seller/components/dashboard/dashboard";
import { DashboardComponent } from './features/admin/components/dashboard/dashboard';
import { AdminSidebar } from "./features/admin/components/admin-sidebar/admin-sidebar";
import { AdminHeader } from "./features/admin/components/admin-header/admin-header";
import { AdminSettings } from "./features/admin/components/settings/admin-settings/admin-settings";
import { AdminStats } from "./features/admin/components/stats/admin-stats/admin-stats";
import { AdminCategories } from "./features/admin/components/categories/admin-categories/admin-categories";
import { AdminContainer } from "./features/admin/admin-container/admin-container";

import { ProductReviews } from "./features/products/components/product-reviews/product-reviews";
import { LiveChat } from "./shared/components/live-chat/live-chat";
import { AddProduct } from "./features/seller/components/add-product/add-product";


@Component({
  selector: 'app-root',




  imports: [RouterOutlet, NavbarMain, HomeContainer, DashboardComponent, ProductDetailC, Login, CheckEmail, CartItems, ProductGrid, CategoryShowcase, Dashboard, AdminSidebar, AdminHeader, AdminSettings, AdminStats, AdminCategories, AdminContainer],








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
