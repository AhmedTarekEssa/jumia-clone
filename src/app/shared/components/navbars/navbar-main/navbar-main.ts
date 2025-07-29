import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { CenterSliderComponent } from "../../center-slider/center-slider.component";
import { CategoryList } from "../../category-list/category-list";
import { Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { AuthService } from "../../../../core/services/auth";
import { Ai } from '../../../../core/services/ai-service/ai';
import { FormsModule } from '@angular/forms';



@Component({
  standalone: true,
  selector: 'app-navbar-main',
  //   standalone: true,
  imports: [CommonModule, CategoryList, FormsModule],

  templateUrl: './navbar-main.html',
  styleUrl: './navbar-main.css'
})
export class NavbarMain implements OnInit {
  showCategoryMenu = false;
  showAccountDropdown = false;
  userInfo: any = null;
  username: string = '';


  constructor(
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService

  ) { }

  ngOnInit() {
    this.checkUserLogin();
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.account-item')) {
      this.showAccountDropdown = false;
    }
  }

  checkUserLogin() {
    const userInfoCookie = this.cookieService.get('UserInfo');
    if (userInfoCookie) {
      try {
        // Decode the URL encoded cookie
        const decodedCookie = decodeURIComponent(userInfoCookie);
        this.userInfo = JSON.parse(decodedCookie);
        this.username = this.userInfo.UserName;

      } catch (e) {
        console.error('Error parsing user info cookie', e);
      }
    }
  }
  sementicSearch(query: string) {
    console.log(query)
    this.router.navigate(['/search-products'], {
      queryParams: { query: query }
    });



  }
  getUserFirstName(): string {

    return this.username.split(' ')[0] || 'User';
  }
  navigateAndClose(route: string): void {
    this.showAccountDropdown = false;
    this.router.navigate([route]);
  }


  toggleCategoryMenu() {
    if (this.isHome()) {
      this.showCategoryMenu = !this.showCategoryMenu;
    }
  }

  toggleAccountDropdown() {
    this.showAccountDropdown = !this.showAccountDropdown;
  }

  isHome(): boolean {
    return this.router.url !== '/' && this.router.url !== '/home';
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.userInfo = null;
        this.username = '';
        this.cookieService.delete('UserInfo');
        this.cookieService.delete('JumiaAuthCookie');
        this.router.navigate(['/login-register']);
      },
      error: (err) => {
        if (this.cookieService.get('UserInfo')) {
          this.cookieService.delete('UserInfo');
        }
        if (this.cookieService.get('JumiaAuthCookie')) {
          this.cookieService.delete('JumiaAuthCookie');
        }
        this.router.navigate(['/login-register']);

        // if (this.cookieService.get('UserInfo')) {
        //   this.cookieService.delete('UserInfo');
        //   this.cookieService.delete('JumiaAuthCookie');
        //   this.router.navigate(['/login-register']);
        // } else {
        //   this.router.navigate(['/login-register']);
        //   console.error('Logout failed', err);
        // }



      }
    });
  }


  //     sidebarCategories = [
  //     { name: 'Fashion', icon: 'fas fa-tshirt', id: '2' },
  //     { name: 'Phones & Tablets', icon: 'fas fa-mobile-alt', id: '1' },
  //     { name: 'Health & Beauty', icon: 'fas fa-heartbeat', id: '4' },
  //     { name: 'Home & Furniture', icon: 'fas fa-couch', id: '3' },
  //     { name: 'Appliances', icon: 'fas fa-blender', id: '3' },
  //     { name: 'Televisions & Audio', icon: 'fas fa-tv', id: '1' },
  //     { name: 'Baby Products', icon: 'fas fa-baby', id: '5' },
  //     { name: 'Supermarket', icon: 'fas fa-shopping-basket', id: '9' },
  //     { name: 'Computing', icon: 'fas fa-laptop', id: '1' },
  //     { name: 'Sporting Goods', icon: 'fas fa-running', id: '10' },
  //     { name: 'Gaming', icon: 'fas fa-gamepad', id: '8' },
  //     { name: 'Other categories', icon: 'fas fa-ellipsis-h', id: '1' }
  //   ];

  //   constructor(private router: Router){}

  //   navigateTo(path: string){
  //     this.dropdownVisible = false;
  //     this.router.navigate([path]).then(success => {
  //       if(!success) {
  //         console.error('Navigation Failed');
  //       }
  //     });
  //   }

  // dropdownVisible = false;

  // toggleDropdown(event: MouseEvent) {
  //   event.preventDefault(); // prevent unwanted default behavior
  //   this.dropdownVisible = !this.dropdownVisible;
  // }

  // closeDropdown() {
  //   this.dropdownVisible = false;
  // }
  // showCategoryMenu = false;
  // userInfo: any = null;

  // constructor(private router: Router, private cookieService: CookieService) {}

  // ngOnInit() {
  //   this.checkUserLogin();
  // }

  // checkUserLogin() {
  //   const userInfoCookie = this.cookieService.get('UserInfo');
  //   if (userInfoCookie) {
  //     try {
  //       // Decode the URL encoded cookie
  //       const decodedCookie = decodeURIComponent(userInfoCookie);
  //       this.userInfo = JSON.parse(decodedCookie);
  //     } catch (e) {
  //       console.error('Error parsing user info cookie', e);
  //     }
  //   }
  // }

  // toggleCategoryMenu() {
  //   this.showCategoryMenu = !this.showCategoryMenu;
  // }

  // isHome(): boolean {
  //   return this.router.url !== '/' && this.router.url !== '/home';
  // }

  // navigateToHome() {
  //   this.router.navigate(['/']);
  // }

  // logout() {
  //   this.cookieService.delete('UserInfo');
  //   this.userInfo = null;
  //   this.router.navigate(['/auth/login']);
  // }



  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   const target = event.target as HTMLElement;
  //   if (!target.closest('.nav-item.dropdown')) {
  //     this.dropdownVisible = false;
  //   }
  // }



}
