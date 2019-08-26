import { IFlowChartOperationElement, IFlowChartElement, IFlowChartOutputElement, IFlowChartInputElement } from '../IFlowChartElement';
import { FlowChartInputComponent } from '../flow-chart-input/flow-chart-input.component';
import { FlowChartOutputComponent } from '../flow-chart-output/flow-chart-output.component';
import { FlowChartComponent } from '../flow-chart/flow-chart.component';

export abstract class AbstractFlowChatInputOperator extends FlowChartComponent<HTMLElement>
    implements IFlowChartOperationElement<IFlowChartInputElement<HTMLElement>, IFlowChartOutputElement<HTMLElement>> {


    operation: string;

    private inputOp: FlowChartInputComponent;
    private outputOp: FlowChartOutputComponent;

    abstract validateOperation();

    addChildren(val: IFlowChartOutputElement<HTMLElement>) {
        this.inputOp.addChildren(val);
    }
    removeChild(val: IFlowChartOutputElement<HTMLElement>): boolean {
        return this.inputOp.removeChild(val);
    }
    getChildrenList(): IFlowChartOutputElement<HTMLElement>[] {
        return this.inputOp.getChildrenList();
    }
    addParent(val: IFlowChartInputElement<HTMLElement>): boolean {
        return this.outputOp.addParent(val);
    }
    removeParent(val: IFlowChartInputElement<HTMLElement>) {
        this.outputOp.removeParent(val);
        this.validateOperation();
    }
    getParentList(): IFlowChartInputElement<HTMLElement>[] {
        return this.outputOp.getParentList();
    }



}