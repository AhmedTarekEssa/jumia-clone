import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IReview } from '../../../../../shared/models/ireview';
import { IReviewService } from '../../../../../core/services/ReviewService/ireview-service';

// interface Review {
//   id: number;
//   productName: string;
//   customerName: string;
//   rating: number;
//   comment: string;
//   date: string;
//   status: 'Approved' | 'Pending' | 'Rejected';
//   helpful: number;
// }

@Component({
  standalone: true , 
  selector: 'app-admin-reviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reviews.html',
  styleUrl: './admin-reviews.css'
})
export class AdminReviews implements OnInit {

  searchTerm = '';
  statusFilter = '';
  ratingFilter = '';

  constructor(private reviewservice:IReviewService,private cdr:ChangeDetectorRef){

  } 

  RatingList:IReview[]=[]

  get filteredReviews(): IReview[] {
    return this.RatingList.filter(review => {
      const matchesSearch =
                           review.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           review.comment.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRating = !this.ratingFilter || review.stars.toString() === this.ratingFilter;
      return matchesSearch && matchesRating;
    });
  }
  acceptReview(ratingId: number) {
  this.reviewservice.AcceptReview(ratingId).subscribe({
    next: () => {
      const review = this.RatingList.find(r => r.ratingId === ratingId);
      if (review) review.isAccepted = 'Approved';
      this.cdr.detectChanges(); // Ensure the view updates after the change
    },
    error: (err) => {
      console.error('Failed to accept review:', err);
    }
  });
}

rejectReview(ratingId: number) {
  this.reviewservice.RejectReview(ratingId).subscribe({
    next: () => {
      const review = this.RatingList.find(r => r.ratingId === ratingId);
      if (review) review.isAccepted = 'Rejected';
      this.cdr.detectChanges(); // Ensure the view updates after the change
    },
    error: (err) => {
      console.error('Failed to reject review:', err);
    }
  });
}

  ngOnInit(): void {
    this.getAllReview();
  }
  getAllReview() {
    this.reviewservice.getAllForAdmin().subscribe({
      next: (res) => {
        console.log('Reviews fetched successfully:', res);
        this.RatingList = res;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
      }
    });
  }



  getAverageRating(): string {
    const total = this.RatingList.reduce((sum, review) => sum + review.stars, 0);
    return (total / this.RatingList.length).toFixed(1);
  }


}
