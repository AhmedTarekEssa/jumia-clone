import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-unauthorized',
  imports: [],
  templateUrl: './unauthorized.html',
  styleUrl: './unauthorized.css'
})
export class Unauthorized {
  userRole = 'none';

  constructor(private router: Router , private cookieService: CookieService , private cdr: ChangeDetectorRef) {}

  goToLogin() {
    if(this.cookieService.get('UserInfo')){
      this.cookieService.delete('UserInfo');
    }
    if(this.cookieService.get('JumiaAuthCookie')){
      this.cookieService.delete('JumiaAuthCookie');
    }


    this.router.navigate(['/login-register']);
  }

  goToRegister() {
    if(this.cookieService.get('UserInfo')){
      this.cookieService.delete('UserInfo');
    }
    if(this.cookieService.get('JumiaAuthCookie')){
      this.cookieService.delete('JumiaAuthCookie');
    }
    this.router.navigate(['/login-register']);
  }


  goToHome() {
    const userInfoCookie = this.cookieService.get('UserInfo');
    if (userInfoCookie) {
      try {
        const decodedCookie = decodeURIComponent(userInfoCookie);
        const userInfo = JSON.parse(decodedCookie);
        this.userRole = userInfo.UserRole?.toLowerCase() || 'none';
        this.cdr.detectChanges();
      } catch (e) {
        console.error('Error parsing user info cookie', e);
      }
    }
    if(this.userRole === 'none'){
      this.router.navigate(['/']);
    }else if (this.userRole.toLocaleLowerCase() === 'admin'){
      this.router.navigate(['/admin']);
    }else if (this.userRole.toLocaleLowerCase() === 'seller'){
      this.router.navigate(['/seller']);
    }else if (this.userRole.toLocaleLowerCase() === 'customer'){
      this.router.navigate(['/']);
    }


  }


}
