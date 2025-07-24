import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {Category} from '../../../shared/models/category-';
import { environment } from '../../../../environments/environment.development';
import { CategoryCreateUpdate } from '../../../shared/models/category-create-update';
import { CategoryDescendants } from '../../../shared/models/category-descendants';
import { MainCategory } from '../../../shared/models/main-category';
import { CategoryAttribute } from '../../../shared/models/category-attribute';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.BaseUrlPath}/Categories/`;

  constructor(private http: HttpClient) { }

  // Get all categories with subcategories
  getAllCategories(includeSubcategories: boolean = true): Observable<Category[]> {
    const params = new HttpParams()
      .set('includeSubcategories', includeSubcategories.toString());
    return this.http.get<Category[]>(this.apiUrl, { params });
  }

  // Get category by ID with subcategories
  getCategoryById(id: number, includeSubcategories: boolean = true): Observable<Category> {
    const params = new HttpParams()
      .set('includeSubcategories', includeSubcategories.toString());
    return this.http.get<Category>(`${this.apiUrl}${id}`, { params });
  }

  // Create new category
  createCategory(categoryData: CategoryCreateUpdate): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, categoryData);
  }

  // Update category
  updateCategory(id: number, categoryData: CategoryCreateUpdate): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}${id}`, categoryData);
  }

  // Delete category
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  // Get descendants
  getDescendants(id: number): Observable<number[]> {
    return this.http.get<CategoryDescendants>(`${this.apiUrl}${id}/descendants`)
      .pipe(map(response => response.ids));
  }

  // Get main categories
  getMainCategories(): Observable<MainCategory[]> {
    return this.http.get<MainCategory[]>(`${this.apiUrl}main`);
  }

  // Get attributes
  getAttributes(parentId: number): Observable<CategoryAttribute[]> {
    return this.http.get<CategoryAttribute[]>(`${this.apiUrl}${parentId}/attributes`)
  }
}
