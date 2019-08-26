import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowChartConnectorComponent } from './flow-chart-connector.component';

describe('FlowChartConnectorComponent', () => {
  let component: FlowChartConnectorComponent;
  let fixture: ComponentFixture<FlowChartConnectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowChartConnectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowChartConnectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
