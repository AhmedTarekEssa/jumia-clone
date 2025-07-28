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
  return this.sellers.filter(seller => {
    const term = this.searchTerm.toLowerCase();
    return (
      seller.businessName.toLowerCase().includes(term) ||
      seller.businessDescription.toLowerCase().includes(term)
    );
  });
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
toggleVerification(sellerId: number): void {
  this.sellerService.IsVerify(sellerId).subscribe({
    next: res => {
      const seller = this.sellers.find(s => s.sellerId === sellerId);
      if (seller) {
        seller.isVerified = !seller.isVerified;
      }
      console.log(res.message);
      this.cdr.detectChanges();
    },
    error: err => {
      console.error('Verification toggle failed', err);
    }
  });
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
