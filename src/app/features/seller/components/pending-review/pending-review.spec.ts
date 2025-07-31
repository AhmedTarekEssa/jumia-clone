import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingReview } from './pending-review';

describe('PendingReview', () => {
  let component: PendingReview;
  let fixture: ComponentFixture<PendingReview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingReview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingReview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
