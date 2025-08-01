import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-get-started',
  imports: [],
  templateUrl: './get-started.html',
  styleUrl: './get-started.css'
})
export class GetStarted implements OnInit{

  timeLeft: number = 3;
  timerId: any;
  userRole: string = 'none';
  sellerAuth: string = 'none';

  constructor(private cookieService: CookieService, private router: Router) {}



  ngOnInit(): void {
    // this.startCountdown();
  }

  // startCountdown() : void {
  //   this.timerId = setInterval( () => {
  //     this.timeLeft--;

  //     if(this.timeLeft <= 0){
  //       clearInterval(this.timerId);
  //       this.getStarted();
  //     }
  //   }, 1000);
  // }

  getStarted() : void{
    const userInfoCookie = this.cookieService.get('UserInfo');

    if (userInfoCookie) {
      try {
        const decodedCookie = decodeURIComponent(userInfoCookie);
        const userInfo = JSON.parse(decodedCookie);
        this.userRole = userInfo.UserRole?.toLowerCase() || 'none';
      } catch (e) {
        console.error('Error parsing user info cookie', e);
      }
    }
    if (this.userRole.toLocaleLowerCase() === 'customer') this.router.navigate(['/home']);
    else if (this.userRole.toLocaleLowerCase() === 'seller') this.router.navigate(['/seller']);

  }
}
