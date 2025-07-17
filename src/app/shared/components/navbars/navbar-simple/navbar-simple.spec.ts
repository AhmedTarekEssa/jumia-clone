import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSimple } from './navbar-simple';

describe('NavbarSimple', () => {
  let component: NavbarSimple;
  let fixture: ComponentFixture<NavbarSimple>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarSimple]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarSimple);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
