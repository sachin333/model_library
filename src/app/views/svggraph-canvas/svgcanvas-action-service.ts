import { CanvasComponent } from './canvas-component.interface';
import { Injectable } from '@angular/core';
import { IFlowChartActionItem } from '../action-item/action-item.model';
import { ActionItemElement } from '../services/ActionItemElement';

@Injectable({ providedIn: 'root' })
export class SVGCanvasActionService {

    private canvas: CanvasComponent;

    setCanvasInstance = (val: CanvasComponent) => {
        this.canvas = val;
    }
    get currentCanvasInstance(): CanvasComponent {
        return this.canvas;
    }
    public getData(): IFlowChartActionItem[] {
        return this.canvas.getData();
    }
    public setData(val: IFlowChartActionItem[] | any[]) {
        return this.canvas.setData(val);
    }
    public clear() {
        this.canvas.clear();
    }
    public remove(element: Element) {
        this.canvas.remove(element);
    }
    public getActionItemElement(ele: Element): ActionItemElement {
        return this.canvas.getActionItemElement(ele);
    }
}