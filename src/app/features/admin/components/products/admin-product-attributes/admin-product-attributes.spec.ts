import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductAttributes } from './admin-product-attributes';

describe('AdminProductAttributes', () => {
  let component: AdminProductAttributes;
  let fixture: ComponentFixture<AdminProductAttributes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductAttributes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductAttributes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
