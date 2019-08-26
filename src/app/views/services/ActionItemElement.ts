import {
    IFlowChartOperationItem, IFlowChartActionItem, AsyncFlowChartActionItem,
    SerializableFlowChartActionItem,
    IFlowChartAsyncActionItem,
    FlowChartActionOperationItem
} from '../action-item/action-item.model';
import { IFlowChartInputElement, IFlowChartOutputElement } from '../html-graph-canvas/components/IFlowChartElement';

export class ActionItemElement {


    private parentAction: ActionItemElement[];
    private childrenMap: Map<string, ActionChildItem>;
    // private currentEquation: string;

    // public childAction: ActionItemElement;
    // public pathElement: SVGGElement;

    constructor(private readonly dom: Element,
        private readonly data: IFlowChartActionItem) {

    }

    public removeConnection(ele: Element) {

        if (!ele) {
            return;
        }

        const childAction: ActionChildItem = this.getChildrenList().find((obj) => {
            return obj.pathElement === ele;
        });

        if (!childAction) {
            return;
        }

        this.removeChild(childAction.action);
        childAction.action.removeParent(this);

    }

    public addChildren(val: ActionChildItem) {

        this.childrenMap = this.childrenMap || new Map();
        this.childrenMap.set(val.action.data.getId(), val);
    }

    public removeChild(val: ActionItemElement): boolean {
        const child: ActionChildItem = this.childrenMap.get(val.data.getId());
        child.pathElement.parentElement.removeChild(child.pathElement);
        return this.childrenMap.delete(val.data.getId());
    }
    public getChildrenList(): ActionChildItem[] {
        const arr = [];

        if (!this.childrenMap) {
            return arr;
        }

        const values = this.childrenMap.values();

        for (const value of values) {
            arr.push(value);
        }



        return arr;
    }

    /* public get equation(): string {
        /--* if (!this.currentEquation || this.currentEquation.trim().length === 0) {
             this.currentEquation = FormulaBuilderComponent.createFormula(this.getParentList());
         }*--/
         return this.currentEquation;
 }*/

    /*public set equation(val: string) {
        this.currentEquation = val;
    }*/

    public getDom = (): Element => {
        return this.dom;
    }


    public addParent(val: ActionItemElement): boolean {

        this.parentAction = this.parentAction || [];

        if (this.parentAction.indexOf(val) < 0) {
            this.parentAction.push(val);

            // this.validateEquation();

            return true;
        }
        return false;
    }

    private static readonly ID_REGEX: RegExp = /([a-zA-Z0-9]{4,}[_]{1}[1-9]{1})/g;
    protected validateEquation() {



        if (!(this.data as IFlowChartOperationItem).equation) {
            return;
        }

        const o: IFlowChartOperationItem = this.data as IFlowChartOperationItem;

        if (!o.equation || o.equation.trim().length === 0) {
            return;
        }
        const parentList = this.getParentList();

        if (!parentList || parentList.length === 0) {
            o.equation = null;
        }

        const regex = ActionItemElement.ID_REGEX;
        let m;



        while ((m = regex.exec(o.equation)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {

                if (!match) {
                    return;
                }

                if (groupIndex === 0) {

                    for (const parentItem of parentList) {
                        if (parentItem.getFlowChartActionItemData().getId() === match) {
                            return;
                        }
                    }
                    console.error('no match found', match, o.equation);
                    o.equation = null;

                    // this.equationItem.push(new EquationItem(EquationItemType.VALUE, match, inputLabelMap.get(match)));
                }
            });
        }
    }

    public removeParent(val: ActionItemElement) {
        /* if (this.data instanceof FlowChartActionOperationItem) {
             this.data.equation = null;
         }*/


        this.parentAction.splice(this.parentAction.indexOf(val), 1);
        this.validateEquation();
    }

    public getParentList(): ActionItemElement[] {
        return (this.parentAction || []).slice(0);
    }
    public getSerializationData(): IFlowChartActionItem {

        let outObject: IFlowChartActionItem = this.data;

        if ((this.data as IFlowChartAsyncActionItem).onChangeEvent) {
            outObject = new SerializableFlowChartActionItem(this.data.x, this.data.y,
                this.data.getId(), this.data.type, this.data.displayLabel,
                this.data.childrenId, this.data.parentId, this.data.desc,
                (this.data as IFlowChartOperationItem).equation ? (this.data as IFlowChartOperationItem).equation : null);
        }

        if (this.parentAction) {
            outObject.parentId = this.parentAction.map((obj) => {
                return obj.data.getId();
            });

        }

        if (this.childrenMap) {
            // this.data.childrenId = this.data.childrenId || [];
            // this.data.childrenId.length = 0;
            outObject.childrenId = this.getChildrenList().map((obj) => {
                return obj.action.data.getId();
            });
        }

        return outObject;
    }



    public getFlowChartActionItemData(): IFlowChartActionItem {
        return this.data;
    }

    public setX(x: number) {
        this.data.x = x;
    }
    public setY(y: number) {
        this.data.y = y;
    }
}
export enum ActionOperator {
    ADD, SUBSTRACT, MULTIPLY, DIVIDE, MIN, MAX, AVG, COUNT
}
export interface ActionChildItem {
    action: ActionItemElement;
    pathElement: SVGGElement;
  //  operator: ActionOperator;
}

