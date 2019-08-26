import { ConnectorActionHandler } from '../action-utils/connector-action-handler';
import { DragMoveHandler } from './svg-drag-move-handler';
import { SVGComponentFactoryService } from '../services/svgcomponent-factory.service';
import { SVGUtil } from '../../util/svg-util';
import { CommonUtil } from 'src/app/util/common-util';
import { ActionItemElement } from '../services/ActionItemElement';
import { SVGSelectionHandler } from './svg-selection-container';
import { fromEvent } from 'rxjs';

export abstract class ActionConnectorCanvas extends DragMoveHandler<SVGElement>{

    private mouseDownPageX: number;
    private mouseDownPageY: number;
    private isMouseDown: boolean;
    private mouseUpPageX: number;
    private mouseUpPageY: number;
    private canvasContainer: HTMLElement;
    private svgCanvas: SVGElement | SVGGElement;
    private currentLineArrow: SVGGElement;
    private connectorParentMap: Map<Element, ActionItemElement>;

    public static getConnector(element: Element): Element {
        try {
            if (element.classList.contains('action-connector')) {
                return element;
            } else {
                return ActionConnectorCanvas.getConnector(element.parentElement);
            }
        } catch (err) { }
        return null;
    }

    constructor(private connector: ConnectorActionHandler,
        protected selectionHandler: SVGSelectionHandler) {
        super();
        connector.getHandler().subscribe((val) => {
            this.disableDragMove = val;
            //   this.connectActions();
        });
        this.onElementMouseDownEvent.subscribe((event) => {
            if (connector.isActionStarted()) {
                //  connector.setSourceAction(event.obj);
                connector.setSourceAction(this.getDOMElementToActionObject(event.event.target as HTMLElement));
            }
        });
        this.onElementMouseUpEvent.subscribe((event) => {

            if (connector.isActionStarted()) {

                // connector.setDestinationAction(event.obj);
                connector.setDestinationAction(this.getDOMElementToActionObject(event.event.target as HTMLElement));
                this.connectActions(this.currentLineArrow);
            }
        });
        this.onDraggingEvent.subscribe((event) => {
            // event.obj.parentAction.redrawPath();
            // this.redrawPath(event.obj);
            this.redrawPath(this.getDOMElementToActionObject(event.event.target as HTMLElement));
        });
        this.connectorParentMap = new Map();
    }

    private getDOMElementToActionObject = (ele: Element): ActionItemElement => {
        return this.getDOMToActionObject(SVGComponentFactoryService.getActionContentElement(ele));
    }

    protected abstract getDOMToActionObject(element: Element): ActionItemElement;

    private redrawPath = (obj: ActionItemElement) => {

        const domElement: HTMLStyleElement = obj.getDom().querySelector('.svg-action-item');


        // if (obj.childAction) {
        const childList = obj.getChildrenList();

        childList.forEach((childAction) => {

            const rect: DOMRect | ClientRect = domElement.getBoundingClientRect();

            const w1 = rect.width;
            const h1 = rect.height;
            const x1 = parseInt(domElement.getAttribute('x'), 0);
            const y1 = parseInt(domElement.getAttribute('y'), 0);

            const childDomElement: HTMLStyleElement = childAction.action.getDom().querySelector('.svg-action-item');

            const childRect: DOMRect | ClientRect = childDomElement.getBoundingClientRect();

            const x2 = parseInt(childDomElement.getAttribute('x'), 0);
            const y2 = parseInt(childDomElement.getAttribute('y'), 0);
            const w2 = childRect.width;
            const h2 = childRect.height;

            const dim: Dimension = ActionConnectorCanvas.getArrowDimenstion(x1, y1, w1, h1, x2, y2, w2, h2);
            this.drawPath(dim.x1, dim.y1, dim.x2, dim.y2, childAction.pathElement.children.item(0) as SVGPathElement, dim.alignment);
            this.drawArrow(dim.x2, dim.y1 + dim.y2, childAction.pathElement.children.item(1) as SVGImageElement, dim.alignment);
        });

        // }
        if (obj.getParentList()) {
            obj.getParentList().forEach((val) => {
                this.redrawPath(val);
            });

        }
    }


    static getArrowDimenstion(x1: number, y1: number, w1: number, h1: number, x2: number,
        y2: number, w2: number, h2: number): Dimension {

        const obj: Dimension = new Dimension();
        obj.x1 = x1 + (w1 / 2);
        obj.y1 = y1 + h1;
        obj.x2 = x2 + (w2 / 2);
        obj.y2 = y2 - obj.y1;

        /*if (y2 < y1 + h1 + 20 && y2 > y1 && x2 > x1 + w1) {  // right-middle
            obj.x1 = x1 + w1;
            obj.y1 = y1 + (h1 / 2);
            obj.x2 = x2 + (w2 / 2);
            obj.y2 = y2 - obj.y1;
            obj.alignment = ALIGNMENT.RIGHT_MIDDLE;

        }*/

        if (((y2 < y1 + (h1 / 2) || y2 < y1 + h1 + 20) && x2 > x1 + h2)) { // right-top

            obj.x1 = x1 + w1;
            obj.y1 = y1 + (h1 / 2);
            obj.x2 = x2;
            obj.y2 = y2 + (h2 / 2) - obj.y1;
            obj.alignment = ALIGNMENT.RIGHT_RANGE;

        } else if ((((y2 < y1 + (h1 / 2)) || y2 < y1 + h1 + 20) && x2 + h2 < x1)) { // left top
            obj.x1 = x1;
            obj.y1 = y1 + (h1 / 2);
            obj.x2 = x2 + w2;
            obj.y2 = y2 + (h2 / 2) - obj.y1;
            obj.alignment = ALIGNMENT.LEFT_RANGE;

        } /*else if (y2 < y1 + h1 + 20 && x2 + h2 < x1) {  // left-middle
            obj.x1 = x1;
            obj.y1 = y1 + (h1 / 2);
            obj.x2 = x2 + w2;
            obj.y2 = y2 + (h2 / 2) - obj.y1;
            obj.alignment = ALIGNMENT.LEFT_RANGE;

        }*/ else if (y1 > (y2 + h2 + 20) && (x1 + w1 > (x2 - 20) || x1 < (x2 + w2 + 20))) { // top_range

            obj.x1 = x1 + (w1 / 2);
            obj.y1 = y1;
            obj.x2 = x2 + (w2 / 2);
            obj.y2 = y2 - y1 + h2;
            obj.alignment = ALIGNMENT.TOP_RANGE;

        }
        // Eest_North
        if ((y2 + h2) > (y1 - 20) && (y2 + h2) < y1 + (h1 / 2) && x1 < (x2 + w2 + 20) && x1 > x2 && (x2 + w2 - (x1 + (w1 / 2))) < -20) {
            obj.x1 = x1 + (w1 / 2);
            obj.y1 = y1;
            obj.y2 = y2 + (h2 / 2) - y1;
        } else

            //        West_North
            if ((y2 + h2) > (y1 - 20) && (y2 + h2) < y1 + (h1 / 2) && x2 < (x1 + w1 + 20) && x2 > x1 && (x1 + w1 - (x2 + (w2 / 2))) < -20) {
                obj.x1 = x1 + (w1 / 2);
                obj.y1 = y1;
                obj.y2 = y2 + (h2 / 2) - y1;
            } else
                //EAST_SOUTH
                if ((y1 + h1) > (y2 - 20) && (y1 + h1) < y2 + (h2 / 2) && x1 < (x2 + w2 + 20) && x1 > x2 && (x2 + w2 - (x1 + (w1 / 2))) < -20) {
                    obj.x1 = x1 + (w1 / 2);
                    obj.y1 = y1 + h1;
                    obj.y2 = y2 + (h2 / 2) - (y1 + h1);
                } else
                    //WEST_SOUTH
                    if ((y1 + h1) > (y2 - 20) && (y1 + h1) < y2 + (h2 / 2) && x2 > x1 && (x1 + w1 - (x2 + (w2 / 2))) < -20) {
                        obj.x1 = x1 + (w1 / 2);
                        obj.y1 = y1 + h1;
                        obj.y2 = y2 + (h2 / 2) - (y1 + h1);
                    }


        /* if (
             (y2>y1 && (y2< (y1+h1+19)) && y2 > (y1+(h1/2)+10))
             
             ) {
             
             if (x2 < (x1 + w1 + 20) && x2 > x1) {
                 obj.x1 = x1 + (w1 / 2);
                 obj.y1 = y1 + h1;
                 obj.x2 = x2;
                 obj.y2 = y2 + (h2 / 2) - (obj.y1);
 
                 if (obj.y2 < 10) {
                     obj.y1 = y1;
                     obj.y2 = y2 + h2 / 2 - obj.y1;
                 }
             } else if (x1 < (x2 + (w2) + 20) && x1 > x2) {
                 console.log('ddddddd');
                 obj.x1 = x1 + (w1 / 2);
                 obj.y1 = y1 + h1;
                 obj.y2 = y2 - obj.y1 + (h2 / 2);
 
                 if (obj.y2 < 10) {
                     obj.y1 = y1;
                     obj.y2 = y2 + h2 / 2 - obj.y1;
                 }
             }
 
 
 
            
             }*/



        return obj;
    }

    private removeConnectorArrow() {
        if (this.currentLineArrow) {
            this.currentLineArrow.parentElement.removeChild(this.currentLineArrow);
            this.currentLineArrow = null;
        }
    }

    protected setCanvasContainer = (val: HTMLElement) => {
        this.canvasContainer = val;
        if (val) {
            val.addEventListener('mousemove', this.onCanvasMouseMove);
            val.addEventListener('mouseleave', this.onCanvasMouseLeave);
            val.addEventListener('mouseup', this.onCanvasMouseUp);
            val.addEventListener('mousedown', this.onCanvasMouseDown);
        }
    }

    protected setSVGCanvas = (val: SVGElement | SVGGElement) => {
        this.svgCanvas = val;

    }

    private onCanvasMouseDown = (event: MouseEvent) => {


        if (!this.connector.isActionStarted()) {
            return;
        }


        this.mouseDownPageX = event.pageX - this.canvasContainer.offsetLeft;
        this.mouseDownPageY = event.pageY - this.canvasContainer.offsetTop;

        this.isMouseDown = true;

        this.currentLineArrow = this.initiailizeConnector(this.mouseDownPageX, this.mouseDownPageY, 1, 1);
        this.svgCanvas.appendChild(this.currentLineArrow);
    }



    private initiailizeConnector = (x: number, y: number, w: number, h: number): SVGGElement => {
        // this.currentLineArrow = null;
        const currentLineArrow = SVGUtil.createElement<SVGGElement>('g');
        currentLineArrow.classList.add('action-connector');


        const line: SVGPathElement = SVGUtil.createElement<SVGPathElement>('path');


        this.drawPath(x, y, w, h, line);
        line.setAttribute('stroke', 'black');
        currentLineArrow.appendChild(line);

        const img: SVGImageElement = SVGUtil.createElement<SVGImageElement>('image');
        img.setAttribute('href', CommonUtil.APP_IMG_PATH + 'arrow_down.png');
        img.setAttribute('width', '12px');
        img.setAttribute('height', '12px');
        currentLineArrow.appendChild(img);

        this.selectionHandler.registerSelectableComponent(currentLineArrow);

        fromEvent(currentLineArrow, 'mouseenter').subscribe(() => {
            currentLineArrow.parentElement.lastChild.after(currentLineArrow);
        });

        return currentLineArrow;
        // this.svgCanvas.appendChild(this.currentLineArrow);
    }

    private drawPath(x: number, y: number, width: number, height: number, path: SVGPathElement, alignment?: ALIGNMENT) {

        switch (alignment) {
            /*case ALIGNMENT.RIGHT_MIDDLE:
            {
                path.setAttribute('d',
                    `M ${x} ${y} L ${width} ${y} 
                    L ${width} ${y + (height)} L ${width} ${y}  Z`);
                break;
            }*/
            case ALIGNMENT.RIGHT_RANGE:
            case ALIGNMENT.LEFT_RANGE: {
                path.setAttribute('d',
                    `M ${x} ${y} L ${(x + width) / 2} ${y} L ${(x + width) / 2} ${y + height} L ${width} ${y + height} 
                    L ${(x + width) / 2} ${y + height} L ${(x + width) / 2} ${y} Z`);
                break;
            }
            default: {
                path.setAttribute('d',
                    `M ${x} ${y} L ${x} ${y + (height / 2)} 
                L ${width} ${y + (height / 2)} L ${width} ${y + height} 
                L ${width} ${y + (height / 2)} L ${x} ${y + (height / 2)} Z`);
            }
        }


    }

    private onCanvasMouseUp = (event: MouseEvent) => {
        this.isMouseDown = false;
        if (this.connector.isActionStarted()) {
            this.connectActions(this.currentLineArrow);
        }
    }

    private onCanvasMouseLeave = (event: MouseEvent) => {
        this.isMouseDown = false;
        if (this.connector.isActionStarted()) {
            this.connectActions(this.currentLineArrow);
        }
    }

    private connectActions = (currentLineArrow: SVGGElement) => {
        const srcAction: ActionItemElement = this.connector.tryConnect(currentLineArrow);

        if (!srcAction) {
            this.removeConnectorArrow();
        } else {
            this.redrawPath(srcAction);
            this.connectorParentMap.set(currentLineArrow, srcAction);
            this.currentLineArrow = null;
        }
    }

    protected removeConnectionAction(element: Element) {
        this.connectorParentMap.delete(element);
    }
    protected getConnectionAction(element: Element): ActionItemElement {
        return this.connectorParentMap.get(element);
    }

    private onCanvasMouseMove = (event: MouseEvent) => {
        if (this.connector.isActionStarted() && this.isMouseDown) {
            this.mouseUpPageX = event.offsetX;
            this.mouseUpPageY = event.offsetY;
            this.drawConnectorArrow();
        }
    }

    private drawArrow = (x1: number, y1: number, arrow: SVGImageElement, alignment?: ALIGNMENT) => {

        switch (alignment) {
            case ALIGNMENT.LEFT_RANGE: {
                arrow.setAttribute('href', CommonUtil.APP_IMG_PATH + '/arrow_left.png');
                arrow.setAttribute('x', (x1 - 2) + 'px');
                arrow.setAttribute('y', (y1 - 6) + 'px');
                break;
            }
            case ALIGNMENT.TOP_RANGE: {
                arrow.setAttribute('href', CommonUtil.APP_IMG_PATH + '/arrow_top.png');
                arrow.setAttribute('x', (x1 - 5) + 'px');
                arrow.setAttribute('y', (y1 - 2) + 'px');
                break;
            }
            case ALIGNMENT.RIGHT_RANGE: {
                arrow.setAttribute('href', CommonUtil.APP_IMG_PATH + '/arrow_right.png');
                arrow.setAttribute('x', (x1 - 10) + 'px');
                arrow.setAttribute('y', (y1 - 5) + 'px');
                break;
            }
            default: {
                arrow.setAttribute('href', CommonUtil.APP_IMG_PATH + '/arrow_down.png');
                arrow.setAttribute('x', (x1 - 6) + 'px');
                arrow.setAttribute('y', (y1 - 10) + 'px');
            }

        }

    }

    private drawConnectorArrow() {
        const line: SVGPathElement = this.currentLineArrow.children.item(0) as SVGPathElement;
        this.drawPath(this.mouseDownPageX, this.mouseDownPageY, this.mouseUpPageX - 5, this.mouseUpPageY - this.mouseDownPageY - 5, line);

        this.drawArrow(this.mouseUpPageX - 5, this.mouseUpPageY - 5,
            this.currentLineArrow.children.item(1) as SVGImageElement);
    }

    protected connect(parent: ActionItemElement, children: ActionItemElement) {
        this.connector.setSourceAction(parent);
        this.connector.setDestinationAction(children);
        const connector: SVGGElement = this.initiailizeConnector(parent.getFlowChartActionItemData().x,
            parent.getFlowChartActionItemData().y,
            children.getFlowChartActionItemData().x, children.getFlowChartActionItemData().y);
       // (connector.firstElementChild as SVGElement).style.zIndex = this.svgCanvas.childElementCount + '';
        this.svgCanvas.appendChild(connector);
        // this.connector.tryConnect(connector);
        this.connectActions(connector);

    }

    protected clearConnectionParentMap() {
        this.connectorParentMap.clear();
    }
}


export class Dimension {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    alignment: ALIGNMENT = ALIGNMENT.BOTTOM;
}
enum ALIGNMENT {
    RIGHT_RANGE = 'RIGHT_RANGE',
    LEFT_RANGE = 'LEFT_RANGE',
    TOP_RANGE = 'TOP_RANGE',
    BOTTOM = 'BOTTOM'
}