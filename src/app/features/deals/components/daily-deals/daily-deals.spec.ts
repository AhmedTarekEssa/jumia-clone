import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDeals } from './daily-deals';

describe('DailyDeals', () => {
  let component: DailyDeals;
  let fixture: ComponentFixture<DailyDeals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyDeals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyDeals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
