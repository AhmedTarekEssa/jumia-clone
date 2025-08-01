import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [ngClass]="containerClass">
      <!-- Font Awesome CSS -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

      <!-- Spinner Loader -->
      <div *ngIf="type === 'spinner'" class="loading-wrapper">
        <div class="spinner-loader" [ngClass]="sizeClass">
          <div class="spinner-inner"></div>
        </div>
        <div *ngIf="showText" class="loading-text">{{ text }}</div>
      </div>

      <!-- Dots Loader -->
      <div *ngIf="type === 'dots'" class="loading-wrapper">
        <div class="dots-loader" [ngClass]="sizeClass">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <div *ngIf="showText" class="loading-text">{{ text }}</div>
      </div>

      <!-- Pulse Loader -->
      <div *ngIf="type === 'pulse'" class="loading-wrapper">
        <div class="pulse-loader" [ngClass]="sizeClass">
          <div class="pulse-circle"></div>
          <div class="pulse-circle"></div>
          <div class="pulse-circle"></div>
        </div>
        <div *ngIf="showText" class="loading-text">{{ text }}</div>
      </div>

      <!-- Wave Loader -->
      <div *ngIf="type === 'wave'" class="loading-wrapper">
        <div class="wave-loader" [ngClass]="sizeClass">
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
          <div class="wave-bar"></div>
        </div>
        <div *ngIf="showText" class="loading-text">{{ text }}</div>
      </div>

      <!-- Ring Loader -->
      <div *ngIf="type === 'ring'" class="loading-wrapper">
        <div class="ring-loader" [ngClass]="sizeClass">
          <div class="ring-inner"></div>
        </div>
        <div *ngIf="showText" class="loading-text">{{ text }}</div>
      </div>

      <!-- Jumia Branded Loader -->
      <div *ngIf="type === 'jumia'" class="loading-wrapper">
        <div class="jumia-loader" [ngClass]="sizeClass">
          <div class="jumia-box">
            <i class="fas fa-shopping-bag jumia-icon"></i>
          </div>
        </div>
        <div *ngIf="showText" class="loading-text jumia-text">{{ text }}</div>
      </div>

      <!-- Skeleton Loader -->
      <div *ngIf="type === 'skeleton'" class="skeleton-wrapper">
        <div class="skeleton-item skeleton-line-1"></div>
        <div class="skeleton-item skeleton-line-2"></div>
        <div class="skeleton-item skeleton-line-3"></div>
        <div class="skeleton-item skeleton-line-4"></div>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .loading-container.fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(5px);
      z-index: 9999;
    }

    .loading-container.overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.9);
      z-index: 100;
    }

    .loading-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .loading-text {
      color: #666;
      font-size: 16px;
      font-weight: 500;
      text-align: center;
    }

    .jumia-text {
      color: #ff6600;
      font-weight: 600;
    }

    /* Size Classes */
    .small { transform: scale(0.7); }
    .medium { transform: scale(1); }
    .large { transform: scale(1.3); }

    /* Spinner Loader */
    .spinner-loader {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #ff6600;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .spinner-inner {
      width: 30px;
      height: 30px;
      border: 3px solid transparent;
      border-top: 3px solid #ffab40;
      border-radius: 50%;
      margin: 7px;
      animation: spin 0.8s linear infinite reverse;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Dots Loader */
    .dots-loader {
      display: flex;
      gap: 8px;
    }

    .dot {
      width: 12px;
      height: 12px;
      background: #ff6600;
      border-radius: 50%;
      animation: dotPulse 1.4s ease-in-out infinite both;
    }

    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
    .dot:nth-child(3) { animation-delay: 0s; }

    @keyframes dotPulse {
      0%, 80%, 100% {
        transform: scale(0.6);
        opacity: 0.5;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Pulse Loader */
    .pulse-loader {
      position: relative;
      width: 60px;
      height: 60px;
    }

    .pulse-circle {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 2px solid #ff6600;
      border-radius: 50%;
      animation: pulse 2s ease-in-out infinite;
    }

    .pulse-circle:nth-child(1) { animation-delay: 0s; }
    .pulse-circle:nth-child(2) { animation-delay: 0.6s; }
    .pulse-circle:nth-child(3) { animation-delay: 1.2s; }

    @keyframes pulse {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 0;
      }
    }

    /* Wave Loader */
    .wave-loader {
      display: flex;
      gap: 4px;
      align-items: flex-end;
    }

    .wave-bar {
      width: 6px;
      height: 40px;
      background: linear-gradient(to top, #ff6600, #ffab40);
      border-radius: 3px;
      animation: wave 1s ease-in-out infinite;
    }

    .wave-bar:nth-child(1) { animation-delay: 0s; }
    .wave-bar:nth-child(2) { animation-delay: 0.1s; }
    .wave-bar:nth-child(3) { animation-delay: 0.2s; }
    .wave-bar:nth-child(4) { animation-delay: 0.3s; }
    .wave-bar:nth-child(5) { animation-delay: 0.4s; }

    @keyframes wave {
      0%, 40%, 100% {
        transform: scaleY(0.4);
      }
      20% {
        transform: scaleY(1);
      }
    }

    /* Ring Loader */
    .ring-loader {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 102, 0, 0.2);
      border-radius: 50%;
      position: relative;
      animation: rotate 1s linear infinite;
    }

    .ring-inner {
      position: absolute;
      top: -4px;
      left: -4px;
      width: 100%;
      height: 100%;
      border: 4px solid transparent;
      border-top: 4px solid #ff6600;
      border-radius: 50%;
    }

    @keyframes rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Jumia Branded Loader */
    .jumia-loader {
      position: relative;
    }

    .jumia-box {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #ff6600, #ff8c00);
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 30px rgba(255, 102, 0, 0.3);
      animation: jumiaFloat 2s ease-in-out infinite;
      position: relative;
      overflow: hidden;
    }

    .jumia-box::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 2s linear infinite;
    }

    .jumia-icon {
      color: white;
      font-size: 35px;
      z-index: 1;
      animation: iconBounce 1s ease-in-out infinite alternate;
    }

    @keyframes jumiaFloat {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-10px) rotate(5deg);
      }
    }

    @keyframes iconBounce {
      0% { transform: scale(1); }
      100% { transform: scale(1.1); }
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
      100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
    }

    /* Skeleton Loader */
    .skeleton-wrapper {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .skeleton-item {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton 1.5s ease-in-out infinite;
      border-radius: 4px;
      margin-bottom: 15px;
    }

    .skeleton-line-1 {
      height: 20px;
      width: 100%;
    }

    .skeleton-line-2 {
      height: 20px;
      width: 80%;
    }

    .skeleton-line-3 {
      height: 20px;
      width: 90%;
    }

    .skeleton-line-4 {
      height: 20px;
      width: 60%;
    }

    @keyframes skeleton {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .loading-container {
        min-height: 150px;
      }

      .loading-text {
        font-size: 14px;
      }

      .skeleton-wrapper {
        padding: 15px;
      }

      .jumia-box {
        width: 60px;
        height: 60px;
      }

      .jumia-icon {
        font-size: 25px;
      }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      .loading-container.fullscreen {
        background: rgba(0, 0, 0, 0.95);
      }

      .loading-container.overlay {
        background: rgba(0, 0, 0, 0.9);
      }

      .loading-text {
        color: #ccc;
      }

      .skeleton-item {
        background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%);
        background-size: 200% 100%;
      }
    }
  `]
})
export class Loading {
  @Input() type: 'spinner' | 'dots' | 'pulse' | 'wave' | 'ring' | 'jumia' | 'skeleton' = 'dots';
  @Input() size: 'small' | 'medium' | 'large' = 'large';
  @Input() text: string = 'Loading...';
  @Input() showText: boolean = true;
  @Input() fullscreen: boolean = false;
  @Input() overlay: boolean = false;

  get sizeClass(): string {
    return this.size;
  }

  get containerClass(): string {
    const classes = [];
    if (this.fullscreen) classes.push('fullscreen');
    if (this.overlay) classes.push('overlay');
    return classes.join(' ');
  }
}
