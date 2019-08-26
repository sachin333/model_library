import { IFlowChartActionItem, ActionTypes } from '../action-item/action-item.model';
import { ActionItemElement } from '../services/ActionItemElement';

export interface CanvasComponent {
    getData(): IFlowChartActionItem[];
    setData(val: IFlowChartActionItem[] | any[]);
    clear();
    remove(element: any | Element);
    getActionItemElement(ele: Element): ActionItemElement;
}

export interface IDragDropCanvasComponent<T extends Event> {
    dragAllowed: boolean;
    dropAllowed: boolean;
    dragOver(event: T);
    dragEnter(event: T);
    onDrop(event: T);
    handleDrop(e: ActionTypes | string, x: number, y: number);
}