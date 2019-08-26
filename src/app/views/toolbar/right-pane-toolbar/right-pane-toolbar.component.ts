import { Component, OnInit, OnDestroy } from '@angular/core';
import { SVGSelectionHandler } from '../../svggraph-canvas/svg-selection-container';
import { ActionItemElement } from '../../services/ActionItemElement';
import { SVGCanvasActionService } from '../../svggraph-canvas/svgcanvas-action-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IFlowChartActionItem, AsyncFlowChartActionItem, ActionTypes, IFlowChartOperationItem, AsyncEquationItem } from '../../action-item/action-item.model';
import { Subscription } from 'rxjs';
import { IEqulationData } from '../../formula-builder/formula-builder.component';
import { throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-right-pane-toolbar',
  templateUrl: './right-pane-toolbar.component.html',
  styleUrls: ['./right-pane-toolbar.component.sass']
})
export class RightPaneToolbarComponent implements OnInit, OnDestroy {

  protected currentSelectedAction: ActionItemElement;
  protected form: FormGroup;
  private subscription: Subscription;
  protected equationData: IEqulationData;


  constructor(private selectionHandler: SVGSelectionHandler,
    private canvasUtil: SVGCanvasActionService,
    private fb: FormBuilder) {
    this.subscription = new Subscription();
  }

  ngOnInit() {
    this.form = this.fb.group({
      displayLabel: [null, {
        validators: [Validators.required, Validators.minLength(3)],
        /*updateOn: 'blur'*/
      }],
      desc: [],
      useGlobalValue: [false],
      defaultValue: [],
      globalValue: []
    });


    /*this.form.statusChanges.pipe(
      throttleTime(5000)
    ).subscribe(() => {
      if (!this.currentSelectedAction) {
        return;
      }

      const dd: IFlowChartActionItem = this.currentSelectedAction.getFlowChartActionItemData();

      if (this.form.invalid) {

        this.form.reset(dd);

      }
    });*/

    const formSubscription = this.form.valueChanges.subscribe((val) => {

      if (!this.currentSelectedAction || this.form.invalid) {
        return;
      }




      const dd: IFlowChartActionItem = this.currentSelectedAction.getFlowChartActionItemData();
      for (const key in val) {

        if (val[key]) {
          dd[key] = val[key];
        }

      }

      if (dd instanceof AsyncFlowChartActionItem) {
        (dd as AsyncFlowChartActionItem).dispatchChangeEvent();
      }
    });

    this.subscription.add(formSubscription);

    const selectionSubscription = this.selectionHandler.onSelectionChange.subscribe(this.selectionChangeHandler);

    this.subscription.add(selectionSubscription);
  }

  selectionChangeHandler = (val: Element) => {
    this.currentSelectedAction = this.canvasUtil.getActionItemElement(val);
    this.form.reset();
    this.equationData = null;

    if (this.currentSelectedAction) {
      const actionItem = this.currentSelectedAction.getFlowChartActionItemData();

      this.form.patchValue(actionItem);
      this.form.enable();


      if (actionItem.type === ActionTypes.OUTPUT
        || actionItem.type === ActionTypes.ACTION) {
        this.form.get('useGlobalValue').disable();
        this.form.get('defaultValue').disable();
        this.form.get('globalValue').disable();

        // if (actionItem.type === ActionTypes.ACTION) {
        this.equationData = {
          currentEquation: (actionItem as IFlowChartOperationItem).equation || null,
          input: this.currentSelectedAction.getParentList()
        };
        // }
      } else {
        this.form.get('useGlobalValue').enable();
        this.form.get('defaultValue').enable();
        this.form.get('globalValue').enable();
      }




    } else {
      this.form.disable();

    }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  formulaChanged = (data) => {
    //  console.log('formulaChanged11', (this.currentSelectedAction.getFlowChartActionItemData() as FlowChartActionOperationItem));
    if ((this.currentSelectedAction.getFlowChartActionItemData() instanceof AsyncEquationItem)) {
      //   console.log('formulaChanged22');
      (this.currentSelectedAction.getFlowChartActionItemData() as IFlowChartOperationItem).equation = data;
    }

  }

}
