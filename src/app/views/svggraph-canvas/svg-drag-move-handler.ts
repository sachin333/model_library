import { fromEvent, Subject, Observable } from 'rxjs';
import { ActionComponentEvent, ActionComponentDragEvent, SVGComponentFactoryService } from '../services/svgcomponent-factory.service';
import { Action } from 'rxjs/internal/scheduler/Action';

export class DragMoveHandler<T extends Element | HTMLElement> {

    protected dragMoveAllowed = false;
    public disableDragMove = false;
    private mouseDownX: number;
    private mouseDownY: number;
    private boundingRect: { x, y, width, height };
    private onElementMouseDown: Subject<ActionComponentEvent>;
    private onElementMousUp: Subject<ActionComponentEvent>;
    private onElementDragging: Subject<ActionComponentDragEvent>;
    protected readonly onElementMouseDownEvent: Observable<ActionComponentEvent>;
    protected readonly onElementMouseUpEvent: Observable<ActionComponentEvent>;
    protected readonly onDraggingEvent: Observable<ActionComponentDragEvent>;
    private currentTaregtZIndex: number;

    constructor() {
        this.onElementMouseDown = new Subject();
        this.onElementMousUp = new Subject();
        this.onElementDragging = new Subject();
        this.onElementMouseDownEvent = this.onElementMouseDown.asObservable();
        this.onElementMouseUpEvent = this.onElementMousUp.asObservable();
        this.onDraggingEvent = this.onElementDragging.asObservable();
    }

    setElementDragMove = (element: T) => {
        let ele = null;

        if (element.classList.contains('.svg-draggable-item')) {
            ele = element;
        } else {
            ele = element.querySelector('.svg-draggable-item');
        }

        if (!ele) {
            return;
        }

        fromEvent(element, 'mousedown').subscribe(this.onMouseDown);
        fromEvent(element, 'mouseout').subscribe(this.onMouseOut);
        fromEvent(element, 'mouseup').subscribe(this.onMouseUp);
        fromEvent(element, 'mousemove').subscribe(this.onMouseMove);
    }

    setBoundingRect(x: number, y: number, width: number, height: number) {
        this.boundingRect = { x, y, width, height };
    }

    private onMouseDown = (event: MouseEvent) => {
        this.onElementMouseDown.next(this.initializeComponentEvent(event));
        if (this.disableDragMove) {
            return;
        }

        this.dragMoveAllowed = true;
        this.mouseDownX = event.clientX;
        this.mouseDownY = event.clientY;
        const ss = SVGComponentFactoryService.getActionContentElement(event.target as Element);
        if (ss) {
            ss.parentElement.lastChild.after(ss);
        }
        // console.log(ss, ss.parentElement);

    }


    private onMouseOut = (event: MouseEvent) => {
        this.dragMoveAllowed = false;
    }

    private onMouseUp = (event: MouseEvent) => {
        this.onElementMousUp.next(this.initializeComponentEvent(event));
        this.dragMoveAllowed = false;
    }

    private initializeComponentEvent(event): ActionComponentEvent {
        return new ActionComponentEvent(event.type, event);
    }

    private onMouseMove = (event: MouseEvent) => {
       
        if (this.dragMoveAllowed) {
            const pos1 = this.mouseDownX - event.clientX;
            const pos2 = this.mouseDownY - event.clientY;
            this.mouseDownX = event.clientX;
            this.mouseDownY = event.clientY;

            const element: T = event.target as T;
            let newX = 0;
            let newY = 0;

           // console.log('onMouseMove',this.dragMoveAllowed, this.boundingRect);
            if (element instanceof SVGElement) {
               // console.log('onMouseMove22',this.dragMoveAllowed);
                const currentX = parseInt(element.getAttribute('x'), 0);
                const currentY = parseInt(element.getAttribute('y'), 0);
                const width = parseInt(element.getAttribute('width'), 0);
                const height = parseInt(element.getAttribute('height'), 0);

                newX = currentX - pos1;
                newY = currentY - pos2;

                if (this.boundingRect) {
                    if (newY < this.boundingRect.y
                        || newY + width > (this.boundingRect.y + this.boundingRect.height)
                        || newX < this.boundingRect.x
                        || newX + width > (this.boundingRect.x + this.boundingRect.width)
                    ) {
                        return;
                    }
                }
            }


            /* const newX = element.offsetLeft - pos1;
             const newY = element.offsetTop - pos2;
 
             if (this.boundingRect) {
                 if (newY < this.boundingRect.top
                     || newY + element.offsetHeight > (this.boundingRect.top + this.boundingRect.height)
                     || newX < this.boundingRect.left
                     || newX + element.offsetWidth > (this.boundingRect.left + this.boundingRect.width)
                 ) {
                     return;
                 }
             }*/

            this.setCoordinates(element, newX, newY);
            // this.onElementDragging.next(this.initializeComponentEvent(event));
            this.onElementDragging.next(new ActionComponentDragEvent(event.type, event, newX, newY));
        }
    }

    private setCoordinates(element: Element, x: number, y: number): void {

        const group: Element = SVGComponentFactoryService.getActionContentElement(element);

        group.childNodes.forEach((node) => {
            if (node instanceof SVGElement) {
                node.setAttribute('x', x + 'px');
                node.setAttribute('y', y + 'px');
            } else {
                (node as HTMLElement).style.top = y + 'px';
                // this._actionItem.y = y;

                (node as HTMLElement).style.left = x + 'px';
                // this._actionItem.x = x;
            }
        });



    }
}
