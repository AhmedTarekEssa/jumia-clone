import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn , GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import {AuthService} from '../services/auth';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.authService.isAuthenticated()){
      return true;
    }

    if (state.url !== '/auth/login'){
      this.router.navigate(['/auth/login']);
    }

    return false;

  }

}
