import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowChartInputComponent } from './flow-chart-input.component';

describe('FlowChartInputComponent', () => {
  let component: FlowChartInputComponent;
  let fixture: ComponentFixture<FlowChartInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowChartInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowChartInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
