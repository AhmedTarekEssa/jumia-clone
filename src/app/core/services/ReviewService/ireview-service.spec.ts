import { TestBed } from '@angular/core/testing';

import { IReviewService } from './ireview-service';

describe('IReviewService', () => {
  let service: IReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
