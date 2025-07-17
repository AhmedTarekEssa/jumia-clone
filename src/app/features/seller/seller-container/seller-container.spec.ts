import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerContainer } from './seller-container';

describe('SellerContainer', () => {
  let component: SellerContainer;
  let fixture: ComponentFixture<SellerContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
