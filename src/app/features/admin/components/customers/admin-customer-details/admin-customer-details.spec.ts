import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomerDetails } from './admin-customer-details';

describe('AdminCustomerDetails', () => {
  let component: AdminCustomerDetails;
  let fixture: ComponentFixture<AdminCustomerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCustomerDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCustomerDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
