import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrAdmin } from './hr-admin';

describe('HrAdmin', () => {
  let component: HrAdmin;
  let fixture: ComponentFixture<HrAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HrAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
