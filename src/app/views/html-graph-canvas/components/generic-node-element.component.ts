import { IFlowChartElement } from './IFlowChartElement';
import { Observable, Subject, AsyncSubject } from 'rxjs';
import { OnDestroy } from '@angular/core';

export abstract class GenericNodeElementComponent<T> implements IFlowChartElement<T>, OnDestroy {

  private destroyHandler: AsyncSubject<any>;
  private destroyObserver: Observable<any>;


  constructor() {
    this.destroyHandler = new AsyncSubject();
    this.destroyObserver = this.destroyHandler.asObservable();
  }

  abstract getId(): string;

  /*removeConnection(ele: T) {
    if (!ele) {
      return;
    }

    const childAction: IFlowChartChildElement<T> = this.getChildrenList().find((obj) => {
      return obj.pathElement === ele;
    });

    if (!childAction) {
      return;
    }

    this.removeChild(childAction.action.getId());
    childAction.action.removeParent(this);
  }*/


  abstract setX(x: number);
  abstract setY(y: number);
  abstract clickEvent(): Observable<any>;
  abstract dragEvent(): Observable<any>;
  abstract getBoundingRect(): ClientRect | DOMRect;
  destroyEvent(): Observable<any> {
    return this.destroyObserver;
  }
  ngOnDestroy() {
    this.destroyHandler.next(null);
    this.destroyHandler.complete();
  }
}
