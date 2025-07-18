import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-promo-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promo-slider.component.html',
  styleUrls: ['./promo-slider.component.css']
})
export class PromoSliderComponent {
// Static data for PromoSliderComponent
slides = [
  { 
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop', 
    alt: 'Electronics', 
    category: { name: 'Electronics', icon: 'tag', id: '1' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop', 
    alt: 'Fashion', 
    category: { name: 'Fashion', icon: 'percent', id: '2' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', 
    alt: 'Home & Kitchen', 
    category: { name: 'Home & Kitchen', icon: 'flag', id: '3' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop', 
    alt: 'Beauty & Health', 
    category: { name: 'Beauty & Health', icon: 'bolt', id: '4' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop', 
    alt: 'Baby Products', 
    category: { name: 'Baby Products', icon: 'credit-card', id: '5' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', 
    alt: 'Phones & Tablets', 
    category: { name: 'Phones & Tablets', icon: 'store', id: '6' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop', 
    alt: 'Computing', 
    category: { name: 'Computing', icon: 'gift', id: '7' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop', 
    alt: 'Gaming', 
    category: { name: 'Gaming', icon: 'star', id: '8' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop', 
    alt: 'Grocery', 
    category: { name: 'Grocery', icon: 'fire', id: '9' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=300&fit=crop', 
    alt: 'Books & Office', 
    category: { name: 'Books & Office', icon: 'book', id: '10' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', 
    alt: 'Sports & Outdoor', 
    category: { name: 'Sports & Outdoor', icon: 'dumbbell', id: '11' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop', 
    alt: 'Automotive', 
    category: { name: 'Automotive', icon: 'car', id: '12' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=400&h=300&fit=crop', 
    alt: 'Toys & Games', 
    category: { name: 'Toys & Games', icon: 'gamepad', id: '13' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', 
    alt: 'Pet Supplies', 
    category: { name: 'Pet Supplies', icon: 'paw', id: '14' } 
  },
  { 
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop', 
    alt: 'Garden & Outdoor', 
    category: { name: 'Garden & Outdoor', icon: 'leaf', id: '15' } 
  }
];

// Alternative static data with placeholder images
alternativeSlides = [
  { 
    image: 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Electronics', 
    alt: 'Electronics', 
    category: { name: 'Electronics', icon: 'tag', id: '1' } 
  },
  { 
    image: 'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=Fashion', 
    alt: 'Fashion', 
    category: { name: 'Fashion', icon: 'percent', id: '2' } 
  },
  { 
    image: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Home+Kitchen', 
    alt: 'Home & Kitchen', 
    category: { name: 'Home & Kitchen', icon: 'flag', id: '3' } 
  },
  { 
    image: 'https://via.placeholder.com/400x300/F9CA24/FFFFFF?text=Beauty+Health', 
    alt: 'Beauty & Health', 
    category: { name: 'Beauty & Health', icon: 'bolt', id: '4' } 
  },
  { 
    image: 'https://via.placeholder.com/400x300/F0932B/FFFFFF?text=Baby+Products', 
    alt: 'Baby Products', 
    category: { name: 'Baby Products', icon: 'credit-card', id: '5' } 
  },
  { 
    image: 'https://via.placeholder.com/400x300/EB4D4B/FFFFFF?text=Phones+Tablets', 
    alt: 'Phones & Tablets', 
    category: { name: 'Phones & Tablets', icon: 'store', id: '6' } 
  },
  { 
    image: 'https://via.placeholder.com/400x300/6C5CE7/FFFFFF?text=Computing', 
    alt: 'Computing', 
    category: { name: 'Computing', icon: 'gift', id: '7' } 
  },
  { 
    image: 'https://via.placeholder.com/400x300/A29BFE/FFFFFF?text=Gaming', 
    alt: 'Gaming', 
    category: { name: 'Gaming', icon: 'star', id: '8' } 
  },
  { 
    image: 'https://via.placeholder.com/400x300/2ECC71/FFFFFF?text=Grocery', 
    alt: 'Grocery', 
    category: { name: 'Grocery', icon: 'fire', id: '9' } 
  }
];

// Static data for categories with more details
categoriesData = [
  {
    id: '1',
    name: 'Electronics',
    icon: 'tag',
    description: 'Latest electronic gadgets and devices',
    itemCount: 1250,
    featured: true,
    color: '#FF6B6B'
  },
  {
    id: '2',
    name: 'Fashion',
    icon: 'percent',
    description: 'Trendy clothing and accessories',
    itemCount: 890,
    featured: true,
    color: '#4ECDC4'
  },
  {
    id: '3',
    name: 'Home & Kitchen',
    icon: 'flag',
    description: 'Home appliances and kitchen essentials',
    itemCount: 650,
    featured: false,
    color: '#45B7D1'
  },
  {
    id: '4',
    name: 'Beauty & Health',
    icon: 'bolt',
    description: 'Beauty products and health supplements',
    itemCount: 420,
    featured: true,
    color: '#F9CA24'
  },
  {
    id: '5',
    name: 'Baby Products',
    icon: 'credit-card',
    description: 'Everything for your little ones',
    itemCount: 380,
    featured: false,
    color: '#F0932B'
  },
  {
    id: '6',
    name: 'Phones & Tablets',
    icon: 'store',
    description: 'Latest smartphones and tablets',
    itemCount: 290,
    featured: true,
    color: '#EB4D4B'
  },
  {
    id: '7',
    name: 'Computing',
    icon: 'gift',
    description: 'Computers, laptops and accessories',
    itemCount: 340,
    featured: false,
    color: '#6C5CE7'
  },
  {
    id: '8',
    name: 'Gaming',
    icon: 'star',
    description: 'Gaming consoles and accessories',
    itemCount: 180,
    featured: true,
    color: '#A29BFE'
  },
  {
    id: '9',
    name: 'Grocery',
    icon: 'fire',
    description: 'Fresh groceries and daily essentials',
    itemCount: 520,
    featured: false,
    color: '#2ECC71'
  }
];

// Sample product data for each category
productsData = {
  '1': [ // Electronics
    { id: 'e1', name: 'Wireless Headphones', price: 89.99, image: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Headphones' },
    { id: 'e2', name: 'Smart Watch', price: 199.99, image: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Watch' },
    { id: 'e3', name: 'Bluetooth Speaker', price: 49.99, image: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Speaker' }
  ],
  '2': [ // Fashion
    { id: 'f1', name: 'Summer Dress', price: 39.99, image: 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=Dress' },
    { id: 'f2', name: 'Sneakers', price: 79.99, image: 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=Sneakers' },
    { id: 'f3', name: 'Handbag', price: 59.99, image: 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=Bag' }
  ],
  '3': [ // Home & Kitchen
    { id: 'h1', name: 'Coffee Maker', price: 129.99, image: 'https://via.placeholder.com/200x200/45B7D1/FFFFFF?text=Coffee' },
    { id: 'h2', name: 'Air Fryer', price: 89.99, image: 'https://via.placeholder.com/200x200/45B7D1/FFFFFF?text=Fryer' },
    { id: 'h3', name: 'Blender', price: 69.99, image: 'https://via.placeholder.com/200x200/45B7D1/FFFFFF?text=Blender' }
  ]
};

// Promotional banners data
promoBanners = [
  {
    id: 'promo1',
    title: 'Summer Sale',
    subtitle: 'Up to 50% off on selected items',
    image: 'https://via.placeholder.com/800x300/FF6B6B/FFFFFF?text=Summer+Sale',
    link: '/promotions/summer-sale',
    active: true
  },
  {
    id: 'promo2',
    title: 'Free Shipping',
    subtitle: 'On orders over $50',
    image: 'https://via.placeholder.com/800x300/4ECDC4/FFFFFF?text=Free+Shipping',
    link: '/promotions/free-shipping',
    active: true
  },
  {
    id: 'promo3',
    title: 'New Arrivals',
    subtitle: 'Check out our latest products',
    image: 'https://via.placeholder.com/800x300/45B7D1/FFFFFF?text=New+Arrivals',
    link: '/promotions/new-arrivals',
    active: true
  }
];

//   @ViewChild('slidesContainer') slidesContainerRef!: ElementRef;

//   constructor(
//     private router: Router,
//     private navigationService: NavigationService
//   ) {}

//   ngOnInit() {
//     // Initialization if needed
//   }
  
//   navigateToCategory(category: {name: string, icon: string, id: string}): void {
//     // Store both the category name and ID in navigation service
//     this.navigationService.setCategoryName(category.name);
//     this.navigationService.setCategoryId(category.id);
    
//     // Navigate using only the ID
//     this.router.navigate(['/category', category.id]);
//   }

//   prevSlide() {
//     const slideWidth = 190; // width + gap
//     this.slidesContainerRef.nativeElement.scrollLeft -= slideWidth * 3;
//   }

//   nextSlide() {
//     const slideWidth = 190; // width + gap
//     this.slidesContainerRef.nativeElement.scrollLeft += slideWidth * 3;
//   }
}