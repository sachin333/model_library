import { Component, OnInit, ElementRef } from '@angular/core';
import { FlowChartInputComponent } from '../flow-chart-input/flow-chart-input.component';
import { ConnectionHandlerUtil } from '../../utility/connection-handler.util';
import { SVGSelectionHandler } from 'src/app/views/svggraph-canvas/svg-selection-container';

@Component({
  selector: 'app-flow-chart-treasury-input',
  templateUrl: './flow-chart-treasury-input.component.html',
  styleUrls: ['./flow-chart-treasury-input.component.sass']
})
export class FlowChartTreasuryInputComponent extends FlowChartInputComponent implements OnInit {

  constructor(connector: ConnectionHandlerUtil) {
    super(connector);
  }

  ngOnInit() {
  }

}
