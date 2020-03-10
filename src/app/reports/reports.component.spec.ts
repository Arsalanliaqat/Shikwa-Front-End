import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Reports } from './reports.component';

describe('ReportsComponent', () => {
  let component: Reports;
  let fixture: ComponentFixture<Reports>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Reports ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Reports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
