import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit{
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private route = inject( ActivatedRoute);
    private router = inject( Router);

    email: string | null = '';
    token:string | null = '';

    resetPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    token: [''],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {}

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');
    const newPassword = this.route.snapshot.queryParamMap.get('newPassword');

    if(email && token)
    {    
      this.resetPasswordForm.patchValue({ email, token });
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const { email, token, newPassword } = this.resetPasswordForm.value;

      if (newPassword !== this.resetPasswordForm.get('confirmPassword')?.value) {
        alert('Passwords do not match!');
        return;
      }
      console.log(newPassword);
            console.log(email);
      console.log(token);

      if (email && token && newPassword){
      this.authService.resetPassword({ email, token, newPassword }).subscribe(
        (response) => {
          alert('Password reset successful');
          this.router.navigate(['/auth/login']);
        },
        (error) => {
                  const errorMessage = error?.error?.message || 'An unknown error occurred. Please try again.';
          alert('Error: ' + error.error.message);
        }
      );
    }
    }
  }

}
