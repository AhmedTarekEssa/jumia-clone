import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductByBrand } from './product-by-brand';

describe('ProductByBrand', () => {
  let component: ProductByBrand;
  let fixture: ComponentFixture<ProductByBrand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductByBrand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductByBrand);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
