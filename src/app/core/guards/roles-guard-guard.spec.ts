import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { rolesGuardGuard } from './roles-guard-guard';

describe('rolesGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rolesGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
