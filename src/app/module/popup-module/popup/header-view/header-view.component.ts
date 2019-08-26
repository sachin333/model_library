import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-view',
  templateUrl: './header-view.component.html',
  styleUrls: ['./header-view.component.sass']
})
export class HeaderViewComponent implements OnInit {

  @Input()
  title: string;


  @Input()
  closeButton = true;

  @Output()
  close: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
