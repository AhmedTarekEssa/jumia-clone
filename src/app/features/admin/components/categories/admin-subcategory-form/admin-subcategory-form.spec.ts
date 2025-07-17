import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSubcategoryForm } from './admin-subcategory-form';

describe('AdminSubcategoryForm', () => {
  let component: AdminSubcategoryForm;
  let fixture: ComponentFixture<AdminSubcategoryForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSubcategoryForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSubcategoryForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
