import { Injectable, Type } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { APP_POPUP_INJECTOR } from '../app-popup.module';

export class PopupUtilService {

  constructor() { }

  static open<T, V>(dialog: Type<T>): Observable<V> {
    const dialogRef: MatDialog = APP_POPUP_INJECTOR.get<MatDialog>(MatDialog);
    return dialogRef.open(dialog).afterClosed();
  }
  static close<T>(popup: MatDialogRef<T>, data?: any) {
    popup.close(data);
  }
}
