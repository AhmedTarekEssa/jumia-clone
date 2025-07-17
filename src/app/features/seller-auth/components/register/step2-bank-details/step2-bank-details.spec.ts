import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2BankDetails } from './step2-bank-details';

describe('Step2BankDetails', () => {
  let component: Step2BankDetails;
  let fixture: ComponentFixture<Step2BankDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step2BankDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step2BankDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
