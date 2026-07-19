import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerPortal } from './owner-portal';

describe('OwnerPortal', () => {
  let component: OwnerPortal;
  let fixture: ComponentFixture<OwnerPortal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerPortal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerPortal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
