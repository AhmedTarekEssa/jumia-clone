import { Component } from '@angular/core';
import { NavbarMain } from "../../../shared/components/navbars/navbar-main/navbar-main";
import { FlashSale } from "../components/flash-sale/flash-sale";
import { AllEssentials } from "../components/all-essentials/all-essentials";
import { CategoryShowcase } from "../components/category-showcase/category-showcase";
import { MegaSale } from "../components/mega-sale/mega-sale";
import { InfoComponent } from "../components/info/info.component";
import { FooterMain } from "../../../shared/components/footers/footer-main/footer-main";
import { PromoSliderComponent } from "../components/promoSlider/promo-slider.component";
import { ImageContainer } from "../../../shared/components/image-container/image-container";

@Component({
  selector: 'app-home-container',
  imports: [ FlashSale, AllEssentials, CategoryShowcase, MegaSale, InfoComponent,  PromoSliderComponent, ImageContainer],
  templateUrl: './home-container.html',
  styleUrl: './home-container.css'
})
export class HomeContainer {

}
