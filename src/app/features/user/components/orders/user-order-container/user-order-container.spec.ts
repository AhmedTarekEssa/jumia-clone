import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrderContainer } from './user-order-container';

describe('UserOrderContainer', () => {
  let component: UserOrderContainer;
  let fixture: ComponentFixture<UserOrderContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOrderContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOrderContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
