import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountBanners } from './discount-banners';

describe('DiscountBanners', () => {
  let component: DiscountBanners;
  let fixture: ComponentFixture<DiscountBanners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountBanners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountBanners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
