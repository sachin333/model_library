import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowChartOutputComponent } from './flow-chart-output.component';

describe('FlowChartOutputComponent', () => {
  let component: FlowChartOutputComponent;
  let fixture: ComponentFixture<FlowChartOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowChartOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowChartOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
