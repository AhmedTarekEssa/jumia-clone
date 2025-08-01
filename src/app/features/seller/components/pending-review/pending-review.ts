import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from "../../../../core/services/auth";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-pending-review',
  imports: [CommonModule],
  templateUrl: './pending-review.html',
  styleUrl: './pending-review.css'
})
export class PendingReview {
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
