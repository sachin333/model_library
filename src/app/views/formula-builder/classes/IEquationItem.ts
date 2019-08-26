export interface IEquationItem {
    label: string;
    readonly type: EquationItemType;
    value: string;
}
export enum EquationItemType {
    OPERATOR, VALUE, GROUP
}
