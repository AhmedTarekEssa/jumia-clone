import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerManageproducts } from './seller-manageproducts';

describe('SellerManageproducts', () => {
  let component: SellerManageproducts;
  let fixture: ComponentFixture<SellerManageproducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerManageproducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerManageproducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
