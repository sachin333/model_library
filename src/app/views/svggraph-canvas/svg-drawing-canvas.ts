import { DragMoveHandler } from './svg-drag-move-handler';
import { ActionConnectorCanvas } from './action-connector-handler';
import { ConnectorActionHandler } from '../action-utils/connector-action-handler';
import { ActionComponentDragEvent, SVGComponentFactoryService } from '../services/svgcomponent-factory.service';
import { ActionItemElement } from '../services/ActionItemElement';
import { SVGSelectionHandler } from './svg-selection-container';

export class SVGDrawingCanvas extends ActionConnectorCanvas {

    private domMap: Map<string, ActionItemElement> = new Map();

    constructor(private params: ConnectorActionHandler,
        selectionHandler: SVGSelectionHandler) {
        super(params, selectionHandler);
        this.onDraggingEvent.subscribe((event: ActionComponentDragEvent) => {
            const actionObj: ActionItemElement = this.getDOMToActionObject(
                SVGComponentFactoryService.getActionContentElement(event.event.target as Element));
            actionObj.setX(event.newX);
            actionObj.setY(event.newY);
        });
    }
    protected getDOMToActionObject = (element: Element | HTMLElement): ActionItemElement => {
        return this.domMap.get(element.getAttribute('name'));
    }
    protected mapActionObject = (id: string, actionObject: ActionItemElement) => {
        this.domMap.set(id, actionObject);
    }
    protected getActionObject = (id: string): ActionItemElement => {
        return this.domMap.get(id);
    }
    protected removeActionObject = (id: string): boolean => {
        return this.domMap.delete(id);
    }
    protected clearActionMap() {
        this.domMap.clear();
    }
}