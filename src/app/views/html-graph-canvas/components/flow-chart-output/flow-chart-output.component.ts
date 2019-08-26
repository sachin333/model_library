import { Component, OnInit } from '@angular/core';
import { IFlowChartOutputElement, IFlowChartElement, IFlowChartInputElement } from '../IFlowChartElement';
import { FlowChartComponent } from '../flow-chart/flow-chart.component';
import { ConnectionHandlerUtil } from '../../utility/connection-handler.util';
import { SVGSelectionHandler } from 'src/app/views/svggraph-canvas/svg-selection-container';

@Component({
  selector: 'app-flow-chart-output',
  templateUrl: './flow-chart-output.component.html',
  styleUrls: ['./flow-chart-output.component.sass']
})
export class FlowChartOutputComponent extends FlowChartComponent<HTMLElement>
  implements OnInit, IFlowChartOutputElement<IFlowChartElement<HTMLElement>> {
  private parentAction: IFlowChartInputElement<HTMLElement>[];
  constructor(connector: ConnectionHandlerUtil) {
    super(connector);
  }

  ngOnInit() {
  }

  addParent(val: IFlowChartInputElement<HTMLElement>): boolean {
    this.parentAction = this.parentAction || [];

    if (this.parentAction.indexOf(val) < 0) {
      this.parentAction.push(val);
      return true;
    }
    return false;
  }
  removeParent(val: IFlowChartInputElement<HTMLElement>) {
    this.parentAction.splice(this.parentAction.indexOf(val), 1);
    // this.validateEquation();
  }
  getParentList(): IFlowChartInputElement<HTMLElement>[] {
    return (this.parentAction || []).slice(0);
  }

}
