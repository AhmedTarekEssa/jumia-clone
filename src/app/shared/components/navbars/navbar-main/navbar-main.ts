import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CenterSliderComponent } from "../../center-slider/center-slider.component";
import { CategoryList } from "../../category-list/category-list";

@Component({
  selector: 'app-navbar-main',
  imports: [CommonModule, CenterSliderComponent, CategoryList],
  templateUrl: './navbar-main.html',
  styleUrl: './navbar-main.css'
})
export class NavbarMain {
    sidebarCategories = [
    { name: 'Fashion', icon: 'fas fa-tshirt', id: '2' },
    { name: 'Phones & Tablets', icon: 'fas fa-mobile-alt', id: '1' },
    { name: 'Health & Beauty', icon: 'fas fa-heartbeat', id: '4' },
    { name: 'Home & Furniture', icon: 'fas fa-couch', id: '3' },
    { name: 'Appliances', icon: 'fas fa-blender', id: '3' },
    { name: 'Televisions & Audio', icon: 'fas fa-tv', id: '1' },
    { name: 'Baby Products', icon: 'fas fa-baby', id: '5' },
    { name: 'Supermarket', icon: 'fas fa-shopping-basket', id: '9' },
    { name: 'Computing', icon: 'fas fa-laptop', id: '1' },
    { name: 'Sporting Goods', icon: 'fas fa-running', id: '10' },
    { name: 'Gaming', icon: 'fas fa-gamepad', id: '8' },
    { name: 'Other categories', icon: 'fas fa-ellipsis-h', id: '1' }
  ];
}
