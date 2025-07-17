import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step3Documents } from './step3-documents';

describe('Step3Documents', () => {
  let component: Step3Documents;
  let fixture: ComponentFixture<Step3Documents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step3Documents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step3Documents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
