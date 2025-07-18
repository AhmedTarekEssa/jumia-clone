import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-main',
  imports: [],
  templateUrl: './footer-main.html',
  styleUrl: './footer-main.css'
})
export class FooterMain implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

 
  subscribeToNewsletter(email: string): void {
  
    console.log('Email subscribed:', email);
  }

  acceptTerms(event: any): void {
  
    console.log('Terms accepted:', event.target.checked);
  }
}
