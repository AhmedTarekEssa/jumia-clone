import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopByBrand } from './shop-by-brand';

describe('ShopByBrand', () => {
  let component: ShopByBrand;
  let fixture: ComponentFixture<ShopByBrand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopByBrand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopByBrand);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
