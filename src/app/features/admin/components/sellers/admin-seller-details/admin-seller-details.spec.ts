import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSellerDetails } from './admin-seller-details';

describe('AdminSellerDetails', () => {
  let component: AdminSellerDetails;
  let fixture: ComponentFixture<AdminSellerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSellerDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSellerDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
