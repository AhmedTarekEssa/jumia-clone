import { TestBed } from '@angular/core/testing';

import { OfficialStores } from './official-stores';

describe('OfficialStores', () => {
  let service: OfficialStores;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficialStores);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
