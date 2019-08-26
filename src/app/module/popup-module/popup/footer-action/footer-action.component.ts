import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-footer-action',
  templateUrl: './footer-action.component.html',
  styleUrls: ['./footer-action.component.sass']
})
export class FooterActionComponent implements OnInit {

  @Input()
  options: { close?: boolean, yes?: boolean, no?: boolean, cancel?: boolean, ok?: boolean, buttons?: string[] };

  @Output()
  select: EventEmitter<{ detail: string, index?: number }> = new EventEmitter();

  @Input()
  disableButtons: Set<string | number>;

  constructor() { }

  ngOnInit() {
  
  }

  optionSelected(detail: string, index?: number) {
    this.select.emit({ detail, index });
  }
}
