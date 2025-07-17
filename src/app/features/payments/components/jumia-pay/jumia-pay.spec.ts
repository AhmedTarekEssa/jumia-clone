import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JumiaPay } from './jumia-pay';

describe('JumiaPay', () => {
  let component: JumiaPay;
  let fixture: ComponentFixture<JumiaPay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JumiaPay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JumiaPay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
