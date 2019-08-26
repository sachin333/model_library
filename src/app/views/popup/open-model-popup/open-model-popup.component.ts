import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OpenModelPopupService } from './open-model-popup.service';
import { PopupUtilService } from 'src/app/module/popup-module/popup/popup-util.service';
import { DefaultModelPopup } from 'src/app/module/popup-module/popup/default-model-popup';

@Component({
  selector: 'app-open-model-popup',
  templateUrl: './open-model-popup.component.html',
  styleUrls: ['./open-model-popup.component.sass']
})
export class OpenModelPopupComponent extends DefaultModelPopup<OpenModelPopupComponent> implements OnInit {

  protected selectedModel: any;
  protected models: any[];
  protected popupActions = { button: ['Open'], cancel: true };

  constructor(protected popup: MatDialogRef<OpenModelPopupComponent>,
    private popupService: OpenModelPopupService) {
    super(popup);
  }


  ngOnInit() {
    this.models = this.popupService.getList();
  }
  protected onActionSelect(event) {
    if (event.detail === 'cancel') {
      this.onCloseClick();
      return;
    }
    if (!this.selectedModel) {
      return;
    }
    this.close(this.selectedModel.nodes);
  }

}
