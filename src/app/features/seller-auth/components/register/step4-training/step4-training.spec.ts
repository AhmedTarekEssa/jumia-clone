import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step4Training } from './step4-training';

describe('Step4Training', () => {
  let component: Step4Training;
  let fixture: ComponentFixture<Step4Training>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step4Training]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step4Training);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
