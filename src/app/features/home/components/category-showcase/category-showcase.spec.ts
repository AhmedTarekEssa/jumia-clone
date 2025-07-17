import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryShowcase } from './category-showcase';

describe('CategoryShowcase', () => {
  let component: CategoryShowcase;
  let fixture: ComponentFixture<CategoryShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryShowcase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryShowcase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
