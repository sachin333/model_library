import { Component, OnInit, ComponentFactoryResolver, ViewChild, ElementRef, ViewContainerRef, ComponentRef, Injector, ComponentFactory, AfterViewInit } from '@angular/core';
import { CanvasComponent } from '../svggraph-canvas/canvas-component.interface';
import { IFlowChartActionItem, ActionTypes, FlowChartActionInputItem } from '../action-item/action-item.model';
import { GenericCanvasComponent, IComponentBuilderCanvas } from './components/generic-canvas/generic-canvas.component';
import { GenericDragDropCanvasComponent } from './components/generic-drag-drop-canvas/generic-drag-drop-canvas.component';
import { Action } from 'rxjs/internal/scheduler/Action';
import { FlowChartInputComponent } from './components/flow-chart-input/flow-chart-input.component';
import { FlowChartComponent } from './components/flow-chart/flow-chart.component';
import { CommonUtil } from 'src/app/util/common-util';
import { FlowChartOutputComponent } from './components/flow-chart-output/flow-chart-output.component';
import { FlowChartTreasuryInputComponent } from './components/flow-chart-treasury-input/flow-chart-treasury-input.component';
import { FlowChartOperationComponent } from './components/flow-chart-operation/flow-chart-operation.component';
import { ConnectionHandlerUtil } from './utility/connection-handler.util';
import { SVGCanvasActionService } from '../svggraph-canvas/svgcanvas-action-service';
import { IFlowChartElement, IFlowChartInputElement, IFlowChartOutputElement } from './components/IFlowChartElement';
import { SVGSelectionHandler } from '../svggraph-canvas/svg-selection-container';
import { ConnectionHandlerHelper } from './utility/connection-handler.helper';


@Component({
  selector: 'app-html-graph-canvas',
  templateUrl: './html-graph-canvas.component.html',
  styleUrls: ['./html-graph-canvas.component.sass']
})
export class HtmlGraphCanvasComponent extends GenericDragDropCanvasComponent implements OnInit,
  IComponentBuilderCanvas, AfterViewInit {
  ngAfterViewInit(): void {
    this.connectionHelper = new ConnectionHandlerHelper(this.connector, this, this.compFactroy);
  }


  @ViewChild('graphCanvas', { read: ViewContainerRef })
  private dropContainer: ViewContainerRef;
  private componentMap: Map<string, ComponentRef<IFlowChartElement<HTMLElement>>>;
  private connectionHelper: ConnectionHandlerHelper;

  constructor(private compFactroy: ComponentFactoryResolver,
    private injector: Injector,
    private connector: ConnectionHandlerUtil,
    private canvasUtil: SVGCanvasActionService,
    private selectionHandler: SVGSelectionHandler) {
    super();
    this.componentMap = new Map();
    this.connector.getHandler().subscribe((val) => {
      this.dropAllowed = !val;
    });
    this.canvasUtil.setCanvasInstance(this);

  }

  handleDrop(dropType: import("../action-item/action-item.model").ActionTypes, x: number, y: number) {

    let compFactory;


    switch (dropType) {
      case ActionTypes.INPUT: {
        const component = FlowChartInputComponent;
        compFactory = this.compFactroy.resolveComponentFactory<FlowChartComponent<HTMLElement>>(component);
        break;
      }
      case ActionTypes.OUTPUT: {
        const component = FlowChartOutputComponent;
        compFactory = this.compFactroy.resolveComponentFactory<FlowChartComponent<HTMLElement>>(component);
        break;
      }
      case ActionTypes.TREASURY_INPUT: {
        const component = FlowChartTreasuryInputComponent;
        compFactory = this.compFactroy.resolveComponentFactory<FlowChartComponent<HTMLElement>>(component);
        break;
      }
      case ActionTypes.ACTION: {
        const component = FlowChartOperationComponent;
        compFactory = this.compFactroy.resolveComponentFactory<FlowChartComponent<HTMLElement>>(component);
        break;
      }

    }


    const compRef: ComponentRef<FlowChartComponent<HTMLElement>> = this.createComponent(compFactory);
    compRef.instance.setData(new FlowChartActionInputItem(x, y, CommonUtil.getUID()));
    this.componentMap.set(compRef.instance.getId(), compRef);

    compRef.instance.clickEvent().subscribe((val) => {

      if ((val instanceof FlowChartComponent)) {
        this.selectionHandler.selected = val.element.nativeElement;
      }

    });

    compRef.instance.mouseDownEvent().subscribe((val) => {
      if (this.connector.isActionStarted() && (val as IFlowChartInputElement<HTMLElement>)) {
        this.connector.setSourceAction((val as IFlowChartInputElement<HTMLElement>));
      }
    });
    compRef.instance.mouseUpEvent().subscribe((val) => {
      if (this.connector.isActionStarted() && (val as IFlowChartOutputElement<HTMLElement>)) {
        this.connector.setDestinationAction((val as IFlowChartOutputElement<HTMLElement>));
      }
    });
  }

  createComponent<T>(compFactory: ComponentFactory<T>): ComponentRef<T> {
    return this.dropContainer.createComponent(compFactory, 0, this.injector);
  }

  containerElement<T>(): ElementRef<T> {
    return new ElementRef<any>((this.dropContainer.element.nativeElement as HTMLElement).parentElement);
  }

  ngOnInit() {

  }

  getData(): IFlowChartActionItem[] {
    throw new Error("Method not implemented.");
  }
  setData(val: any[] | IFlowChartActionItem[]) {
    this.clear();
  }
  clear() {
    this.dropContainer.clear();
    this.componentMap.clear();
  }
  remove(element: Element) {
    this.componentMap.get(element.getAttribute('name')).hostView.destroy();
    this.componentMap.delete(element.getAttribute('name'));
  }

}
