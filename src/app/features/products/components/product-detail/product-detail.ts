import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/Product-Service/product';
import { ProductDetails, Variant, Attribute, Attribute2 } from '../../product-models'; // Ensure all interfaces are imported
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../../core/services/cart-service/cart-service';
import { AddToCart } from '../../../cart/cart-models';
import { WishlistService } from '../../../../core/services/wishlist';
import { environment } from '../../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { Loading } from '../../../../shared/components/loading/loading';

import { IsVariantPipe } from '../../../../shared/pipes/is-variant-pipe';
import { ParseNumberPipe } from '../../../../shared/pipes/parse-number-pipe';
import { Ai, AskQuestion, ChatMessage, GetAnswer } from '../../../../core/services/ai-service/ai';
import { ProductReviews } from "../product-reviews/product-reviews";
// --- Start of New/Modified Types ---
// Define a type guard to check if an item is a Variant

// Ensure this union type is correctly defined
export type CartSelectableItem = Variant | ProductDetails;

export interface CartSelection {
  productId: number;
  item: CartSelectableItem;
  quantity: number;
  // availableStockQuantity property is removed from interface definition here
  // Instead, it will be calculated on the fly or derived from item.stockQuantity and cartQuantities
}
// --- End of New/Modified Types ---





@Component({
  selector: 'app-product-detail',

  imports: [CommonModule, FormsModule, RouterLink , Loading,IsVariantPipe, ProductReviews],

  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailC implements OnInit {
  product!: ProductDetails;
  lowStock: boolean = false;
  isWishlisted: boolean = false;
  selectedVariant!: Variant;
  currentImageIndex: number = 0;
  allImages: string[] = [];
  showCartPopup: boolean = false;
  cartSelections: CartSelection[] = []; // Corrected type
  variantImages: any[] = [];
  currentVariantImageIndex:number=0;
  item!:AddToCart;
  productId!:number;
  baseImageUrl = environment.ImageUrlBase;
  cartQuantities: { [id: number]: number } = {}; // This is the variable we're focusing on
  private parseNumberPipe = new ParseNumberPipe();

  // --- Product AI Bot Properties ---
  showChat: boolean = false;
  messages: ChatMessage[] = []; // Use the updated ChatMessage interface
  currentQuestion: string = '';
  isBotThinking: boolean = false; // Renamed from isBotTyping to isBotThinking
  // --- End Product AI Bot Properties ---

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private cartService:CartService,
    private route: ActivatedRoute,
    private wishlistService: WishlistService,
    private cookieService: CookieService,
    private aiService:Ai
  ) {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Product ID from route:", this.productId);

  }

  ngOnInit(): void {
    this.messages.push({
      type: 'bot',
      text: "Hello! I'm your product AI assistant. Ask me anything about this product!",
      thought: "Initial greeting message for the user.",
      showThought: false
    });
    if (this.cookieService.check('UserInfo')&& this.cookieService.get('UserInfo') !== null ) {
      this.checkWishlistStatus();
    }

    console.log("Fetching product details for ID:", this.productId);
    this.productService.getProductDetails(this.productId).subscribe({
      next: (data) => {
        this.product = data;
        console.log("-------------------------");
        console.log(data);

        // Ensure selectedVariant is properly set based on variant existence
        if (this.product.variants && this.product.variants.length > 0) {
            this.selectedVariant = this.product.variants.find(v => v.isDefault) || this.product.variants[0];
            this.variantImages = this.product.variants.map(v => v.variantImageUrl as string); // Cast to string if variantImageUrl can be File|null
        } else {
            // For products without variants, you might set a "default" variant using product properties
            // Or handle display differently if there's no selectedVariant concept for these products
            // For now, let's just make sure selectedVariant isn't undefined if the UI expects it.
            this.selectedVariant = {
                variantId: this.product.productId,
                variantName: this.product.name,
                price: this.product.basePrice, // Use basePrice for non-variant products
                discountPercentage: this.product.discountPercentage || 0, // Convert string to number
                stockQuantity: this.product.stockQuantity,
                sku: '', // Add a default SKU or handle appropriately
                variantImageUrl: this.product.mainImageUrl, // Use main image
                isDefault: true,
                isAvailable: this.product.isAvailable,
                attributes: [] // Empty array for attributes
            };
            this.variantImages = []; // No variant images if no variants
        }

        this.initializeImages();
        this.isThereLowStocks();
        this.fetchCartQuantities(); // Fetch cart quantities after product details are loaded

        // Tell Angular to re-run change detection to avoid ExpressionChangedAfterItHasBeenCheckedError
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error fetching product details: ", err)
    });
  }

  fetchCartQuantities() {
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartQuantities = {}; // Clear previous quantities
        cart.cartItems.forEach(item => {
          if (item.variationId) {
            this.cartQuantities[item.variationId] = item.quantity;
          } else {
            this.cartQuantities[item.productId] = item.quantity;
          }
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error fetching cart", err)
    });
  }


  isThereLowStocks() {
    // If no variants, check the product's own stock
    if (!this.product.variants || this.product.variants.length === 0) {
      this.lowStock = this.product.stockQuantity < 5;
    } else {
      // If variants, check variants' stock
      const lowStockList = this.product.variants.filter(v => v.stockQuantity < 5);
      this.lowStock = lowStockList.length > 0;
    }
  }

  isVariant(item: CartSelectableItem): item is Variant {
    return (item as Variant).variantId !== undefined;
  }

  getItemIdentifier(item: CartSelectableItem): number {
    return this.isVariant(item) ? item.variantId : item.productId;
  }

  getItemName(item: CartSelectableItem): string {
    return this.isVariant(item) ? item.variantName : item.name;
  }

  getItemImageUrl(item: CartSelectableItem): string {
    return this.isVariant(item) ? (item.variantImageUrl as string) : item.mainImageUrl;
  }

  getItemPrice(item: CartSelectableItem): number {
    return this.isVariant(item) ? item.price : item.basePrice;
  }

  getItemDiscountPercentage(item: CartSelectableItem): number {
    const discount = this.isVariant(item) ? item.discountPercentage : this.parseNumberPipe.transform(item.discountPercentage);
    return discount || 0; // Ensure it's a number, default to 0
  }

  public getItemAvailability(item: CartSelectableItem): boolean {
    return item.isAvailable;
  }

  getItemStockQuantity(item: CartSelectableItem): number {
    return this.isVariant(item) ? item.stockQuantity : item.stockQuantity;
  }

  // New helper to get the available stock quantity for a given item, considering what's in the cart
  getAvailableStockQuantity(item: CartSelectableItem): number {
    const totalStock = this.getItemStockQuantity(item);
    const inCartQty = this.cartQuantities[this.getItemIdentifier(item)] || 0;
    return Math.max(0, totalStock - inCartQty);
  }

  initializeImages(): void {
    this.allImages = [this.product.mainImageUrl, ...this.product.additionalImageUrls];
  }

  previousImage(): void {
    this.currentImageIndex = this.currentImageIndex === 0 ? this.allImages.length - 1 : this.currentImageIndex - 1;
  }

  nextImage(): void {
    this.currentImageIndex = this.currentImageIndex === this.allImages.length - 1 ? 0 : this.currentImageIndex + 1;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  // Adjusted to use selectedVariant or product properties for main display
  getCurrentPrice(): number {
    if (this.selectedVariant) {
        return this.selectedVariant.price * (1 - this.selectedVariant.discountPercentage / 100);
    } else {
        // Fallback for when selectedVariant might not be perfectly aligned with product-only items
        return this.product.basePrice * (1 - ((this.product.discountPercentage || 0) / 100));
    }
  }

  // Adjusted for consistency
  hasDiscount(): boolean {
    if (this.selectedVariant) {
        return this.selectedVariant.discountPercentage > 0;
    } else {
        return (this.product.discountPercentage || 0) > 0;
    }
  }

  openCartPopup(): void {
    this.showCartPopup = true;

    if (this.product.variants && this.product.variants.length > 0) {
      this.cartSelections = this.product.variants
        .filter(v => v.isAvailable && this.getAvailableStockQuantity(v) > 0) // Filter by available stock
        .map(v => ({ productId: this.product.productId, item: v, quantity: 0 }));
    } else {
      if (this.product.isAvailable && this.getAvailableStockQuantity(this.product) > 0) { // Filter by available stock
        this.cartSelections = [{
          productId: this.product.productId,
          item: this.product,
          quantity: 0
        }];
      } else {
        this.cartSelections = [];
      }
    }
    this.cdr.detectChanges();
  }

  checkWishlistStatus() {
    this.wishlistService.isInWishlist(this.productId).subscribe({
      next: (isWishlisted) => {
        this.isWishlisted = isWishlisted;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error checking wishlist', err)
    });
  }

  closeCartPopup(): void {
    this.showCartPopup = false;
  }

  toggleWishlist(): void {
    if (this.isWishlisted) {
      this.wishlistService.removeFromWishlist(this.product.productId).subscribe({
        next: () => {
          this.isWishlisted = false;
          console.log('Removed from wishlist');
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error removing from wishlist', err)
      });
    } else {
      this.wishlistService.addToWishlist(this.product.productId).subscribe({
        next: () => {
          this.isWishlisted = true;
          console.log('Added to wishlist');
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error adding to wishlist', err)
      });
    }
  }

  updateVariantQuantity(itemId: number, change: number): void {
    const selection = this.cartSelections.find(s => this.getItemIdentifier(s.item) === itemId);

    if (selection) {
      const availableStock = this.getAvailableStockQuantity(selection.item); // Use the helper
      const newQty = selection.quantity + change;

      if (newQty >= 0 && newQty <= availableStock) {
        selection.quantity = newQty;
      }
    }
  }

  setVariantQuantity(itemId: number, quantity: number): void {
    const selection = this.cartSelections.find(s => this.getItemIdentifier(s.item) === itemId);
    if (selection) {
      const availableStock = this.getAvailableStockQuantity(selection.item); // Use the helper
      selection.quantity = Math.max(0, Math.min(quantity, availableStock));
    }
  }

  getTotalItems(): number {
    return this.cartSelections.reduce((sum, s) => sum + s.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartSelections.reduce((total, s) => {
      let itemPrice: number;
      let itemDiscountPercentage: number;

      if (this.isVariant(s.item)) {
        itemPrice = s.item.price;
        itemDiscountPercentage = s.item.discountPercentage;
      } else {
        itemPrice = s.item.basePrice;
        itemDiscountPercentage = s.item.discountPercentage || 0;
      }

      return total + (s.quantity * (itemPrice * (1 - itemDiscountPercentage / 100)));
    }, 0);
  }

  addToCart(): void {
    const itemsToAdd = this.cartSelections.filter(s => s.quantity > 0);
    if (itemsToAdd.length === 0) {
      alert('Please select at least one item with quantity.');
      return;
    }
    console.log('Adding to cart:', itemsToAdd);

    const items = itemsToAdd.map(i => ({
      productId: i.productId,
      variantId: this.isVariant(i.item) ? i.item.variantId : null,
      quantity: i.quantity
    }));
    console.log(items);

    this.cartService.addToCart(items).subscribe(
      {
       
        next: () => {
          console.log("added to cart");
          // Update cartQuantities after successful add to cart
          itemsToAdd.forEach(selection => {
            const id = this.getItemIdentifier(selection.item);
            this.cartQuantities[id] = (this.cartQuantities[id] || 0) + selection.quantity;
          });
          this.closeCartPopup();
          this.cdr.detectChanges(); // Re-detect changes to update UI based on new cart quantities
        },
        error: (err) => console.error("error adding to cart", err)
      }
    );
  }


toggleChat(): void {
    this.showChat = !this.showChat;
    this.cdr.detectChanges(); // Manually trigger change detection
    if (this.showChat) {
      this.scrollToBottom(); // Scroll to bottom when chat opens
    }
  }

  sendMessage(): void {
    if (this.currentQuestion.trim() === '') {
      return;
    }

    const userQuestion = this.currentQuestion;
    this.messages.push({ type: 'user', text: userQuestion }); // Add user message
    this.currentQuestion = ''; // Clear input field

    this.isBotThinking = true; // Show "Bot is thinking" indicator
    this.cdr.detectChanges(); // Update UI immediately

    const askQuestionPayload: AskQuestion = {
      productId: this.productId, // Make sure productId is correctly available here
      question: userQuestion
    };

    this.aiService.productBot(askQuestionPayload).subscribe({
      next: (response: GetAnswer) => {
        const fullResponse = response.answer;
        // Regex to extract content within <think> tags and the remaining answer
        // /s flag allows '.' to match newlines
        // \s* to match any whitespace between </think> and the actual answer
        const thoughtMatch = fullResponse.match(/<think>(.*?)<\/think>\s*(.*)/s);

        let botText = fullResponse.trim();
        let botThought: string | undefined;

        if (thoughtMatch && thoughtMatch.length >= 3) {
          botThought = thoughtMatch[1].trim(); // Content inside <think>
          botText = thoughtMatch[2].trim();    // Content after </think>
        }

        const botMessage: ChatMessage = {
          type: 'bot',
          text: botText
        };

        if (botThought) {
          botMessage.thought = botThought;
          botMessage.showThought = false; // Thought is hidden by default
        }

        this.messages.push(botMessage); // Add bot's response
        this.isBotThinking = false; // Hide "Bot is thinking" indicator
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: (err) => {
        console.error("Error asking product bot:", err);
        this.messages.push({ type: 'bot', text: "Sorry, I couldn't get an answer right now. Please try again later." });
        this.isBotThinking = false; // Hide indicator even on error
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    });
  }

  /**
   * Toggles the visibility of the bot's thought process for a given message.
   * @param message The ChatMessage object whose thought visibility needs to be toggled.
   */
  toggleThought(message: ChatMessage): void {
    if (message.thought) { // Only toggle if a thought exists for this message
      message.showThought = !message.showThought;
      this.cdr.detectChanges(); // Trigger change detection to update UI
      if (message.showThought) {
        this.scrollToBottom(); // Scroll to bottom if thought content expands
      }
    }
  }

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        const chatMessagesElement = document.querySelector('.ai-bot-chat-messages');
        if (chatMessagesElement) {
          chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
        }
      }, 100); // Small delay to allow DOM to render
    } catch (err) {
      console.error('Could not scroll to bottom:', err);
    }
  }

}