import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitReport } from './submit-report.component';

describe('SubmitReportComponent', () => {
  let component: SubmitReport;
  let fixture: ComponentFixture<SubmitReport>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitReport ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
