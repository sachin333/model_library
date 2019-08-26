import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowChartTreasuryInputComponent } from './flow-chart-treasury-input.component';

describe('FlowChartTreasuryInputComponent', () => {
  let component: FlowChartTreasuryInputComponent;
  let fixture: ComponentFixture<FlowChartTreasuryInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowChartTreasuryInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowChartTreasuryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
