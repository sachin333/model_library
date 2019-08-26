import { Component, OnInit } from '@angular/core';
import { ActionTypes } from '../action-item/action-item.model';


@Component({
  selector: 'app-model-control-bar',
  templateUrl: './model-control-bar.component.html',
  styleUrls: ['./model-control-bar.component.sass']
})
export class ModelControlBarComponent implements OnInit {

  protected INPUT = ActionTypes.INPUT;
  protected TREASURY_INPUT = ActionTypes.TREASURY_INPUT;
  protected ACTION = ActionTypes.ACTION;
  protected OUTPUT = ActionTypes.OUTPUT;

  constructor() { }

  ngOnInit() {
  }

  dragStart = (ev: DragEvent, actionType: string) => {
    
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('ACTION_DROP_TYPE', actionType);

    ev.dataTransfer.setDragImage((ev.target || ev.currentTarget) as Element, 0, 0);
    return true;
  }

}


