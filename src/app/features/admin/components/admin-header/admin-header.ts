import { Component, inject } from '@angular/core';
import { User } from '../../../../core/services/User-Service/user';

@Component({
  selector: 'app-admin-header',
  imports: [],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css'
})
export class AdminHeader {

  private adminServise = inject(User);
  

  
}
