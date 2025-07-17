import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerProductEdit } from './seller-product-edit';

describe('SellerProductEdit', () => {
  let component: SellerProductEdit;
  let fixture: ComponentFixture<SellerProductEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerProductEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerProductEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
