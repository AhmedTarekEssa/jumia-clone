import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { UserInfo, LoginDto, AuthResponse, PasswordSetupDto, EmailCheckDto, OtpVerifyDto, CreateSellerDto } from '../../../app/shared/models/auth.model';

import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export  class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  tempEmail: string = '';
  otpCodeFromBackend: string = '';


  constructor(){}

  //Login
  login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.apiUrl + environment.authRoutes.login, 
      dto, {withCredentials: true} )
    .pipe(tap(() => {

      const user = this.getUserInfoFromCookie();
      this.currentUserSubject.next(user);
    }),
    catchError((err) => {
      console.error('Login Failed:' , err);
      return throwError(() => err);
    })
  );

  }

  //Register
  register(dto: PasswordSetupDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.apiUrl + environment.authRoutes.register,
      dto, {withCredentials: true})
      .pipe(tap( () => {
        const user =  this.getUserInfoFromCookie();
        this.currentUserSubject.next(user);
      }))
  }

    registerSeller(dto: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.apiUrl + environment.authRoutes.SellerRegister,
      dto, {withCredentials: true})
      .pipe(tap( () => {
        const user =  this.getUserInfoFromCookie();
        this.currentUserSubject.next(user);
      }))
  }

  //Logout
  logout() : Observable<any> {
    return this.http.delete(this.apiUrl + environment.authRoutes.logout, {withCredentials: true} )
    .pipe(tap( () => {
          // document.cookie = "UserInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      this.currentUserSubject.next(null);
      this.router.navigate(['/login-register']);
    })
  );
  }

  //Email check and OTP
  /////// add comment 
  checkEmail(dto: EmailCheckDto): Observable<any> {
    return this.http.post(this.apiUrl + environment.authRoutes.checkEmail, dto).pipe(
      tap({
        next:(data)=>console.log(data),
        error:()=>console.log("errrrrrrrrr")
      })
    )
  }

  verifyOtp(dto: OtpVerifyDto): Observable<any> {
    return this.http.post(this.apiUrl + environment.authRoutes.verifyOtp, dto);
  }

  //check if user is logged in
  isAuthenticated() : boolean {
    if(!this.currentUserSubject.value){
      this.initUserFromCookie();
    }
    return !!this.currentUserSubject.value;
  }


  //Get current user info
  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  private getUserInfoFromCookie(): UserInfo | null {
    const match = document.cookie.match(/(?:^|; )UserInfo=([^;]*)/);
    if (!match) return null;

    try {
      const userInfoJson = decodeURIComponent(match[1]);
      return JSON.parse(userInfoJson);

    } catch (e) {
      console.error('Failed to parse UserInfo Cookie', e);
      return null;
    }
  }

  //load user from cookie manually 
  public initUserFromCookie() : void {
    const user = this.getUserInfoFromCookie();
    this.currentUserSubject.next(user);
  }


  hasRole(role: string, user: UserInfo): boolean {
    if (!user || !user.role) return false;

    if (Array.isArray(user.role)) {
      return user.role.includes(role);
    }
    return user.role === role;
  }


  forgotPassword(email: string): Observable<{successed:boolean,message:string}> {
    const url = this.apiUrl + environment.authRoutes.forgetPassword;

    // Set the headers to indicate JSON payload
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Send the email as JSON
    const body = { email };  // Wrap the email in an object
    
    return this.http.post<{successed:boolean,message:string}>(url, body, { headers });
  }

resetPassword(data: { email: string, token: string, newPassword: string }): Observable<any> {
  return this.http.post(this.apiUrl + environment.authRoutes.resetPassword, data);
}




}
