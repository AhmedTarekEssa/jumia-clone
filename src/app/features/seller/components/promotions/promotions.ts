import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Promotion {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'expired';
  applicableProducts: number;
}
@Component({
  selector: 'app-promotions',
  imports: [CommonModule, FormsModule],
  templateUrl: './promotions.html',
  styleUrl: './promotions.css'
})
export class Promotions implements OnInit {
  constructor(private cdr: ChangeDetectorRef) {}
  promotions: Promotion[] = [
    {
      id: 'PROMO-001',
      title: 'New Year Special',
      description: '20% off on all electronics',
      discountType: 'percentage',
      discountValue: 20,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      status: 'active',
      applicableProducts: 15
    },
    {
      id: 'PROMO-002',
      title: 'Free Shipping Weekend',
      description: 'Free shipping on orders above $50',
      discountType: 'fixed',
      discountValue: 10,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-17'),
      status: 'expired',
      applicableProducts: 50
    }
  ];

  showCreateForm = false;
  newPromotion: Partial<Promotion> = {};

  ngOnInit(): void {
    this.updatePromotionStatuses();
  }

  updatePromotionStatuses(): void {
    const now = new Date();
    this.promotions.forEach(promo => {
      if (now > promo.endDate) {
        promo.status = 'expired';
      } else if (now >= promo.startDate && now <= promo.endDate) {
        promo.status = 'active';
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (this.showCreateForm) {
      this.newPromotion = {
        discountType: 'percentage',
        status: 'inactive'
      };
    }
  }

  createPromotion(): void {
    if (this.isValidPromotion()) {
      const promotion: Promotion = {
        id: `PROMO-${Date.now().toString().slice(-3)}`,
        title: this.newPromotion.title!,
        description: this.newPromotion.description!,
        discountType: this.newPromotion.discountType!,
        discountValue: this.newPromotion.discountValue!,
        startDate: new Date(this.newPromotion.startDate!),
        endDate: new Date(this.newPromotion.endDate!),
        status: 'inactive',
        applicableProducts: 0
      };

      this.promotions.unshift(promotion);
      this.toggleCreateForm();
    }
  }

  isValidPromotion(): boolean {
    return !!(
      this.newPromotion.title &&
      this.newPromotion.description &&
      this.newPromotion.discountValue &&
      this.newPromotion.startDate &&
      this.newPromotion.endDate
    );
  }

  togglePromotionStatus(promotionId: string): void {
    const promotion = this.promotions.find(p => p.id === promotionId);
    if (promotion && promotion.status !== 'expired') {
      promotion.status = promotion.status === 'active' ? 'inactive' : 'active';
    }
  }

  deletePromotion(promotionId: string): void {
    if (confirm('Are you sure you want to delete this promotion?')) {
      this.promotions = this.promotions.filter(p => p.id !== promotionId);
    }
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'active': 'status-active',
      'inactive': 'status-inactive',
      'expired': 'status-expired'
    };
    return statusClasses[status] || '';
  }

  getDiscountDisplay(promotion: Promotion): string {
    return promotion.discountType === 'percentage'
      ? `${promotion.discountValue}%`
      : `$${promotion.discountValue}`;
  }
}
