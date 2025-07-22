import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm!: FormGroup;
  submitted = false;
  errorMessage = '';
  
  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ){
    const tempEmail = this.authService.tempEmail;
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]], // you can add custom date validation if needed
      gender: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      email: [{ value: tempEmail, disabled: true }, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      // otpCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      terms: [false, Validators.requiredTrue]
    }, {
      validator: this.matchPasswords

    });    
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  onSubmit(): void{
    console.log("pppppppppppppppppppppppppppppppppppp");
    this.submitted = true;

    if (this.registerForm.invalid) return;

    const formValue = this.registerForm.getRawValue();

    // if(formValue.otpCode !== this.authService.otpCodeFromBackend.toString()){
    //   console.log("invalid otp");
    //   console.log(formValue.otpCode);
    //   console.log(this.authService.otpCodeFromBackend);
    //   this.errorMessage = 'Invalid OTP Code';
    //   return;
    // }

    const userData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      birthDate: formValue.birthDate,
      gender: formValue.gender,
      address: formValue.address,
      email: this.authService.tempEmail,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      otpCode: this.authService.otpCodeFromBackend,

    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        console.log(res.message);
        this.router.navigate(['/auth/get-started']);        
      },
      error: err => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Registration Failed. Please tyr later';
      }

    });
  }








}
