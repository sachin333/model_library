import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, EventEmitter, OnDestroy } from '@angular/core';
import { IFlowChartActionItem } from 'src/app/views/action-item/action-item.model';
import { ConnectionHandlerUtil } from '../../utility/connection-handler.util';
import { SVGSelectionHandler } from 'src/app/views/svggraph-canvas/svg-selection-container';
import { IFlowChartElement } from '../IFlowChartElement';
import { Observable, fromEvent } from 'rxjs';
import { GenericNodeElementComponent } from '../generic-node-element.component';

@Component({
  selector: 'app-flow-chart',
  templateUrl: './flow-chart.component.html',
  styleUrls: ['./flow-chart.component.sass']
})
export class FlowChartComponent<HTMLElement> extends GenericNodeElementComponent<HTMLElement>
  implements OnInit, AfterViewInit {
  



  @ViewChild('actionItem')
  protected elem: ElementRef<HTMLDivElement>;
  protected data: IFlowChartActionItem;
  protected dragDisabled = false;
  protected eventEmitter: EventEmitter<IFlowChartElement<HTMLElement>> = new EventEmitter();
  protected mouseDown: EventEmitter<IFlowChartElement<HTMLElement>> = new EventEmitter();
  protected mouseUp: EventEmitter<IFlowChartElement<HTMLElement>> = new EventEmitter();
  protected dragMove: EventEmitter<IFlowChartElement<HTMLElement>> = new EventEmitter();

  private onMouseUpObservable: Observable<IFlowChartElement<HTMLElement>>;
  private onMouseDownObservable: Observable<IFlowChartElement<HTMLElement>>;
  private onClickObservable: Observable<IFlowChartElement<HTMLElement>>;
  private onDragEventObservable: Observable<IFlowChartElement<HTMLElement>>;



  getElement(): Element {
    return this.elem.nativeElement;
  }

  get element(): ElementRef<HTMLDivElement> {
    return this.elem;
  }


  setData = (val: IFlowChartActionItem) => {
    this.data = val;
  }

  getId = (): string => {
    return this.data.getId();
  }

  constructor(private connector: ConnectionHandlerUtil) {
    super();
    this.connector.getHandler().subscribe((val) => {
      this.dragDisabled = val;
    });
    this.onClickObservable = this.eventEmitter.asObservable();
    this.onMouseDownObservable = this.mouseDown.asObservable();
    this.onMouseUpObservable = this.mouseUp.asObservable();
    this.onDragEventObservable = this.dragMove.asObservable();
  }


  ngAfterViewInit(): void {
    this.elem.nativeElement.style.transform = `translate3d(${this.data.x}px, ${this.data.y}px, 0px)`;
    this.elem.nativeElement.setAttribute('name', this.data.getId());
    fromEvent(this.elem.nativeElement, 'mousedown').subscribe(() => {
      this.mouseDown.emit(this);
    });
    fromEvent(this.elem.nativeElement, 'mouseup').subscribe(() => {
      this.mouseUp.emit(this);
    });
    /* fromEvent(this.elem.nativeElement, 'mousemove').subscribe(() => {
       this.mouseMove.emit(this);
     });*/
  }
  ngOnInit() {
  }
  setX(x: number) {
    this.data.x = x;
    this.ngAfterViewInit();
  }
  setY(y: number) {
    this.data.y = y;
    this.ngAfterViewInit();
  }
  clickEvent = (): Observable<IFlowChartElement<HTMLElement>> => {
    return this.onClickObservable;
  }
  mouseDownEvent = (): Observable<IFlowChartElement<HTMLElement>> => {
    return this.onMouseDownObservable;
  }
  mouseUpEvent = (): Observable<IFlowChartElement<HTMLElement>> => {
    return this.onMouseUpObservable;
  }
  dragEvent = (): Observable<IFlowChartElement<HTMLElement>> => {
    return this.onDragEventObservable;
  }

  onDragMoveHandler = (event) => {
    this.dragMove.emit(this);
  }

  protected onClickHandler($event) {
    this.eventEmitter.emit(this);
  }

  getBoundingRect(): ClientRect | DOMRect {
    return this.elem.nativeElement.getBoundingClientRect();
  }
}
