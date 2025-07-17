import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterPreferences } from './newsletter-preferences';

describe('NewsletterPreferences', () => {
  let component: NewsletterPreferences;
  let fixture: ComponentFixture<NewsletterPreferences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsletterPreferences]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsletterPreferences);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
