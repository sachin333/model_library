import { IFlowChartElement, IFlowChartInputElement, IFlowChartOutputElement } from './IFlowChartElement';
import { ComponentRef } from '@angular/core';

export interface IFlowChartConnectionElement {
    parentNode: IFlowChartInputElement<any>;
    childNode: IFlowChartOutputElement<any>;
    element: HTMLElement;

    remove();
    setRect(x: number, y: number, width: number, height: number);
    redraw();
    setComponentRef(val: ComponentRef<IFlowChartConnectionElement>);
}