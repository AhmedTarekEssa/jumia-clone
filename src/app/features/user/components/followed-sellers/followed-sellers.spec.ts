import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedSellers } from './followed-sellers';

describe('FollowedSellers', () => {
  let component: FollowedSellers;
  let fixture: ComponentFixture<FollowedSellers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowedSellers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowedSellers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
