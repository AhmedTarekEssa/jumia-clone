import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOngoingDelivered } from './user-ongoing-delivered';

describe('UserOngoingDelivered', () => {
  let component: UserOngoingDelivered;
  let fixture: ComponentFixture<UserOngoingDelivered>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOngoingDelivered]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOngoingDelivered);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
