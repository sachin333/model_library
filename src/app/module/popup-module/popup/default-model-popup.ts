import { PopupUtilService } from './popup-util.service';
import { MatDialogRef } from '@angular/material/dialog';

export class DefaultModelPopup<T> {
    constructor(protected popup: MatDialogRef<T>) { }

    protected onCloseClick = () => {
        this.close();
    }
    protected onActionSelect(event: { detail: string, index?: number }) {
        this.onCloseClick();
    }
    protected close(data?: any) {
        PopupUtilService.close(this.popup, data);
    }
}