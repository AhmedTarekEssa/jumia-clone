import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })

export class  sellerGuard implements CanActivate {


  userRole: string = 'none';
  sellerAuth: string = 'none';

  constructor(private cookieService: CookieService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userInfoCookie = this.cookieService.get('UserInfo');

    if (userInfoCookie) {
      try {
        const decodedCookie = decodeURIComponent(userInfoCookie);
        const userInfo = JSON.parse(decodedCookie);
        this.userRole = userInfo.UserRole?.toLowerCase() || 'none';
        this.sellerAuth = userInfo.SellerStatus?.toLowerCase() || 'none';
      } catch (e) {
        console.error('Error parsing user info cookie', e);
      }
    }

    // Only apply this guard's logic to sellers
    if (this.userRole === 'seller') {
      if (this.sellerAuth === 'pending') {
        this.router.navigate(['/pending-review']);
        return false;
      } else if (this.sellerAuth === 'rejected') {
        this.router.navigate(['/rejected']);
        return false;
      }
    }

    return true;
  }
}
