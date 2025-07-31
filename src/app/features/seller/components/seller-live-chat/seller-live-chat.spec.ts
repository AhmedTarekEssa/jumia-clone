import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerLiveChat } from './seller-live-chat';

describe('SellerLiveChat', () => {
  let component: SellerLiveChat;
  let fixture: ComponentFixture<SellerLiveChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerLiveChat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerLiveChat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
