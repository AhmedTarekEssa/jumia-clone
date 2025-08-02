import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  userRole: string = 'none';



  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute, private cookieService: CookieService) {
    this.loginForm = this.fb.group({
      // email: ['',[Validators.required, Validators.email]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const email = this.authService.tempEmail;

    console.log(email);
    if (!email) {
      this.router.navigate(['/auth/check-email']);
      return;
    }

    this.loginForm.patchValue({
      email
    });


    // this.loginForm = this.fb.group({
    //   email: [{ value: this.authService.tempEmail, disabled: true }],
    //   password: ['',Validators.required]
    // });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    // const credentials = this.loginForm.value;
    const dto = {
      email: this.authService.tempEmail,
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(dto).subscribe({
      next: () => {


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
        if (this.userRole.toLowerCase() === 'admin') {
          this.router.navigate(['/admin']);
        } else if (this.userRole.toLowerCase() === 'seller') {
          this.router.navigate(['/seller']);
        } else if (this.userRole.toLowerCase() === 'customer') {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Login Failed. Please try again';

      }
    });
  }
  hidePassword = true;

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  isPasswordInvalid(): boolean {
    const passwordControl = this.loginForm.get('password');

    return passwordControl ? passwordControl.invalid && passwordControl.touched : false;

  }

  ForgetPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }


}


