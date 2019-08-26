import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, AfterContentInit, OnDestroy } from '@angular/core';
import { IFlowChartActionItem } from './action-item.model';
import { timer, Subscription } from 'rxjs';
import { ConnectorActionHandler } from '../action-utils/connector-action-handler';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
  selector: 'app-action-item',
  templateUrl: './action-item.component.html',
  styleUrls: ['./action-item.component.sass']
})
export class ActionItemComponent implements OnInit, AfterViewInit, OnDestroy {

  private _actionItem: IFlowChartActionItem;
  private _mouseDown = false;
  private _mouseDownX: number;
  private _mouseDownY: number;
  private _connectorHandler: Subscription;
  private _childAction: ActionItemComponent;
  private _parentAction: ActionItemComponent;
  private _boundingRect: DOMRect | ClientRect;

  @Input()
  public canvas: HTMLCanvasElement;

  @ViewChild('actionTtemElement')
  private _actionItemElement: ElementRef<HTMLDivElement>;

  boundaryElement: string | ElementRef<HTMLElement> | HTMLElement = '.drag-drop-canvas';
  dragDisabled = false;



  @Input('actionItem')
  set actionItem(val: IFlowChartActionItem) {
    this._actionItem = val;
  }

  get actionItem(): IFlowChartActionItem {
    return this._actionItem;
  }

  @Input('boundingRect')
  set boundingRect(val: DOMRect | ClientRect) {
    this._boundingRect = val;
  }


  get isMoving(): boolean {
    return this._mouseDown;
  }



  setChildAction = (action: ActionItemComponent) => {
    this._childAction = action;
    // this.drawConnector();
  }
  setParentAction = (action: ActionItemComponent) => {
    this._parentAction = action;
  }

  drawConnector = () => {

    if (!this.canvas || (!this._childAction && !this._parentAction))
      return;


    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d');
    let e: HTMLDivElement = this._actionItemElement.nativeElement;
    let child: HTMLDivElement;

    
    ctx.beginPath();

    if (this._childAction) {
      child = this._childAction._actionItemElement.nativeElement;

      ctx.moveTo( e.offsetLeft + (e.offsetWidth / 2) - this.canvas.offsetLeft, e.offsetTop + (e.offsetHeight) - this.canvas.offsetTop);
      ctx.lineTo(child.offsetLeft + (child.offsetWidth / 2) - this.canvas.offsetLeft, child.offsetTop - this.canvas.offsetTop);
    }

    if (this._parentAction) {
      child = e;
      e = this._parentAction._actionItemElement.nativeElement;

      ctx.moveTo(e.offsetLeft + (e.offsetWidth / 2) - this.canvas.offsetLeft, e.offsetTop + (e.offsetHeight) - this.canvas.offsetTop);
      ctx.lineTo(child.offsetLeft + (child.offsetWidth / 2) - this.canvas.offsetLeft, child.offsetTop - this.canvas.offsetTop);
    }
    

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

  }


  constructor(private connector: ConnectorActionHandler) {
    this._connectorHandler = connector.getHandler().subscribe((val) => this.dragDisabled = val);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.setCoordinates(this._actionItem.x, this._actionItem.y);
  }

  onMouseDown = (event: MouseEvent) => {

    if (this.dragDisabled) {
      //  console.log('source action', this._actionItem);
     // this.connector.setSourceAction(this);
      return;
    }
    this._mouseDownX = event.clientX;
    this._mouseDownY = event.clientY;
    this._mouseDown = true;
  }
  onMouseUp = (event: MouseEvent) => {
    //  console.log('dest action', this._actionItem);
    this.onMouseOut();

    if (this.dragDisabled) {
     // this.connector.setDestinationAction(this);
     // this.connector.tryConnect();
    }

  }

  onMouseOut = () => {
    this._mouseDown = false;
    this._mouseDownX = this._mouseDownY = 0;
  }
  onMouseMove = (event: MouseEvent) => {



    if (this._mouseDown) {
      const pos1 = this._mouseDownX - event.clientX;
      const pos2 = this._mouseDownY - event.clientY;
      this._mouseDownX = event.clientX;
      this._mouseDownY = event.clientY;

      const element = this._actionItemElement.nativeElement;
      const newX = element.offsetLeft - pos1;
      const newY = element.offsetTop - pos2;

      if (this._boundingRect) {
        if (newY < this._boundingRect.top
          || newY + element.offsetHeight > (this._boundingRect.top + this._boundingRect.height)
          || newX < this._boundingRect.left
          || newX + element.offsetWidth > (this._boundingRect.left + this._boundingRect.width)
        ) {
          return;
        }
      }

      this.setCoordinates(newX, newY);
    //  this.drawConnector();
    }
  }

  private setCoordinates(x: number, y: number): void {
    const element = this._actionItemElement.nativeElement;
    element.style.top = y + 'px';
    this._actionItem.y = y;

    element.style.left = x + 'px';
    this._actionItem.x = x;
  }

  ngOnDestroy() {
    this._connectorHandler.unsubscribe();
  }

}


export class IRect {
  top; left; width; height: number;
}
