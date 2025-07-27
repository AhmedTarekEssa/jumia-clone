import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FooterMain } from "../../components/footers/footer-main/footer-main";
import { RouterOutlet } from '@angular/router';

import { NavbarMain } from '../../components/navbars/navbar-main/navbar-main';

import { LiveChat } from "../../components/live-chat/live-chat";
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-main-layout',
  imports: [FooterMain, NavbarMain, RouterOutlet, LiveChat, CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout implements OnInit {
  showLiveChat: boolean = false;
  constructor(
    private cookies: CookieService,
    private cdr: ChangeDetectorRef
  ) {
    }
  ngOnInit(): void {
    if (this.cookies.check('UserInfo')&& this.cookies.get('UserInfo') !== null) {
      this.showLiveChat = true;
      this.cdr.detectChanges();
    }

  }

}
