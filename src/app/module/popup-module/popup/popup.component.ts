import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.sass']
})
export class PopupComponent implements OnInit {

  @Input()
  popupClass: string;

  static openDialog() {

  }

  constructor() { }

  ngOnInit() {
  }



}
