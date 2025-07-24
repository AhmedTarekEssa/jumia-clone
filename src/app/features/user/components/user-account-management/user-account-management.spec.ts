import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountManagement } from './user-account-management';

describe('UserAccountManagement', () => {
  let component: UserAccountManagement;
  let fixture: ComponentFixture<UserAccountManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccountManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
