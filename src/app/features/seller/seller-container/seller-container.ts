import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SellerSidebar } from "../components/seller-sidebar/seller-sidebar";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SellerService } from '../../../core/services/SellerService/seller-service';
import { ISeller } from '../../../shared/models/iseller';

@Component({
  selector: 'app-seller-container',
  standalone: true,
  imports: [RouterOutlet, SellerSidebar, CommonModule],
  templateUrl: './seller-container.html',
  styleUrls: ['./seller-container.css']
})
export class SellerContainer implements OnInit {
  seller!: ISeller;
  isLoading: boolean = true;
  error: string | null = null;
  sellerId!: number;
  userInfoCookie!: string | null;
  isSidebarCollapsed = false;

  constructor(
    private router: Router,
    private sellerService: SellerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userInfoCookie = this.getCookie('UserInfo');

    if (this.userInfoCookie) {
      const userInfo = JSON.parse(this.userInfoCookie);
      const userTypeId = userInfo.UserTypeId;
      console.log('UserTypeId:', userTypeId);
      this.sellerId = userTypeId;
      this.loadSellerDetails();
    } else {
      this.error = 'User info not found in cookies';
      this.isLoading = false;
    }
  }

  loadSellerDetails(): void {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.sellerService.getSellerById(this.sellerId).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          this.seller = this.mapSellerData(data[0]);
        } else {
          this.error = 'No seller data found';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('Seller Data:', data);
      },
      error: (err) => {
        this.error = 'Failed to load seller details';
        this.isLoading = false;
        console.error('Error loading seller details:', err);
        this.cdr.detectChanges();
      }
    });
  }

  private mapSellerData(data: any): ISeller {
    return {
      sellerId: data.sellerId,
      sellerName: data.sellerName,
      email: data.email,
      userId: data.userId,
      businessName: data.businessName,
      imageUrl: data.imageUrl,
      businessDescription: data.businessDescription,
      businessLogo: data.businessLogo,
      isVerified: data.isVerified,
      verifiedAt: data.verifiedAt,
      rating: data.rating,
      totalProductsSold: data.totalProductsSold,
      totalAmountSold: data.totalAmountSold
    };
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  navigateToSellerDetails() {
    this.router.navigate(['/seller/details']);
  }

  getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }
}
