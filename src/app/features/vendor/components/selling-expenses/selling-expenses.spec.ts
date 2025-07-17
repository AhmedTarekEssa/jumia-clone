import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingExpenses } from './selling-expenses';

describe('SellingExpenses', () => {
  let component: SellingExpenses;
  let fixture: ComponentFixture<SellingExpenses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellingExpenses]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellingExpenses);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
