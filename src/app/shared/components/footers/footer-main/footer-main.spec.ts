import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterMain } from './footer-main';

describe('FooterMain', () => {
  let component: FooterMain;
  let fixture: ComponentFixture<FooterMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
