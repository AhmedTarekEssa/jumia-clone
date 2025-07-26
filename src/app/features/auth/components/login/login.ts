import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AuthService} from '../../../../core/services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit{
  loginForm: FormGroup;
  errorMessage: string | null = null;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute){
    this.loginForm = this.fb.group({
      // email: ['',[Validators.required, Validators.email]],
      email: [{ value: '', disabled: true },[Validators.required, Validators.email]],
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

  onSubmit(){
    if (this.loginForm.invalid) return;

    // const credentials = this.loginForm.value;
    const dto = {
      email: this.authService.tempEmail,
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(dto).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Login Failed. Please try again';
        
      }
    });
  }

  isPasswordInvalid() : boolean{
    const passwordControl = this.loginForm.get('password');
  
    return passwordControl ? passwordControl.invalid && passwordControl.touched : false;

}

ForgetPassword(){
    this.router.navigate(['/auth/forgot-password']);
}


  }


