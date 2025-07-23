
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminSidebar } from "../admin-sidebar/admin-sidebar";
import { Actions } from "../actions/actions";
import { AdminStats } from "../stats/admin-stats/admin-stats";
import { Activity } from "../activity/activity";


@Component({
  standalone: true,
  selector: 'app-dashboard-component',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule, FormsModule, AdminSidebar, Actions, AdminStats, Activity]
})
export class DashboardComponent {
  
   
}