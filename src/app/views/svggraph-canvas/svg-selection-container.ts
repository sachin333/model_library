import { fromEvent, BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SVGComponentFactoryService } from '../services/svgcomponent-factory.service';

@Injectable({ providedIn: 'root' })
export class SVGSelectionHandler {

    private currentSelectedElement: Element | SVGGElement;
    private selectionChange: BehaviorSubject<Element>;
    private onSelectionChangeEvent: Observable<Element>;


    constructor() {
        this.selectionChange = new BehaviorSubject(this.currentSelectedElement);
        this.onSelectionChangeEvent = this.selectionChange.asObservable();
    }

    public get onSelectionChange() {
        return this.onSelectionChangeEvent;
    }

    public set selected(val: Element | SVGGElement) {
        if (this.currentSelectedElement) {
            this.currentSelectedElement.classList.remove('selected');
        }
        this.currentSelectedElement = val;
        if (val) {
            val.classList.add('selected');
        }
        this.selectionChange.next(val);
    }
    public get selected(): Element | SVGGElement {
        return this.currentSelectedElement;
    }
    public registerSelectableComponent(val: Element) {
        if (val) {
            fromEvent(val, 'click').subscribe((event: MouseEvent) => {
                this.selected = event.target as Element;
            });
            fromEvent(val, 'mousedown').subscribe((event: MouseEvent) => {
                this.selected = event.target as Element;
            });
        }
    }
}