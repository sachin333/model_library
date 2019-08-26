import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActionItemElement } from '../services/ActionItemElement';
import { IEquationItem, EquationItemType } from './classes/IEquationItem';
import { EquationItem } from './classes/EquationItem';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChoiceSelectedEvent } from 'angular-text-input-autocomplete/text-input-autocomplete.directive';
import { CustomMenuComponent } from './custom-menu/custom-menu.component';

@Component({
  selector: 'app-formula-builder',
  templateUrl: './formula-builder.component.html',
  styleUrls: ['./formula-builder.component.sass']
})
export class FormulaBuilderComponent implements OnInit {

  private static readonly pattern: RegExp = /([a-zA-Z_\d]+)([+*-])?/gym;

  private inputData: IEqulationData;
  private _currentEquation: string;
  @Output()
  public formulaChange: EventEmitter<string> = new EventEmitter();
  protected equationItem: IEquationItem[];
  protected TYPE_LABEL = EquationItemType.VALUE;
  protected TYPE_OPERATOR = EquationItemType.OPERATOR;
  protected TYPE_GROUP = EquationItemType.GROUP;
  protected menuComponent = CustomMenuComponent;
  protected inputDisable = false;

  private functionsList: IEquationItem[] = [
    new EquationItem(EquationItemType.OPERATOR, 'min', 'MIN'),
    new EquationItem(EquationItemType.OPERATOR, 'max', 'MAX'),
    new EquationItem(EquationItemType.OPERATOR, 'abs', 'ABS')
  ];

  protected set currentEquation(val: string) {
    this._currentEquation = val;
    this.formulaChange.next(val);

    console.log(val);

  }

  public static createFormula(action: ActionItemElement[], operators?: string[]): string {
    if (!action || action.length <= 0) {
      return null;
    }
    const op = operators || new Array(action.length - 1).fill('+', 0, action.length - 1);
    let str = '';

    action.forEach((obj, index) => {
      str += obj.getFlowChartActionItemData().getId() + (index < action.length - 1 ? op[index] : '');
    });
    return str;
  }



  @Input()
  public set dataInput(val: IEqulationData) {
    this.inputData = val;
    this.formControlValue = null;
    this.inputDisable = !val;
    this.initializeFormula();
  }

  @Input()
  public set disabeInput(val: boolean) {
    this.inputDisable = val;
  }




  constructor() { }

  ngOnInit() {
  }

  private initializeFormula() {
    // console.log('_currentEquation111', this._currentEquation);
    this._currentEquation = null;

    this.equationItem = this.equationItem || [];
    this.equationItem.length = 0;

    if (!this.inputData || !this.inputData.input || this.inputData.input.length <= 0) {
      return;
    }

    this._currentEquation = this.inputData.currentEquation;



    //   console.log('_currentEquation', this._currentEquation);

    // if (!this._currentEquation || this._currentEquation.trim().length === 0) {
    //  this.currentEquation = FormulaBuilderComponent.createFormula(this.inputData.input);
    // }


    this.equationItem = this.inputData.input.map((input) => {
      return new EquationItem(EquationItemType.VALUE, input.getFlowChartActionItemData().getId(),
        input.getFlowChartActionItemData().displayLabel);
    });

    this.equationItem.splice(this.equationItem.length - 1, 0, ...this.functionsList);

    if (this.inputData.currentEquation && this.inputData.currentEquation !== 'null') {
      let eq = this.inputData.currentEquation;
      this.equationItem.forEach((item) => {
        eq = eq.replace(new RegExp(item.value, 'g'), item.label);
      });
      this.formControlValue = eq;
    } else {
      this.formControlValue = '';
    }



    /* const inputLabelMap: Map<string, string> = new Map(this.inputData.input.map<[string, string]>((obj) => {
   
       return [obj.getFlowChartActionItemData().getId(), obj.getFlowChartActionItemData().displayLabel];
     }));
   
     let m;
     const regex = FormulaBuilderComponent.pattern;
     while ((m = regex.exec(this._currentEquation)) !== null) {
       // This is necessary to avoid infinite loops with zero-width matches
       if (m.index === regex.lastIndex) {
         regex.lastIndex++;
       }
   
       // The result can be accessed through the `m`-variable.
       m.forEach((match, groupIndex) => {
   
         if (!match) {
           return;
         }
   
         if (groupIndex === 1) {
           this.equationItem.push(new EquationItem(EquationItemType.VALUE, match, inputLabelMap.get(match)));
         } else if (groupIndex === 2) {
           // this.equationItem.push(new EquationItem(EquationItemType.OPERATOR, match, match));
         }
         // console.log(`Found match, group ${groupIndex}: ${match}`);
       });
     }*/

    // console.log(this.equationItem);

  }

  /*
    drop(event: CdkDragDrop<IEquationItem[]>) {
      moveItemInArray(this.equationItem, event.previousIndex, event.currentIndex);
      let newEquation = '';
      this.equationItem.forEach((item) => {
        newEquation += item.value;
      });
      console.log(newEquation);
    }
    */

  onInput = (event: Event) => {
    // console.log(event);

    this.outputValue = this.formControlValue.trim();
    this.equationItem.forEach((item) => {
      this.outputValue = this.outputValue.replace(new RegExp(item.label, 'g'), item.value);
    });
    //    console.log(this.formControlValue, this.outputValue);
    this.currentEquation = this.outputValue;
  }

  outputValue = '';

  formControlValue = '';

  findChoices = (searchText: string) => {
    return this.equationItem.filter(item =>
      item.label.toLowerCase().includes(searchText.toLowerCase())
    ).map((item) => {
      return item;
    }).sort((val, val2) => {
      let sort = 0;//;

      if (val.type > val2.type) {
        sort = -1;
      } else if (val.type < val2.type) {
        sort = 1;
      }

      if (sort === 0) {
        sort = val.label.localeCompare(val2.label);
      }

      return sort;
    })
  }

  getChoiceLabel = (choice: IEquationItem) => {
    if (choice.type == EquationItemType.OPERATOR) {
      return `${choice}()`;
    }
    return `${choice} `;
  }

  onChoiceSelected = (event: ChoiceSelectedEvent) => {
    //  console.log(event);
  }


}

export interface IEqulationData {
  input: ActionItemElement[];
  currentEquation: string;
}
