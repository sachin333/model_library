import { IFlowChartActionItem } from '../../action-item/action-item.model';
import { Observable } from 'rxjs';
import { IFlowChartConnectionElement } from './IFlowChartConnectionElement';

export interface IFlowChartElement<T> {
    // getSerializationData(): IFlowChartActionItem;
    // data(): IFlowChartActionItem;
    setX(x: number);
    setY(y: number);
    getId(): string;
    clickEvent(): Observable<IFlowChartElement<T>>;
    dragEvent(): Observable<any>;
    getBoundingRect(): ClientRect | DOMRect;
    destroyEvent(): Observable<any>;
}


export interface IFlowChartInputElement<T> extends IFlowChartElement<T> {
    addChildren(val: IFlowChartOutputElement<T>);
    removeChild(val: IFlowChartOutputElement<T>): boolean;
    getChildrenList(): IFlowChartOutputElement<T>[];
    
    // removeConnection(ele: T);
}
export interface IFlowChartOutputElement<T> extends IFlowChartElement<T> {
    addParent(val: IFlowChartInputElement<T>): boolean;
    removeParent(val: IFlowChartInputElement<T>);
    getParentList(): IFlowChartInputElement<T>[];
   
}

export interface IFlowChartOperationElement<T, V> extends IFlowChartInputElement<T>, IFlowChartOutputElement<V> {
    operation: string;
    validateOperation();
}

export class FlowChartPathContainerElement {
    private list: Set<IFlowChartConnectionElement>;
    addPath = (val: IFlowChartConnectionElement) => {
        this.list.add(val);
    }
    destroyPath = (val: IFlowChartConnectionElement) => {
        val.remove();
        this.list.delete(val);
    }
    destroyAllPath = () => {

        this.list.forEach((val) => {
            try {
                val.remove();
            } catch (err) {
                console.log('[FlowChartPathContainerElement]', err);
            }
        });
        this.list.clear();
    }
}

/*
export interface IFlowChartChildElement<T> {
    action: IFlowChartElement<T>;
    pathElement: T;
}
*/