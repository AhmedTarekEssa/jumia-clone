import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-started',
  imports: [],
  templateUrl: './get-started.html',
  styleUrl: './get-started.css'
})
export class GetStarted implements OnInit{

  timeLeft: number = 3;
  timerId: any;

  constructor(private router: Router){}

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
    this.router.navigate(['/home']);

  }
}
