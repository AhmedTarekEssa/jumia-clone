import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnPolicyBadge } from './return-policy-badge';

describe('ReturnPolicyBadge', () => {
  let component: ReturnPolicyBadge;
  let fixture: ComponentFixture<ReturnPolicyBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnPolicyBadge]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnPolicyBadge);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
