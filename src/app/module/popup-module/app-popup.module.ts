import { NgModule, Injector } from '@angular/core';
import { PopupComponent } from './popup/popup.component';
import { HeaderViewComponent } from './popup/header-view/header-view.component';
import { FooterActionComponent } from './popup/footer-action/footer-action.component';
import { PopupUtilService } from './popup/popup-util.service';
import { CommonModule } from '@angular/common';
import { MaterialLibModule } from 'src/app/module/material-lib/material-lib.module';
import { AppModule } from 'src/app/app.module';

export let APP_POPUP_INJECTOR: Injector;

@NgModule({
    declarations: [PopupComponent, HeaderViewComponent, FooterActionComponent],
    imports: [
        CommonModule, MaterialLibModule
    ],
    exports: [PopupComponent, HeaderViewComponent, FooterActionComponent],
    providers: [],
})
export class AppPopupModule {

    constructor(private injector: Injector) {
        APP_POPUP_INJECTOR = this.injector;
    }
}
