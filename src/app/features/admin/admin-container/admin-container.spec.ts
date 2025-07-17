import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContainer } from './admin-container';

describe('AdminContainer', () => {
  let component: AdminContainer;
  let fixture: ComponentFixture<AdminContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
