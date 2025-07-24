import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerWelcome } from './seller-welcome';

describe('SellerWelcome', () => {
  let component: SellerWelcome;
  let fixture: ComponentFixture<SellerWelcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerWelcome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerWelcome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
