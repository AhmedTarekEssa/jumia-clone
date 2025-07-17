import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAndDelivery } from './shipping-and-delivery';

describe('ShippingAndDelivery', () => {
  let component: ShippingAndDelivery;
  let fixture: ComponentFixture<ShippingAndDelivery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingAndDelivery]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingAndDelivery);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
