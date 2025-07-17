import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartNow } from './start-now';

describe('StartNow', () => {
  let component: StartNow;
  let fixture: ComponentFixture<StartNow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartNow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartNow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
