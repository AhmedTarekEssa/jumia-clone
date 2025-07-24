import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from '../../../../core/services/auth';

@Component({
  selector: 'app-verification',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './verification.html',
  styleUrl: './verification.css'
})
export class Verification {
otpForm!: FormGroup;
  errorMessage: string = '';
  otp: string[] = ['','','',''];
  countdown: number = 57;
  countdownLabel: string = '57 seconds';
  timer: any;
  tempEmail: string = '';
  resendEnabled: boolean = false;
  otpCodeFromBackend: string = '';

  @ViewChildren('otp0, otp1, otp2, otp3') inputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ){
    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit2: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit3: ['', [Validators.required, Validators.pattern('[0-9]')]],
      digit4: ['', [Validators.required, Validators.pattern('[0-9]')]],
    });
  }

  ngOnInit(): void {
    this.tempEmail = this.authService.tempEmail ?? 'Unknown Email';
    this.otpCodeFromBackend = this.authService.otpCodeFromBackend;
    console.log(this.authService.otpCodeFromBackend);
    this.startCountdown();
  }

   onInput(event: any, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');

    const inputArray = this.inputs.toArray();
    const current = inputArray[index].nativeElement;

    current.value = value;

    if (value.length === 1 && index < inputArray.length - 1) {
      inputArray[index + 1].nativeElement.focus();
    } else if (value.length === 0 && index > 0) {
      inputArray[index - 1].nativeElement.focus();

    }
  }


  submitOtp() : void{
  
    if (this.otpForm.invalid) {
      alert('Please enter the complete 4-digit code');
      return;
    }

    const code = Object.values(this.otpForm.value).join('');
    const email = this.authService.tempEmail;

    this.authService.verifyOtp({ email: email!, otpCode: code }).subscribe({
      next: () => {
        
        this.router.navigate(['/SellerAuth/SellerRegister']);
        console.log('OTP verified successfully');
      } ,
      error: (err) => {
        this.errorMessage = " Invalid OTP . Try again later";
        this.resetOtpInputs();
        // console.error(err);
      }
    });
  }

  resetOtpInputs(): void{
    this.otp = ['','','',''];
    this.inputs.first.nativeElement.focus();

  }


  resendCode(): void {
  const email = this.authService.tempEmail;
  if (!email) return;

  this.authService.checkEmail({email}).subscribe({
    next: () => {
      this.countdown = 57;
      this.startCountdown(); // Restart countdown
    },
    error: (err) => {
      console.error('Failed to resend OTP:', err);
    }
  });
}




   startCountdown(): void {
    this.resendEnabled = false;
    this.timer = setInterval(() => {
      if (this.countdown > 0){
        this.countdown--;
        this.countdownLabel = `${this.countdown} seconds`;
      } else {
        this.countdownLabel = 'now';
        this.resendEnabled = true;
        clearInterval(this.timer);
      }
      this.cdr.detectChanges();
    }, 1000);
  }
}
