import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActionItemElement } from '../services/ActionItemElement';
import { ActionTypes } from '../action-item/action-item.model';


@Injectable({ providedIn: 'root' })
export class ConnectorActionHandler {
    private readonly _subject: BehaviorSubject<boolean>;
    private readonly _observable: Observable<boolean>;
    private _actionActionStarted = false;
    private _srcAction: ActionItemElement;
    private _destAction: ActionItemElement;

    constructor() {
        this._subject = new BehaviorSubject(this._actionActionStarted);
        this._observable = this._subject.asObservable();
    }

    setSourceAction = (sourceAction: ActionItemElement) => {
        this._srcAction = sourceAction;
        // console.log('---src', sourceAction.data);
    }
    setDestinationAction = (destAction: ActionItemElement) => {
        this._destAction = destAction;
        // console.log('---dest', destAction.data);
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
    tryConnect = (path: SVGGElement) => {

        try {

            if (!path) {
                return null;
            }

            if (!this._srcAction || !this._destAction
                || this._srcAction === this._destAction
                || this._destAction.getFlowChartActionItemData().type === ActionTypes.INPUT
                || this._destAction.getFlowChartActionItemData().type === ActionTypes.TREASURY_INPUT
                || this._srcAction.getFlowChartActionItemData().type === ActionTypes.OUTPUT) {
                return null;
            }




            this._srcAction.addChildren({ action: this._destAction, pathElement: path });
            this._destAction.addParent(this._srcAction);
            
            return this._srcAction;
        } catch (err) {

        } finally {
            this._srcAction = null;
            this._destAction = null;
        }

        return null;

    }

}

