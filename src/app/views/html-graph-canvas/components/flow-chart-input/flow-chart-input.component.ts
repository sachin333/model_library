import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlowChartComponent } from '../flow-chart/flow-chart.component';
import { IFlowChartInputElement, IFlowChartOutputElement, FlowChartPathContainerElement } from '../IFlowChartElement';
import { ConnectionHandlerUtil } from '../../utility/connection-handler.util';
import { SVGSelectionHandler } from 'src/app/views/svggraph-canvas/svg-selection-container';

@Component({
  selector: 'app-flow-chart-input',
  templateUrl: './flow-chart-input.component.html',
  styleUrls: ['./flow-chart-input.component.sass']
})
export class FlowChartInputComponent extends FlowChartComponent<HTMLElement>
  implements OnInit, IFlowChartInputElement<HTMLElement> {


  private list: IFlowChartOutputElement<HTMLElement>[];

  constructor(connector: ConnectionHandlerUtil) {
    super(connector);
  }

  ngOnInit() {
  }

  addChildren(val: IFlowChartOutputElement<HTMLElement>) {
    this.list = this.list || [];
    this.list.push(val);
  }
  removeChild(val: IFlowChartOutputElement<HTMLElement>): boolean {
    //  const child: IFlowChartChildElement<T> = this.childrenMap.get(val);
    //  child.pathElement.parentElement.removeChild(child.pathElement);
    return !!this.list.splice(this.list.indexOf(val), 1);
  }
  getChildrenList(): IFlowChartOutputElement<HTMLElement>[] {
    return this.list.slice();
  }

}
