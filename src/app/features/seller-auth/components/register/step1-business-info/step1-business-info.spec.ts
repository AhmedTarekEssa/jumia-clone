import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step1BusinessInfo } from './step1-business-info';

describe('Step1BusinessInfo', () => {
  let component: Step1BusinessInfo;
  let fixture: ComponentFixture<Step1BusinessInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step1BusinessInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step1BusinessInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
