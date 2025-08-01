import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  userRole: string = 'none';

  constructor(private cookieService: CookieService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userInfoCookie = this.cookieService.get('UserInfo');

    if (userInfoCookie) {
      try {
        const decodedCookie = decodeURIComponent(userInfoCookie);
        const userInfo = JSON.parse(decodedCookie);
        this.userRole = userInfo.UserRole?.toLowerCase() || 'none';
      } catch (e) {
        console.error('Error parsing user info cookie', e);
      }
    }

    const expectedRoles = route.data['roles'] as string[];

    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    const normalizedRoles = expectedRoles.map(role => role.toLowerCase());

    if (!normalizedRoles.includes(this.userRole)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
