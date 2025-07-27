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
  ngOnInit(): void {
    this.getAllReview();
  }
  getAllReview() {
    this.reviewservice.getallRatings().subscribe({
      next: (res) => {
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
