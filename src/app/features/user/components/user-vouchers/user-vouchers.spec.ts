import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserVouchers } from './user-vouchers';

describe('UserVouchers', () => {
  let component: UserVouchers;
  let fixture: ComponentFixture<UserVouchers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserVouchers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserVouchers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
