import { Component, OnInit, ElementRef } from '@angular/core';
import { CanvasComponent } from 'src/app/views/svggraph-canvas/canvas-component.interface';
import { ComponentFactory, ComponentRef } from '@angular/core';

export abstract class GenericCanvasComponent implements OnInit, CanvasComponent {

  abstract getData(): import("../../../action-item/action-item.model").IFlowChartActionItem[];
  abstract setData(val: any[] | import("../../../action-item/action-item.model").IFlowChartActionItem[]);
  abstract clear();
  abstract remove(element: any | Element);

  getActionItemElement(ele: Element): import("../../../services/ActionItemElement").ActionItemElement {
    throw new Error("Method not implemented.");
  }

  constructor() { }

  ngOnInit() {
  }

}

export interface IComponentBuilderCanvas {
  createComponent<T>(compFactory: ComponentFactory<T>): ComponentRef<T>;
  remove<T>(element: T | Element);
  containerElement<T>(): ElementRef<T>;
}