import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {AuthService} from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-check-email',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './check-email.html',
  styleUrl: './check-email.css'
})
export class CheckEmail implements OnInit {

  checkEmailForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ){
     this.checkEmailForm = this.fb.group({
      email: ['',[Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {

   
  }

  onSubmit () {
    if (this.checkEmailForm.invalid) {
      this.checkEmailForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const email = this.checkEmailForm.value.email;

    this.authService.checkEmail({email}).subscribe({
      next: (res) => {
        console.log(res);
        this.authService.tempEmail = email;
        this.authService.otpCodeFromBackend = res.otp;
        if (res.isRegistered) {
          this.router.navigate(['/auth/login'], {queryParams: { email }});
        }else {
          this.router.navigate(['/auth/verify-email']);
        }
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Something went wrong';
        this.loading = false;
      }
    });
  }


}
