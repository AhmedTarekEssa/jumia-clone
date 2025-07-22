import { Component } from '@angular/core';
import { FooterMain } from "../../components/footers/footer-main/footer-main";
import { NavbarMain } from "../../components/navbars/navbar-main/navbar-main";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-main-layout',
  imports: [FooterMain, NavbarMain , RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {

}
