import { Routes } from '@angular/router';
import { CategoryContainer } from './category-container/category-container';

export const routes: Routes = [
  {
    path: '',
    component: CategoryContainer,
    children: [
      { path: '', loadComponent: () => import('./components/category-list/category-list').then(m => m.CategoryList) },
      { path: ':id', loadComponent: () => import('./components/category-products/category-products').then(m => m.CategoryProducts) }
    ]
  }
];
