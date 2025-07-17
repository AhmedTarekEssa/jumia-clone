import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSellersForm } from './admin-sellers-form';

describe('AdminSellersForm', () => {
  let component: AdminSellersForm;
  let fixture: ComponentFixture<AdminSellersForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSellersForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSellersForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
