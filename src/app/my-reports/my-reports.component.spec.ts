import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyReports } from './my-reports.component';

describe('MyReportsComponent', () => {
  let component: MyReports;
  let fixture: ComponentFixture<MyReports>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReports ]
    })  
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyReports);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
