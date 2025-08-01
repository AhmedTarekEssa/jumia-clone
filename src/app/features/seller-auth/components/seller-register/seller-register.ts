import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-seller-register',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './seller-register.html',
  styleUrl: './seller-register.css'
})
export class SellerRegister {
  registerForm!: FormGroup;
  submitted = false;
  errorMessage = '';

  selectedImageFile: File | null = null;
  selectedBusinessLogoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    const tempEmail = this.authService.tempEmail;
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      email: [{ value: tempEmail, disabled: true }, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      BussinessName: ['', Validators.required],
      BussinessDiscreption: ['', [Validators.required, Validators.minLength(10)]],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: this.matchPasswords
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImageFile = fileInput.files[0];
    }
  }

  onBusinessLogoSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedBusinessLogoFile = fileInput.files[0];
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid || !this.selectedImageFile || !this.selectedBusinessLogoFile) {
      this.errorMessage = 'Please fill all required fields and upload both images.';
      return;
    }

    this.cdr.detectChanges();
    const formValue = this.registerForm.getRawValue();

    const formData = new FormData();
    formData.append('FirstName', formValue.firstName);
    formData.append('LastName', formValue.lastName);
    formData.append('BirthDate', formValue.birthDate);
    formData.append('Gender', formValue.gender);
    formData.append('Address', formValue.address);
    formData.append('Email', this.authService.tempEmail);
    formData.append('Password', formValue.password);
    formData.append('ConfirmPassword', formValue.confirmPassword);
    formData.append('OtpCode', this.authService.otpCodeFromBackend.toString());
    formData.append('BusinessDescription', formValue.BussinessDiscreption);
    formData.append('BusinessName', formValue.BussinessName);
    formData.append('Image', this.selectedImageFile);
    formData.append('BusinessLogo', this.selectedBusinessLogoFile);

    this.authService.registerSeller(formData).subscribe({
      next: (res) => {
        console.log(res.message);
        this.router.navigate(['/auth/get-started']);
      },
      error: err => {
        console.error(err);
        this.errorMessage = err.error?.message || 'Registration failed. Please try again later.';
      }
    });
  }
}
