import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
    private cdr = inject(ChangeDetectorRef)
    private router = inject( Router);

    email: string | null = '';
    token:string | null = '';

    resetPasswordForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor() {}

  ngOnInit(): void {
   this.route.queryParams.subscribe(p=>{
    this.token = p['token']
    this.email = p['email']
    this.cdr.detectChanges()
   })
    if(!this.email||!this.token){

    }
   
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const { confirmPassword, newPassword } = this.resetPasswordForm.value;

      if (newPassword !== this.resetPasswordForm.get('confirmPassword')?.value) {
        alert('Passwords do not match!');
        return;
      }
      
          
     

      if (this.email && this.token && newPassword){
        const email = this.email
        const token = encodeURIComponent(this.token)
      this.authService.resetPassword({ email, token, newPassword }).subscribe(
        (response) => {
          alert('Password reset successful');
          this.authService.tempEmail = email;
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
