import { Component, OnInit } from '@angular/core';
import { TextInputAutocompleteMenuComponent } from 'angular-text-input-autocomplete';

@Component({
  selector: 'app-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.sass']
})
export class CustomMenuComponent extends TextInputAutocompleteMenuComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
