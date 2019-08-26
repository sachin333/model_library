import { Injectable } from '@angular/core';
import { ActionTypes, IFlowChartActionItem, AsyncFlowChartActionItem } from '../action-item/action-item.model';
import { fromEvent, interval, asyncScheduler } from 'rxjs';
import { count, take, bufferCount, bufferTime, throttleTime } from 'rxjs/operators';
import { delay } from 'q';

@Injectable({
  providedIn: 'root'
})
export class SVGComponentFactoryService {


  private static readonly SVG_NAME_SPACE = 'http://www.w3.org/2000/svg';

  public static getActionContentElement(ele: Element): Element {
    try {
      if (ele.classList.contains('svg-action-item-content')) {
        return ele;
      }

      return ele.classList.contains('svg-action-item') ? ele.parentElement :
        SVGComponentFactoryService.getActionContentElement(ele.parentElement);
    } catch (err) { }
    return null;
  }
  public static getAllActionItemContent(svgCanvasElement: SVGElement) {
    return svgCanvasElement.querySelectorAll('.svg-action-item-content');
  }


  constructor() { }

  getActionItem = (val: IFlowChartActionItem): SVGGElement => {

    let shape: SVGGraphicsElement;
    shape = this.createRect();

    shape.setAttribute('rx', '5px');
    shape.setAttribute('ry', '5px');
    shape.setAttribute('fill', 'green');
    shape.setAttribute('stroke', 'black');
    shape.setAttribute('stroke-width', '1px');
    shape.setAttribute('height', '50px');
    shape.setAttribute('width', '100px');


    switch (val.type) {

      case ActionTypes.INPUT: {
        shape.classList.add('input-action');
        shape.setAttribute('rx', '50%');
        shape.setAttribute('ry', '50%');
        shape.setAttribute('fill', 'rgb(0,138,179)');
        break;
      }
      case ActionTypes.TREASURY_INPUT: {
        shape.classList.add('treasury-input-action');
        shape.setAttribute('rx', '25');
        shape.setAttribute('ry', '25');
        shape.setAttribute('fill', 'rgb(255,207,137)');
        break;
      }
      case ActionTypes.OUTPUT: {
        shape.classList.add('output-action');
        shape.setAttribute('fill', 'rgb(65,164,65)');
        break;
      }
      case ActionTypes.ACTION: {
        shape.classList.add('action');
        shape.setAttribute('rx', '0');
        shape.setAttribute('ry', '0');
        shape.setAttribute('fill', 'rgb(192,192,192)');
        break;
      }
    }

    shape.setAttribute('x', val.x.toString());
    shape.setAttribute('y', val.y.toString());

    // shape.setAttribute('width', '100');
    // shape.setAttribute('height', '100');
    shape.classList.add('svg-action-item');
    shape.classList.add('svg-draggable-item');

    const g: SVGGElement = this.createG(val);
    g.classList.add('svg-action-item-content');
    // g.setAttribute('fill', 'grey');
    // g.setAttribute('stroke', 'white');

    // shape['obj'] = new ActionItemElement(shape, val);
    // shape.setAttribute('name', val.getId());

    // const svgE=this.createSVGElement('svg');
    // svgE.classList.add('shadow');
    // svgE.appendChild(shape);



    g.appendChild(shape);

    const forObj: SVGForeignObjectElement = this.createSVGElement('foreignObject') as SVGForeignObjectElement;
    g.appendChild(forObj);
    const divE = this.createElement('http://www.w3.org/1999/xhtml', 'div');
    divE.textContent = val.displayLabel;
    divE.classList.add('display-label');
    forObj.appendChild(divE);
    forObj.setAttribute('x', val.x.toString());
    forObj.setAttribute('y', val.y.toString());

    if (val instanceof AsyncFlowChartActionItem) {
      (val as AsyncFlowChartActionItem).onChangeEvent().subscribe((obj) => {
        divE.textContent = obj.displayLabel;
      });
    }

    /*fromEvent(divE, 'keyup').subscribe(() => {
      val.displayLabel = divE.textContent;
    });

    // ---- double click handler for editable label
    fromEvent(shape, 'mouseup').pipe(
      throttleTime(400, asyncScheduler, {
        leading: false,
        trailing: true
      }),
      bufferCount(2),
    ).subscribe((ele) => {
      divE.setAttribute('contenteditable', 'true');
      (divE as HTMLElement).focus();
    });*/


    return g;

  }



  private createRect = (): SVGRectElement => {
    return this.createSVGElement('rect') as SVGRectElement;
  }
  private createG = (val: IFlowChartActionItem): SVGGElement => {
    const element: SVGGElement = this.createSVGElement('g') as SVGGElement;
    return element;
  }
  private createSVGElement = (qualifiedName: string): SVGElement => {
    const rect = document.createElementNS(SVGComponentFactoryService.SVG_NAME_SPACE, qualifiedName);
    return rect;
  }
  private createElement = (nameSpace: string, qualifiedName: string): Element => {
    return document.createElementNS(nameSpace, qualifiedName);
  }
}


export class ActionComponentEvent {
  constructor(public readonly type: string, public readonly event: Event) { }
}
export class ActionComponentDragEvent extends ActionComponentEvent {
  constructor(public readonly type: string, public readonly event: Event, public newX: number, public newY: number) {
    super(type, event);
  }
}
