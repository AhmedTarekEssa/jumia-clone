import { Routes } from '@angular/router';
import { CategoryContainer } from './category-container/category-container';
import { ProductList } from '../products/components/product-list/product-list';
import { ProductDetailC } from '../products/components/product-detail/product-detail';

// export const routes: Routes = [
//   {
//     path: '',
//     component: CategoryContainer,
//     children: [
//       { path: ':id', loadComponent: () => import('./components/category-list/category-list').then(m => m.CategoryList) },
//       // { path: ':id', loadComponent: () => import('./components/category-products/category-products').then(m => m.CategoryProducts) }
//     ]
//   },
//   { path: 'products', component: ProductList },
//   { path: 'products/:id', component: ProductDetailC }
//   ,{
//     path:'category-list/:id',
//     loadComponent: () => import('./components/category-list/category-list').then(m => m.CategoryList)
//   }
// ];
