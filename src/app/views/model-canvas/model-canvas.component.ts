import {
  Component, OnInit, ViewChild, ElementRef, ViewContainerRef, Inject, ComponentFactoryResolver, Input,
  AfterViewInit,
  ViewChildren,
  QueryList,
  DoCheck
} from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ActionItemComponent, IRect } from '../action-item/action-item.component';
import { IFlowChartActionItem, AsyncFlowChartActionItem } from '../action-item/action-item.model';
import { ConnectorActionHandler } from '../action-utils/connector-action-handler';
import { ThrowStmt } from '@angular/compiler';
import { Subscription } from 'rxjs';


/*@Component({
  selector: 'app-model-canvas',
  templateUrl: './model-canvas.component.html',
  styleUrls: ['./model-canvas.component.sass']
})*/
export class ModelCanvasComponent implements OnInit, AfterViewInit, DoCheck {

  private actionItems: IFlowChartActionItem[];
  private _connectorSubscription: Subscription;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isMouseDown: boolean;
  private mouseDownPageX: number;
  private mouseDownPageY: number;
  private mouseUpPageX: number;
  private mouseUpPageY: number;

  @ViewChildren(ActionItemComponent)
  private actionComponentList: QueryList<ActionItemComponent>;
  get boundingRect(): IRect {

    if (this.dropCanvas) {
      const rect: IRect = new IRect();
      rect.width = this.dropCanvas.nativeElement.getBoundingClientRect().width;
      rect.height = this.dropCanvas.nativeElement.getBoundingClientRect().height;
      rect.top = this.dropCanvas.nativeElement.offsetTop;
      rect.left = this.dropCanvas.nativeElement.offsetLeft;
      return rect;
    }
    return null;
  }

  constructor(private connector: ConnectorActionHandler) {

  }

  @ViewChild('dragDropCanvas')
  private dropCanvas: ElementRef<HTMLDivElement>;
  @ViewChild('canvasLayer')
  private canvasLayer: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
  }
  itemDropped = (event: DragEvent) => {
    event.stopPropagation();
    this.addActionItemComponent(event.pageX, event.pageY);
  }
  dragEnter = (event: DragEvent) => {
    event.dataTransfer.dropEffect = 'move';
    event.preventDefault();
    return false;
  }
  dragOver = (event: DragEvent) => {
    return false;
  }
  addActionItemComponent = (x: number, y: number) => {
    this.actionItems = this.actionItems || [];
    this.actionItems.push(new AsyncFlowChartActionItem(x, y,null));
  }


  onMouseDown = (event: MouseEvent) => {

    if (!this.connector.isActionStarted()) {
      return;
    }


    this.mouseDownPageX = event.pageX - this.canvas.offsetLeft;
    this.mouseDownPageY = event.pageY - this.canvas.offsetTop;

    this.isMouseDown = true;


    //  this.updatePosition(event);
    // this.currentTargetArrow = document.createElement('div');
    // this.currentTargetArrow.classList.add('arrow-item');

    // this.currentTargetArrow.style.left = this.mouseDownPageX + 'px';
    // this.currentTargetArrow.style.top = this.mouseDownPageY + 'px';



    // this.dropCanvas.nativeElement.appendChild(this.currentTargetArrow);
  }
  onMouseUp = (event: MouseEvent) => {
    this.isMouseDown = false;
  }

  onMouseOut = (event: MouseEvent) => {
    this.isMouseDown = false;
  }
  onMouseMove = (event: MouseEvent) => {

    if (this.connector.isActionStarted() && this.isMouseDown) {



      //this.updatePosition(event);

      this.mouseUpPageX = event.pageX;
      this.mouseUpPageY = event.pageY - this.canvas.offsetTop;
      this.drawLine();
    }
  }

  updatePosition(event: MouseEvent) {
    this.mouseDownPageX = this.mouseUpPageX;
    this.mouseDownPageY = this.mouseUpPageY;

    this.mouseUpPageX = event.pageX - this.canvas.offsetLeft;
    this.mouseUpPageY = event.pageY - this.canvas.offsetTop;

  }

  drawLine() {
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.redrawConnectors();
    this.ctx.beginPath();
    this.ctx.moveTo(this.mouseDownPageX, this.mouseDownPageY);
    this.ctx.lineTo(this.mouseUpPageX, this.mouseUpPageY);
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  redrawConnectors = () => {

    try {

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.actionComponentList.forEach((item) => {
        item.drawConnector();
      });
    } catch (err) {
      console.log(err);
    }
  }

  ngDoCheck() {
    if (!this.connector.isActionStarted())
      this.redrawConnectors();
  }

  ngAfterViewInit() {
    this.canvas = this.canvasLayer.nativeElement;
    this.ctx = this.canvas.getContext('2d');

  }

}
