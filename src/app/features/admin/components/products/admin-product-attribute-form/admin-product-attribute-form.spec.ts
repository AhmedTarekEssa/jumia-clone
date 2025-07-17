import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductAttributeForm } from './admin-product-attribute-form';

describe('AdminProductAttributeForm', () => {
  let component: AdminProductAttributeForm;
  let fixture: ComponentFixture<AdminProductAttributeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductAttributeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductAttributeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
