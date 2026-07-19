import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPortal } from './user-portal';

describe('UserPortal', () => {
  let component: UserPortal;
  let fixture: ComponentFixture<UserPortal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPortal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPortal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
