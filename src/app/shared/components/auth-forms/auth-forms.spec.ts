import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthForms } from './auth-forms';

describe('AuthForms', () => {
  let component: AuthForms;
  let fixture: ComponentFixture<AuthForms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthForms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthForms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
