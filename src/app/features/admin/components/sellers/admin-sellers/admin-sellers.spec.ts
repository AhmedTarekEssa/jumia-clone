import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSellers } from './admin-sellers';

describe('AdminSellers', () => {
  let component: AdminSellers;
  let fixture: ComponentFixture<AdminSellers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSellers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSellers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
