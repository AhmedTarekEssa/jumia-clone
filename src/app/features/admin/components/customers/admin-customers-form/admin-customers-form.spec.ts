import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomersForm } from './admin-customers-form';

describe('AdminCustomersForm', () => {
  let component: AdminCustomersForm;
  let fixture: ComponentFixture<AdminCustomersForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCustomersForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCustomersForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
