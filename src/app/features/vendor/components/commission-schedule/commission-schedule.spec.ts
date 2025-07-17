import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionSchedule } from './commission-schedule';

describe('CommissionSchedule', () => {
  let component: CommissionSchedule;
  let fixture: ComponentFixture<CommissionSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissionSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
