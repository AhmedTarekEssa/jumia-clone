import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedRequest } from './rejected-request';

describe('RejectedRequest', () => {
  let component: RejectedRequest;
  let fixture: ComponentFixture<RejectedRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
