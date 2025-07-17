import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreDetail } from './store-detail';

describe('StoreDetail', () => {
  let component: StoreDetail;
  let fixture: ComponentFixture<StoreDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
