import { Injectable } from '@angular/core';
import { build$ } from 'protractor/built/element';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Observable, BehaviorSubject } from 'rxjs';

export class FlowChartActionItem implements IFlowChartActionItem {

    desc: string;

    constructor(public x: number, public y: number, private id: string,
        public readonly type: ActionTypes = ActionTypes.INPUT,
        public displayLabel: string = 'flowItem',
        public childrenId?: string[],
        public parentId?: string[]) {


    }


    public getId(): string {
        return this.id;
    }
}

export class AsyncFlowChartActionItem extends FlowChartActionItem implements IFlowChartAsyncActionItem {


    private readonly changeEvent: BehaviorSubject<IFlowChartActionItem>;
    private readonly onChangeEventObservable: Observable<IFlowChartActionItem>;

    constructor(public x: number, public y: number, id: string,
        public readonly type: ActionTypes = ActionTypes.INPUT,
        public displayLabel: string = 'flowItem',
        public childrenId?: string[],
        public parentId?: string[]) {

        super(x, y, id, type, displayLabel, childrenId, parentId);
        this.changeEvent = new BehaviorSubject(this);
        this.onChangeEventObservable = this.changeEvent.asObservable();
    }

    onChangeEvent(): Observable<IFlowChartActionItem> {
        return this.onChangeEventObservable;
    }

    dispatchChangeEvent() {
        this.changeEvent.next(this);
    }
}

export class FlowChartActionInputItem extends AsyncFlowChartActionItem implements IFlowChartInputItem {
    useGlobalValue: boolean;
    defaultValue: string;
    globalValue: string;
    readonly type: ActionTypes = ActionTypes.INPUT;
    displayLabel = 'Input';
}

export class FlowChartTreasuryInputItem extends FlowChartActionInputItem {
    readonly type: ActionTypes = ActionTypes.TREASURY_INPUT;
    displayLabel = 'Treasury Input';
}

export class AsyncEquationItem extends AsyncFlowChartActionItem implements IFlowChartOperationItem {
    public equation: string;
}

export class FlowChartActionOperationItem extends AsyncEquationItem {
    readonly type: ActionTypes = ActionTypes.ACTION;
    displayLabel = 'Operation';




}

export class FlowChartActionOutputItem extends AsyncEquationItem {
    readonly type: ActionTypes = ActionTypes.OUTPUT;
    displayLabel = 'Output';

}

export class SerializableFlowChartActionItem implements IFlowChartActionItem, IFlowChartInputItem, IFlowChartOperationItem {



    constructor(public readonly x: number, public readonly y: number, public readonly id: string,
        public readonly type: ActionTypes = ActionTypes.INPUT,
        public readonly displayLabel: string = 'flowItem',
        public readonly childrenId: string[],
        public readonly parentId: string[],
        public readonly desc: string,
        public readonly equation: string,
        public readonly defaultValue: string = null,
        public readonly useGlobalValue: boolean = null,
        public readonly globalValue: string = null) {


    }


    public getId(): string {
        return this.id;
    }
}
export class FlowChartInputBuilder {
    static build(val: any | { x, y, id, type: string | ActionTypes } | SerializableFlowChartActionItem):
        AsyncFlowChartActionItem | IFlowChartActionItem {
        let obj: IFlowChartActionItem | IFlowChartOperationItem;
        const type = val.type;
        const y = val.y;
        const x = val.x;
        const id = val.id;
        const serializableInstance = val as SerializableFlowChartActionItem;

        switch (type) {
            case ActionTypes.TREASURY_INPUT: {
                obj = new FlowChartTreasuryInputItem(x, y, id);
                break;
            }
            case ActionTypes.INPUT: {
                obj = new FlowChartActionInputItem(x, y, id);
                break;
            }
            case ActionTypes.ACTION: {
                obj = new FlowChartActionOperationItem(x, y, id);
                if (serializableInstance) {
                    try {
                        (obj as IFlowChartOperationItem).equation = serializableInstance.equation || null;
                    } catch (err) { }
                }
                break;
            }
            default: {
                obj = new FlowChartActionOutputItem(x, y, id);
                if (serializableInstance) {
                    try {
                        (obj as IFlowChartOperationItem).equation = serializableInstance.equation || null;
                    } catch (err) { }
                }
                break;
            }
        }


        if (serializableInstance) {
            obj.childrenId = serializableInstance.childrenId;
            obj.parentId = serializableInstance.parentId;
            obj.desc = serializableInstance.desc;
            obj.displayLabel = serializableInstance.displayLabel || obj.displayLabel;
        }

        if (type === ActionTypes.INPUT || type === ActionTypes.TREASURY_INPUT) {
            (obj as FlowChartActionInputItem).defaultValue = serializableInstance.defaultValue;
            (obj as FlowChartActionInputItem).useGlobalValue = serializableInstance.useGlobalValue;
            (obj as FlowChartActionInputItem).globalValue = serializableInstance.globalValue;
        }

        //   console.log(obj);

        return obj;
    }
}

export enum ActionTypes {
    INPUT = 'INPUT',
    TREASURY_INPUT = 'TREASURY_INPUT',
    ACTION = 'ACTION',
    OUTPUT = 'OUTPUT'
}

export interface IFlowChartInputItem {
    useGlobalValue: boolean;
    defaultValue: string;
    globalValue: string;
}

export interface IFlowChartOperationItem extends IFlowChartActionItem {
    equation: string;
}
export interface IFlowChartActionItem {
    x: number;
    y: number;
    displayLabel: string;
    type: ActionTypes;
    desc: string;
    childrenId?: string[];
    parentId?: string[];
    getId(): string;

}
export interface IFlowChartAsyncActionItem extends IFlowChartActionItem {
    onChangeEvent(): Observable<IFlowChartActionItem>;
    /**
     * dispatch change event,
     * need to be called manually
     */
    dispatchChangeEvent();
}