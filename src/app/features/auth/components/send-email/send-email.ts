import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth';

@Component({
  standalone: true,
  selector: 'app-send-email',
  imports: [],
  templateUrl: './send-email.html',
  styleUrl: './send-email.css'
})
export class SendEmail {
  userEmail : string;
  sentEmail : string = '';

  private authService = inject(AuthService);
   constructor() {
                this.userEmail = '';
                this.init();
            }

            init() {
                // Get email from URL parameters or local storage
                this.userEmail = this.getEmailFromParams() || 'your email address';
                this.sentEmail = this.authService.tempEmail;
                this.updateEmailDisplay();
            }

            getEmailFromParams() {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get('email');
            }

            updateEmailDisplay() {
                const emailElement = document.getElementById('userEmail');
                if (emailElement && this.userEmail && this.userEmail !== 'your email address') {
                    emailElement.textContent = this.userEmail;
                }
            }

        

}
