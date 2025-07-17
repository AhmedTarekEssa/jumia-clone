import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerSidebar } from './seller-sidebar';

describe('SellerSidebar', () => {
  let component: SellerSidebar;
  let fixture: ComponentFixture<SellerSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
