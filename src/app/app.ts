import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarMain } from "./shared/components/navbars/navbar-main/navbar-main";
import { HomeContainer } from "./features/home/home-container/home-container";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarMain, HomeContainer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'jumia-clone';
}
