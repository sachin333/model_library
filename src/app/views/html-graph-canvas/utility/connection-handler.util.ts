import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { IFlowChartInputElement, IFlowChartOutputElement, IFlowChartElement, IFlowChartOperationElement } from '../components/IFlowChartElement';
import { ConnectionHandlerHelper } from './connection-handler.helper';
import { SVGCanvasActionService } from '../../svggraph-canvas/svgcanvas-action-service';
import { IComponentBuilderCanvas } from '../components/generic-canvas/generic-canvas.component';
import { HtmlGraphCanvasComponent } from '../html-graph-canvas.component';
import { IFlowChartConnectionElement } from '../components/IFlowChartConnectionElement';


@Injectable({ providedIn: 'root' })
export class ConnectionHandlerUtil {
    private readonly _subject: BehaviorSubject<boolean>;
    private readonly _observable: Observable<boolean>;
    private _actionActionStarted = false;
    private _srcAction: IFlowChartInputElement<any>;
    private _destAction: IFlowChartOutputElement<any>;


    constructor() {
        this._subject = new BehaviorSubject(this._actionActionStarted);
        this._observable = this._subject.asObservable();

    }

    setSourceAction = (sourceAction: IFlowChartInputElement<any>) => {
        this._srcAction = sourceAction;
        console.log('---src', sourceAction);
    }
    setDestinationAction = (destAction: IFlowChartOutputElement<any>) => {
        this._destAction = destAction;
        console.log('---dest', destAction);
    }

    connectionActionStarted = () => {
        this._destAction = this._srcAction = null;
        this._actionActionStarted = true;
        this._subject.next(this._actionActionStarted);
    }
    connectionActionEnded = () => {
        this._actionActionStarted = false;
        this._subject.next(this._actionActionStarted);
        // console.log(this._destAction, this._srcAction, "--connectionActionEnded------");
    }

    isActionStarted = (): boolean => {
        return this._actionActionStarted;
    }

    getHandler(): Observable<boolean> {
        return this._observable;
    }
    tryConnect = (path: IFlowChartConnectionElement) => {

        try {

            if (!path) {
                return null;
            }
          
            if (!this._srcAction || !this._destAction
                || (this._srcAction as IFlowChartOperationElement<any,any>) === this._destAction
                /*|| this._destAction.getFlowChartActionItemData().type === ActionTypes.INPUT
                || this._destAction.getFlowChartActionItemData().type === ActionTypes.TREASURY_INPUT
                || this._srcAction.getFlowChartActionItemData().type === ActionTypes.OUTPUT*/) {
                return null;
            }




            this._srcAction.addChildren(this._destAction);
            this._destAction.addParent(this._srcAction);
        
            path.parentNode = this._srcAction;
            path.childNode = this._destAction;
         
            return this._srcAction;
        } catch (err) {
            console.log('[connection-handler.util] try connect', err);
        } finally {
            this._srcAction = null;
            this._destAction = null;
        }

        return null;

    }

}

