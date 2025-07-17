import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEssentials } from './all-essentials';

describe('AllEssentials', () => {
  let component: AllEssentials;
  let fixture: ComponentFixture<AllEssentials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEssentials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllEssentials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
