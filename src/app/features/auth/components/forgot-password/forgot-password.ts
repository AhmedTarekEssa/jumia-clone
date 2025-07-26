import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(){}
  
  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email ?? '';
      this.authService.forgotPassword(email).subscribe(
        (response) => {
          console.log(response);
          const token = response?.resetToken;
          console.log(token);
          this.authService.forgetToken = token;
          if (token) {
            this.router.navigate(['/auth/reset-password'],{queryParams: {email, token}});
          }else {
              alert('Error: Token not Found');

          }
        },
        (error) => {
          alert('Error: ' + error.error.message);
        }
      );
    }
  }

}
