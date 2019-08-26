import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowChartOperationComponent } from './flow-chart-operation.component';

describe('FlowChartOperationComponent', () => {
  let component: FlowChartOperationComponent;
  let fixture: ComponentFixture<FlowChartOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowChartOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowChartOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
