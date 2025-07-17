import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadeInEgypt } from './made-in-egypt';

describe('MadeInEgypt', () => {
  let component: MadeInEgypt;
  let fixture: ComponentFixture<MadeInEgypt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MadeInEgypt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadeInEgypt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
