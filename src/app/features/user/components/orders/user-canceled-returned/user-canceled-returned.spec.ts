import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCanceledReturned } from './user-canceled-returned';

describe('UserCanceledReturned', () => {
  let component: UserCanceledReturned;
  let fixture: ComponentFixture<UserCanceledReturned>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCanceledReturned]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCanceledReturned);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
