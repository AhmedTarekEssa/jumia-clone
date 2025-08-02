import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CouponDto, CreateCouponDto } from '../../../coupon/coupon-models';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CouponService } from '../../../../core/services/CouponService/coupon-service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true , 
  selector: 'app-coupons',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './coupons.html',
  styleUrl: './coupons.css'
})
export class Coupons implements OnInit{

  coupons: CouponDto[] = [];
  filteredCoupons: CouponDto[] = [];
  couponForm: FormGroup;
  isEditing = false;
  currentCouponId: number | null = null;
  isLoading = false;
  searchTerm = '';
  notification = {
    show: false,
    message: '',
    type: '' // 'success' or 'error'
  };

  constructor(
    private couponService: CouponService,
    private fb: FormBuilder,
    private cdr:ChangeDetectorRef
  ) {
    this.couponForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]+$/)]],
      description: ['', Validators.required],
      discountAmount: [0, [Validators.required, Validators.min(0)]],
      minimumPurchase: [0, [Validators.required, Validators.min(0)]],
      discountType: ['Percentage', Validators.required],
      startDate: [new Date().toISOString().substring(0, 10), Validators.required],
      endDate: [new Date().toISOString().substring(0, 10), Validators.required],
      isActive: [true],
      usageLimit: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.isLoading = true;
    this.couponService.getAllActiveCoupons().subscribe({
      next: (coupons) => {
        console.log(coupons);
        this.coupons = coupons;
        this.filteredCoupons = [...this.coupons];
        this.isLoading = false;
        this.cdr.detectChanges()
      },
      error: (err) => {
        this.showNotification('Failed to load coupons', 'error');
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredCoupons = [...this.coupons];
      return;
    }
    this.filteredCoupons = this.coupons.filter(coupon => 
      coupon.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

onSubmit(): void {
  if (this.couponForm.invalid) {
    this.markFormGroupTouched(this.couponForm);
    return;
  }

  this.isLoading = true;
  const formValue = this.couponForm.value;
  const couponDto: CreateCouponDto = {
    ...formValue,
    startDate: new Date(formValue.startDate),
    endDate: new Date(formValue.endDate)
  };

  const operation$ = this.isEditing && this.currentCouponId
    ? this.couponService.updateCoupon(this.currentCouponId, couponDto)
    : this.couponService.createCoupon(couponDto);

  operation$.subscribe({
    next: (success) => {
      if (success) {
        this.showNotification(`Coupon ${this.isEditing ? 'updated' : 'created'} successfully`, 'success');
        this.resetForm();
        this.loadCoupons();
        this.cdr.detectChanges();
      } else {
        this.showNotification(`Failed to ${this.isEditing ? 'update' : 'create'} coupon`, 'error');
      }
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Operation error:', error);
      this.showNotification('An error occurred', 'error');
      this.isLoading = false;
    }
  });
}

  editCoupon(coupon: CouponDto): void {
    this.isEditing = true;
    this.currentCouponId = coupon.couponId;
    this.couponForm.patchValue({
      code: coupon.code,
      description: coupon.description,
      discountAmount: coupon.discountAmount,
      minimumPurchase: coupon.minimumPurchase,
      discountType: coupon.discountType,
      startDate: coupon.startDate,
      endDate: coupon.endDate,
      isActive: coupon.isActive,
      usageLimit: coupon.usageLimit
    });
    this.cdr.detectChanges();
  }

  deleteCoupon(couponId: number): void {
    if (confirm('Are you sure you want to delete this coupon?')) {
      this.isLoading = true;
      this.couponService.deleteCoupon(couponId).subscribe({
        next: (success) => {
          if (success) {
            this.showNotification('Coupon deleted successfully', 'success');
            this.loadCoupons();
            this.cdr.detectChanges();
          } else {
            this.showNotification('Failed to delete coupon', 'error');
          }
          this.isLoading = false;
        },
        error: () => {
          this.showNotification('An error occurred while deleting', 'error');
          this.isLoading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.couponForm.reset({
      discountType: 'Percentage',
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date().toISOString().substring(0, 10),
      isActive: true,
      discountAmount: 0,
      minimumPurchase: 0,
      usageLimit: 0
    });
    this.isEditing = false;
    this.currentCouponId = null;
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.notification = {
      show: true,
      message,
      type
    };
    setTimeout(() => {
      this.notification.show = false;
    }, 3000);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
