import { IEquationItem, EquationItemType } from './IEquationItem';

export class EquationItem implements IEquationItem {

    constructor(public readonly type: EquationItemType,
                public value: string,
                public label: string) { }
    toString() {
        return this.label;
    }
}