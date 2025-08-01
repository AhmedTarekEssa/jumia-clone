// import { Injectable } from '@angular/core';
// import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
// import { CookieService } from 'ngx-cookie-service';

// @Injectable({ providedIn: 'root' })
// export class RoleGuard implements CanActivate {
//   userRole: string = 'none';
//   sellerAuth: string = 'none';

//   constructor(private cookieService: CookieService, private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot): boolean {
//     const userInfoCookie = this.cookieService.get('UserInfo');

//     if (userInfoCookie) {
//       try {
//         const decodedCookie = decodeURIComponent(userInfoCookie);
//         const userInfo = JSON.parse(decodedCookie);
//         this.userRole = userInfo.UserRole?.toLowerCase() || 'none';
//         this.sellerAuth = userInfo.SellerStatus?.toLowerCase() || 'none';
//       } catch (e) {
//         console.error('Error parsing user info cookie', e);
//       }
//     }

//     const expectedRoles = route.data['role'] as string[];

//     // If the route has no role restrictions, allow access
//     if (!expectedRoles || expectedRoles.length === 0) {
//       return true;
//     }

//     const normalizedRoles = expectedRoles.map(role => role.toLowerCase());

//     // Check if user has required role
//     if (!normalizedRoles.includes(this.userRole)) {
//       this.router.navigate(['/unauthorized']);
//       return false;
//     }

//     // Additional checks for sellers
//     if (this.userRole === 'seller') {
//       if (this.sellerAuth === 'pending') {
//         this.router.navigate(['/pending-review']);
//         return false;
//       } else if (this.sellerAuth === 'rejected') { // Fixed typo from your original code
//         this.router.navigate(['/rejected']);
//         return false;
//       }
//     }

//     return true;
//   }
// }
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

    // If the route has no role restrictions, allow access
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    const normalizedRoles = expectedRoles.map(role => role.toLowerCase());

    // Check if user has required role
    if (!normalizedRoles.includes(this.userRole)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
