import { Component, OnInit } from '@angular/core';
import { IFlowChartInputElement, IFlowChartOutputElement, IFlowChartOperationElement } from '../IFlowChartElement';
import { FlowChartInputComponent } from '../flow-chart-input/flow-chart-input.component';
import { FlowChartOutputComponent } from '../flow-chart-output/flow-chart-output.component';
import { FlowChartComponent } from '../flow-chart/flow-chart.component';
import { AbstractFlowChatInputOperator } from './abstract-flow-chart-operator';
import { ConnectionHandlerUtil } from '../../utility/connection-handler.util';
import { SVGSelectionHandler } from 'src/app/views/svggraph-canvas/svg-selection-container';

@Component({
  selector: 'app-flow-chart-operation',
  templateUrl: './flow-chart-operation.component.html',
  styleUrls: ['./flow-chart-operation.component.sass']
})
export class FlowChartOperationComponent extends AbstractFlowChatInputOperator
  implements OnInit {

  operation: string;


  private input: FlowChartInputComponent;
  private output: FlowChartOutputComponent;

  addChildren(val: IFlowChartOutputElement<HTMLElement>) {
    this.input.addChildren(val);
  }
  removeChild(val: IFlowChartOutputElement<HTMLElement>): boolean {
    return this.input.removeChild(val);
  }
  getChildrenList(): IFlowChartOutputElement<HTMLElement>[] {
    return this.input.getChildrenList();
  }
  addParent(val: IFlowChartInputElement<HTMLElement>): boolean {
    return this.output.addParent(val);
  }
  removeParent(val: IFlowChartInputElement<HTMLElement>) {
    this.output.removeParent(val);
  }
  getParentList(): IFlowChartInputElement<HTMLElement>[] {
    return this.output.getParentList();
  }

  validateOperation() {
    throw new Error("Method not implemented.");
  }
  constructor(connector: ConnectionHandlerUtil) {
    super(connector);
    this.input = new FlowChartInputComponent(connector);
    this.output = new FlowChartOutputComponent(connector);
  }

  ngOnInit() {
  }

}
