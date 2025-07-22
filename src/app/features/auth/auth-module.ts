import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './auth.routes';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,ReactiveFormsModule,FormsModule,RouterModule.forChild(routes)
  ]
})
export class AuthModule { }
