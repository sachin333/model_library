import { fromEvent } from "rxjs";
import { IFlowChartConnectionElement } from '../components/IFlowChartConnectionElement';
import { ConnectionHandlerUtil } from './connection-handler.util';
import { ComponentFactoryResolver, Type, ComponentFactory, ComponentRef } from '@angular/core';
import { FlowChartConnectorComponent } from '../components/flow-chart-connector/flow-chart-connector.component';
import { IComponentBuilderCanvas } from '../components/generic-canvas/generic-canvas.component';

export class ConnectionHandlerHelper {
    private mouseDownPageX: number;
    private mouseDownPageY: number;
    private isMouseDown: boolean;
    private mouseUpPageX: number;
    private mouseUpPageY: number;
    private rect: ClientRect;
    private currentLineArrow: ComponentRef<IFlowChartConnectionElement>;


    constructor(readonly connnectionHandler: ConnectionHandlerUtil,
        readonly canvas: IComponentBuilderCanvas,
        private readonly componentFactory: ComponentFactoryResolver,
        readonly connector: Type<IFlowChartConnectionElement> = FlowChartConnectorComponent,
    ) {
        if (!connnectionHandler) {
            throw new Error('connection handler instance can not be null');
        }
        if (!canvas) {
            throw new Error('Canvas instance can not be null');
        }
        // fromEvent(canvas, 'mousedown');
        // fromEvent(canvas, 'mousemove');
        const ele = canvas.containerElement<Element>().nativeElement;
        fromEvent(ele, 'mousemove').subscribe(this.mouseMoveHandler);
      //  fromEvent(ele, 'mouseleave').subscribe(this.onCanvasMouseLeave);
        fromEvent(ele, 'mouseup').subscribe(this.onCanvasMouseUp);
        fromEvent(ele, 'mousedown').subscribe(this.onCanvasMouseDown);
        this.rect = (this.canvas.containerElement().nativeElement as HTMLElement).getBoundingClientRect();
    }
    private onCanvasMouseUp = (event: MouseEvent) => {
        this.isMouseDown = false;
        if (this.connnectionHandler.isActionStarted()) {
            this.connectActions(this.currentLineArrow);
        }
    }

    private onCanvasMouseLeave = (event: MouseEvent) => {
        this.isMouseDown = false;
        if (this.connnectionHandler.isActionStarted()) {
            this.connectActions(this.currentLineArrow);
        }
    }
    private mouseMoveHandler = (event: MouseEvent) => {
        if (this.connnectionHandler.isActionStarted() && this.isMouseDown) {
            this.mouseUpPageX = event.offsetX;
            this.mouseUpPageY = event.offsetY;
            this.drawConnectorArrow();
        }
    }

    private drawConnectorArrow() {

        this.currentLineArrow.instance.setRect(this.mouseDownPageX, this.mouseDownPageY + this.rect.top,
            this.mouseUpPageX - this.mouseDownPageX + 20, this.mouseUpPageY - this.mouseDownPageY + 20);
    }
    private onCanvasMouseDown = (event: MouseEvent) => {



        if (!this.connnectionHandler.isActionStarted()) {
            return;
        }

        const ele = this.canvas.containerElement<HTMLElement>().nativeElement;

        this.mouseDownPageX = event.pageX - ele.offsetLeft;
        this.mouseDownPageY = event.pageY - ele.offsetTop;

        this.isMouseDown = true;

        this.currentLineArrow = this.initiailizeConnector(this.mouseDownPageX, this.mouseDownPageY + this.rect.top, 1, 1);
    }

    private initiailizeConnector = (x: number, y: number, w: number, h: number): ComponentRef<IFlowChartConnectionElement> => {
        const comp: ComponentFactory<IFlowChartConnectionElement> =
            this.componentFactory.resolveComponentFactory<IFlowChartConnectionElement>(this.connector);

        const ref: ComponentRef<IFlowChartConnectionElement> = this.canvas.createComponent<IFlowChartConnectionElement>(comp);
        ref.instance.setRect(x, y, w, h);
        ref.instance.setComponentRef(ref);
        ref.instance.element.style.zIndex = '' + ref.instance.element.parentElement.childElementCount + 1;
        return ref;
    }

    private removeConnectorArrow = () => {
        this.currentLineArrow.destroy();
    }

    private connectActions = (currentLineArrow: ComponentRef<IFlowChartConnectionElement>) => {
        const val = this.connnectionHandler.tryConnect(this.currentLineArrow.instance);
        if (!val) {
            this.removeConnectorArrow();
        }
        /* const srcAction: ActionItemElement = this.connector.tryConnect(currentLineArrow);
 
         if (!srcAction) {
             this.removeConnectorArrow();
         } else {
             this.redrawPath(srcAction);
             this.connectorParentMap.set(currentLineArrow, srcAction);
             this.currentLineArrow = null;
         }*/
    }
}