import { TestBed } from '@angular/core/testing';

import { OrdersUser } from './orders-user';

describe('OrdersUser', () => {
  let service: OrdersUser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdersUser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
