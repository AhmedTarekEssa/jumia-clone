import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartEmpty } from './cart-empty';

describe('CartEmpty', () => {
  let component: CartEmpty;
  let fixture: ComponentFixture<CartEmpty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartEmpty]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartEmpty);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
