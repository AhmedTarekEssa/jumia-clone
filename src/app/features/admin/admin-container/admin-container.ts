import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { AdminSidebar } from "../components/admin-sidebar/admin-sidebar";
import { AdminHeader } from "../components/admin-header/admin-header";
import { AdminSettings } from "../components/settings/admin-settings/admin-settings";
import { AdminStats } from "../components/stats/admin-stats/admin-stats";
import { AdminCategories } from "../components/categories/admin-categories/admin-categories";
import { AdminCustomers } from "../components/customers/admin-customers/admin-customers";
import { AdminProducts } from "../components/products/admin-products/admin-products";
import { AdminOrders } from "../components/orders/admin-orders/admin-orders";
import { Payments } from "../components/payments/payments";
import { AdminSellers } from "../components/sellers/admin-sellers/admin-sellers";
import { Activity } from "../components/activity/activity";
import { AdminReviews } from "../components/reviews/admin-reviews/admin-reviews";
import { Actions } from "../components/actions/actions";
import { AdminChat } from '../admin-chat/admin-chat';


@Component({
  standalone: true ,
  selector: 'app-admin-container',
  imports: [RouterOutlet, AdminSidebar, AdminHeader, AdminSettings, AdminStats, AdminCategories, AdminCustomers, AdminProducts, AdminOrders, Payments, AdminSellers, Activity, AdminReviews, Actions,AdminChat],
  templateUrl: './admin-container.html',
  styleUrl: './admin-container.css'
})
export class AdminContainer {

}
