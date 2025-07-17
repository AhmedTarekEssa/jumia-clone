import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialStoresShowcase } from './official-stores-showcase';

describe('OfficialStoresShowcase', () => {
  let component: OfficialStoresShowcase;
  let fixture: ComponentFixture<OfficialStoresShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfficialStoresShowcase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfficialStoresShowcase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
