import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ISeller } from '../../../../../shared/models/iseller';
import { SellerService } from '../../../../../core/services/SellerService/seller-service';



@Component({
  standalone: true ,
  selector: 'app-admin-sellers',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-sellers.html',
  styleUrl: './admin-sellers.css'
})
export class AdminSellers implements OnInit {

  constructor(private sellerService: SellerService,private cdr : ChangeDetectorRef) {}

  showAddForm = false;
  searchTerm = '';
  statusFilter = '';
  categoryFilter = '';
  sellers:ISeller[]=[]


 get filteredSellers(): ISeller[] {
      console.log('Current search term:', this.searchTerm);
  console.log('All sellers:', this.sellers);
  
  if (!this.searchTerm?.trim()) {
    console.log('No search term - returning all customers');
    return this.sellers;
  }

  const searchLower = this.searchTerm.trim().toLowerCase();
  console.log('Searching for:', searchLower);

  const filtered = this.sellers.filter(seller => {
    const matches = (
      (seller.businessName.toLowerCase().includes(searchLower)) 
     
    );
        return matches;
  });

  console.log('Filtered results:', filtered);
  return filtered;
  }


  ngOnInit(): void {
    this.getAllSellers();
  }

  getAllSellers(){

    this.sellerService.getAllSellers().subscribe({
      next:(data:ISeller[])=>{
        console.log(data)
        this.sellers=data
        this.cdr.detectChanges()
      }
    })

  }

  toggleBlockSeller(sellerId: number): void {
  this.sellerService.ToggleBlock(sellerId).subscribe({
    next: (res) => {
      const seller = this.sellers.find(s => s.sellerId === sellerId);
      if (seller) {
        seller.isVerified = seller.isVerified === 'Blocked' ? 'Authorized' : 'Blocked';
      }
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Block toggle failed', err);
    }
  });
}

verifySeller(sellerId: number): void {
  const seller = this.sellers.find(s => s.sellerId === sellerId);
  if (seller && seller.isVerified?.toLowerCase() !== 'authorized') {
    this.sellerService.IsVerify(sellerId).subscribe({
      next: res => {
        seller.isVerified = 'Authorized'; // Update to reflect the new state
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Verification failed', err);
      }
    });
  }
}




  // addSeller(): void {
  //   if (this.newSeller.name && this.newSeller.email && this.newSeller.businessName && this.newSeller.category) {
  //     const seller: Seller = {
  //       id: this.sellers.length + 1,
  //       ...this.newSeller,
  //       joinDate: new Date().toISOString().split('T')[0],
  //       totalProducts: 0,
  //       totalSales: 0,
  //       commission: 10
  //     };
  //     this.sellers.push(seller);
  //     this.newSeller = { name: '', email: '', phone: '', businessName: '', category: '', status: 'Pending' };
  //     this.showAddForm = false;
  //   }
  // }

}
