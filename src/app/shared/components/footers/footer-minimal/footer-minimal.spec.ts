import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterMinimal } from './footer-minimal';

describe('FooterMinimal', () => {
  let component: FooterMinimal;
  let fixture: ComponentFixture<FooterMinimal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterMinimal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterMinimal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
