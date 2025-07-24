import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/auth';

@Component({
  selector: 'app-step3-documents',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step3-documents.html',
  styleUrl: './step3-documents.css'
})
export class Step3Documents {

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
      BussinessDiscreption: ['', [Validators.required, Validators.minLength(10)]],
      BussinessLogo: ['', [Validators.required]], // Assuming this is a file input, you might need to handle it differently
      // otpCode: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      terms: [false, Validators.requiredTrue]
    }, {
      validator: this.matchPasswords

    });    
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

onSubmit(): void {
  this.submitted = true;

  if (this.registerForm.invalid || !this.selectedImageFile) {
    this.errorMessage = 'Please fill all required fields and upload an image.';
    return;
  }

  const formValue = this.registerForm.getRawValue();

  const formData = new FormData();
  formData.append('FirstName', formValue.firstName);
  formData.append('LastName', formValue.lastName);
  formData.append('BirthDate', formValue.birthDate); // ISO string is fine
  formData.append('Gender', formValue.gender);
  formData.append('Address', formValue.address);
  formData.append('Email', this.authService.tempEmail);
  formData.append('Password', formValue.password);
  formData.append('ConfirmPassword', formValue.confirmPassword);
  formData.append('OtpCode', this.authService.otpCodeFromBackend.toString());
  formData.append('BusinessDescription', formValue.BussinessDiscreption);
  formData.append('BusinessLogo', formValue.BussinessLogo); // if this is just a text field
  formData.append('Image', this.selectedImageFile); // ← This is the actual image upload

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

  selectedImageFile: File | null = null;

onFileSelected(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    this.selectedImageFile = fileInput.files[0];
  }
}






}
