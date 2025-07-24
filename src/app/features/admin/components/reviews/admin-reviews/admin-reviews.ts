import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Review {
  id: number;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  helpful: number;
}

@Component({
  standalone: true , 
  selector: 'app-admin-reviews',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reviews.html',
  styleUrl: './admin-reviews.css'
})
export class AdminReviews {

  searchTerm = '';
  statusFilter = '';
  ratingFilter = '';

  reviews: Review[] = [
    { id: 1, productName: 'iPhone 14 Pro', customerName: 'Ahmed Hassan', rating: 5, comment: 'Excellent phone with amazing camera quality. Fast delivery and great packaging.', date: '2024-07-20', status: 'Approved', helpful: 12 },
    { id: 2, productName: 'Samsung Galaxy S23', customerName: 'Fatima Ali', rating: 4, comment: 'Good phone overall, battery life could be better. Customer service was helpful.', date: '2024-07-22', status: 'Approved', helpful: 8 },
    { id: 3, productName: 'Nike Air Max', customerName: 'Mohamed Omar', rating: 3, comment: 'Shoes are comfortable but sizing runs small. Quality is decent for the price.', date: '2024-07-23', status: 'Pending', helpful: 3 },
    { id: 4, productName: 'Coffee Maker', customerName: 'Amira Mahmoud', rating: 2, comment: 'Product arrived damaged and customer service was slow to respond.', date: '2024-07-24', status: 'Pending', helpful: 1 }
  ];

  get filteredReviews(): Review[] {
    return this.reviews.filter(review => {
      const matchesSearch = review.productName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           review.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           review.comment.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.statusFilter || review.status === this.statusFilter;
      const matchesRating = !this.ratingFilter || review.rating.toString() === this.ratingFilter;
      return matchesSearch && matchesStatus && matchesRating;
    });
  }

  getReviewsByStatus(status: string): Review[] {
    return this.reviews.filter(review => review.status === status);
  }

  getAverageRating(): string {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / this.reviews.length).toFixed(1);
  }


}
