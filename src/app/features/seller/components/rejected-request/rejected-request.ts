import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-rejected-request',
  imports: [],
  templateUrl: './rejected-request.html',
  styleUrl: './rejected-request.css'
})
export class RejectedRequest {
  userInfo: any = null;
  username: string = '';

  constructor(private router: Router , private authService: AuthService ,    private cookieService: CookieService) {}

  redirectToLogin() {
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


      }
    });
  }




}
