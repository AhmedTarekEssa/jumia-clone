import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MegaSale } from './mega-sale';

describe('MegaSale', () => {
  let component: MegaSale;
  let fixture: ComponentFixture<MegaSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MegaSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MegaSale);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
