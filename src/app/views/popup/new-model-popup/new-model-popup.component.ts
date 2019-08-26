import { Component, OnInit } from '@angular/core';
import { DefaultModelPopup } from 'src/app/module/popup-module/popup/default-model-popup';
import { PopupUtilService } from 'src/app/module/popup-module/popup/popup-util.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-model-popup',
  templateUrl: './new-model-popup.component.html',
  styleUrls: ['./new-model-popup.component.sass']
})
export class NewModelPopupComponent extends DefaultModelPopup<NewModelPopupComponent> implements OnInit {

  protected popupActions = { button: ['Create'], cancel: true };
  protected form: FormGroup;
  protected disableButtons: Set<string | number>;
  constructor(protected model: MatDialogRef<NewModelPopupComponent>,
    formBuilder: FormBuilder) {
    super(model);

    this.form = formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      desc: [null]
    });

    this.form.valueChanges.subscribe(() => {
      if (!this.form.valid) {
        this.disableButtons.add(0);
      } else {
        this.disableButtons.clear();
      }
    });
  }

  ngOnInit() {
    this.disableButtons = new Set();
    this.disableButtons.add(0);
  }

  protected onActionSelect(event) {

    this.close(event.detail === 'cancel' ? null : this.form.value);
  }
}
export interface NewModelPopupComponentEvent {
  name: string;
  desc: string;
}