import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input } from '@angular/core';
import { IFlowChartActionItem, ActionTypes, FlowChartInputBuilder } from '../action-item/action-item.model';
import { SVGComponentFactoryService } from '../services/svgcomponent-factory.service';
import { Observable, fromEvent } from 'rxjs';
import { DragMoveHandler } from './svg-drag-move-handler';
import { SVGDrawingCanvas } from './svg-drawing-canvas';
import { ConnectorActionHandler } from '../action-utils/connector-action-handler';
import { CanvasComponent } from './canvas-component.interface';
import { SVGCanvasActionService } from './svgcanvas-action-service';
import { CommonUtil } from 'src/app/util/common-util';
import { ActionItemElement } from '../services/ActionItemElement';
import { SVGSelectionHandler } from './svg-selection-container';
import { ActionConnectorCanvas } from './action-connector-handler';

@Component({
  selector: 'app-svggraph-canvas',
  templateUrl: './svggraph-canvas.component.html',
  styleUrls: ['./svggraph-canvas.component.sass']
})
export class SVGGraphCanvasComponent extends SVGDrawingCanvas implements OnInit, AfterViewInit, CanvasComponent {

  private actionItems: IFlowChartActionItem[];


  @ViewChild('svgCanvasElement')
  private svgCanvasElement: ElementRef<SVGGElement>;

  @ViewChild('svgCanvasContainer')
  private svgCanvasContainer: ElementRef<HTMLDivElement>;

  @ViewChild('canvas')
  private canvas: ElementRef<HTMLCanvasElement>;

  @Input('data')
  set data(val: any[]) {
    const dd: IFlowChartActionItem[] = (val || []).map<IFlowChartActionItem>((o) => {
      return FlowChartInputBuilder.build(o);
    });
    this.setData(dd);
  }

  private isPreviewOnly = false;

  @Input()
  set previewOnly(val: boolean) {
    this.isPreviewOnly = val;
  }


  constructor(private factory: SVGComponentFactoryService,
    connector: ConnectorActionHandler,
    private canvasService: SVGCanvasActionService,
    selectionHandler: SVGSelectionHandler) {
    super(connector, selectionHandler);

  }

  ngOnInit() {
    if (!this.isPreviewOnly) {
      this.canvasService.setCanvasInstance(this);
    }
    // this.addActionItemComponent(100, 100);
    // this.setBoundingRect(0, 0, 500, 500);
  }

  ngAfterViewInit() {
    this.setCanvasContainer(this.svgCanvasContainer.nativeElement);
    this.setSVGCanvas(this.svgCanvasElement.nativeElement);
    this.setBoundingRect(0, 0, this.svgCanvasContainer.nativeElement.offsetWidth,
      this.svgCanvasContainer.nativeElement.offsetHeight + 50);
  }

  itemDropped = (event: DragEvent) => {
    event.stopPropagation();
    const ele: HTMLElement = this.svgCanvasContainer.nativeElement;

    const newItem: Element = this.addNewActionItemComponent(event.pageX - ele.offsetLeft, event.pageY - ele.offsetTop,
      ActionTypes[event.dataTransfer.getData('ACTION_DROP_TYPE')]);

    this.selectionHandler.selected = newItem;
  }
  dragEnter = (event: DragEvent) => {
    event.dataTransfer.dropEffect = 'move';
    event.preventDefault();
    return false;
  }
  dragOver = (event: DragEvent) => {
    return false;
  }
  private addNewActionItemComponent = (x: number, y: number, type: ActionTypes): SVGElement => {
    return this.createActionItemComponent(FlowChartInputBuilder.build(
      { x, y, id: CommonUtil.getUID(), type: (type || ActionTypes.INPUT) }));
  }

  private createActionItemComponent = (actionItem: IFlowChartActionItem): SVGElement => {
    const e: SVGElement = this.factory.getActionItem(actionItem);

    this.mapActionObject(actionItem.getId(), new ActionItemElement(e, actionItem));
    e.setAttribute('name', actionItem.getId());

    this.setElementDragMove(e);
    this.selectionHandler.registerSelectableComponent(e);
    this.svgCanvasElement.nativeElement.appendChild(e);

    return e;
  }

  public getData = (): IFlowChartActionItem[] => {

    const outList: IFlowChartActionItem[] = [];

    const list: NodeList = SVGComponentFactoryService.getAllActionItemContent(this.svgCanvasElement.nativeElement);

    list.forEach((node: Element) => {
      // outList.push(node['obj'].getData());
      outList.push(this.getDOMToActionObject(node).getSerializationData());
    });
    // console.log(outList);
    // this.getImageData();
    return outList;
  }

  public getImageData = () => {
    const canvas: HTMLCanvasElement = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    const data = (new XMLSerializer()).serializeToString(this.svgCanvasElement.nativeElement.parentElement);
    const DOMURL = window.URL;

    // get the raw image from the DOM
    const img = new Image();
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = DOMURL.createObjectURL(svgBlob);
    const rect = this.svgCanvasElement.nativeElement.getBoundingClientRect();
    canvas.setAttribute('width',(rect.width+rect.left)+'');
    canvas.setAttribute('height',(rect.height+rect.top)+'');

    img.onload = () => {

      ctx.drawImage(img, 0, 0);
      // this.drawText2(ctx, 'Average\nAccounts', 60, 124, 100, 50, 12);
      const imgURI = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      console.log(imgURI);

      //const imgURI = window.btoa(data);
      //console.log(imgURI);

    };

    img.setAttribute('crossorigin', 'anonymous');
    img.src = url;

  }

  drawText(ctx, text, centerX, centerY, fontsize) {
    ctx.save();
    ctx.font = fontsize + "px Verdana"
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, centerY);
    ctx.restore();
  }
  drawText2(ctx, text, x, y, width, height, fontsize) {
    const arr = text.split('\n');
    const lineH = (height / arr.length) / 2;
    arr.forEach((val, index) => {
      this.drawText(ctx, val, x + (width / 2), y + lineH + (index * 12), fontsize);
    });
  }

  public setData = (val: IFlowChartActionItem[]) => {

    if (!val) {
      return;
    }

    if (this.isPreviewOnly) {
      this.svgCanvasElement.nativeElement.style.transform = 'scale(1)';
    }

    this.clear();

    val.forEach((obj) => {
      this.createActionItemComponent(obj);
    });

    const canvasElement: SVGGElement = this.getCanvasElement();

    val.forEach((obj: IFlowChartActionItem) => {

      if (!obj.childrenId) {
        return;
      }
      const parent = canvasElement.querySelector(`[name=${obj.getId()}]`);

      (obj.childrenId || []).forEach((childId) => {
        const child = canvasElement.querySelector(`[name=${childId}]`);
        if (child) {
          this.connect(this.getDOMToActionObject(parent), this.getDOMToActionObject(child));
        }
      });


    });



    if (this.isPreviewOnly) {
      this.svgCanvasElement.nativeElement.style.transform = 'scale(0.7)';

      const rect = this.svgCanvasContainer.nativeElement.getBoundingClientRect();
      const svgSize = this.svgCanvasElement.nativeElement.getBoundingClientRect();

      if (rect.height < svgSize.height) {
        this.svgCanvasContainer.nativeElement.style.height = `${svgSize.height + 20}px`;
      }
      if (rect.width < svgSize.width) {
        this.svgCanvasContainer.nativeElement.style.width = `${svgSize.width + 20}px`;
      }

    }

  }

  private getCanvasElement = (): SVGGElement => {
    return this.svgCanvasElement.nativeElement;
  }

  public clear = () => {
    const canvasElement: SVGGElement = this.getCanvasElement();
    while (canvasElement.childNodes.length !== 0) {
      canvasElement.removeChild(canvasElement.childNodes[0]);
    }
    this.clearActionMap();
    this.clearConnectionParentMap();
  }

  public remove(element: Element) {
    let actionItem: Element;
    actionItem = SVGComponentFactoryService.getActionContentElement(element);

    if (actionItem) {
      this.removeAction(actionItem);
    } else {
      actionItem = ActionConnectorCanvas.getConnector(element);
      if (actionItem) {
        this.removeConnection(actionItem);
      }

    }


  }

  public getActionItemElement(element: Element) {
    try {
      const actionItem: Element = SVGComponentFactoryService.getActionContentElement(element);
      return this.getActionObject(actionItem.getAttribute('name'));
    } catch (err) { }
    return null;
  }
  private removeAction = (element: Element) => {
    // console.log(element);
    const actionId = element.getAttribute('name');
    const obj: ActionItemElement = this.getActionObject(actionId);

    if (obj) {
      // remove reference from parent nodes
      obj.getParentList().forEach((parent) => {
        parent.removeChild(obj);
      });

      // remove reference from child nodes
      obj.getChildrenList().forEach((val) => {
        val.action.removeParent(obj);
        val.pathElement.parentElement.removeChild(val.pathElement);
        this.removeConnectionAction(val.pathElement);
      });
      // remove action svg element
      obj.getDom().parentElement.removeChild(obj.getDom());
    }
    this.removeActionObject(actionId);
  }

  private removeConnection = (element: Element) => {
    const action: ActionItemElement = this.getConnectionAction(element);

    const act2 = this.getDOMToActionObject(action.getDom());

    action.removeConnection(element);
    this.removeConnectionAction(element);

  }


}
