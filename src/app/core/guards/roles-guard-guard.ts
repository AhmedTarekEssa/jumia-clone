import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let userRole = 'none';

    const userInfoCookie = this.cookieService.get('UserInfo');
    if (userInfoCookie) {
      try {
        const decodedCookie = decodeURIComponent(userInfoCookie);
        const userInfo = JSON.parse(decodedCookie);
        userRole = userInfo.UserRole?.toLowerCase() || 'none';
      } catch (e) {
        console.error('Error parsing user info cookie', e);
      }
    }

    const expectedRoles = route.data['role'] as string[]; // array of roles

    // If the route has no role restrictions, allow access
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    const normalizedRoles = expectedRoles.map(role => role.toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      this.router.navigate(['/login-register']);
      return false;
    }

    return true;
  }
}
