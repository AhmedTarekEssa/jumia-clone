import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupStations } from './pickup-stations';

describe('PickupStations', () => {
  let component: PickupStations;
  let fixture: ComponentFixture<PickupStations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickupStations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickupStations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
