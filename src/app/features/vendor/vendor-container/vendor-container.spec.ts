import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorContainer } from './vendor-container';

describe('VendorContainer', () => {
  let component: VendorContainer;
  let fixture: ComponentFixture<VendorContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
