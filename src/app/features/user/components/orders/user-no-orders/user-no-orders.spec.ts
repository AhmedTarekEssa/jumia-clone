import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNoOrders } from './user-no-orders';

describe('UserNoOrders', () => {
  let component: UserNoOrders;
  let fixture: ComponentFixture<UserNoOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserNoOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserNoOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
