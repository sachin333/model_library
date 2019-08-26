import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ModelControlBarComponent } from './views/model-control-bar/model-control-bar.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ActionItemComponent } from './views/action-item/action-item.component'
import { ConnectorActionHandler } from './views/action-utils/connector-action-handler';
import { SVGGraphCanvasComponent } from './views/svggraph-canvas/svggraph-canvas.component';
import { SVGCanvasActionService } from './views/svggraph-canvas/svgcanvas-action-service';
import { SVGSelectionHandler } from './views/svggraph-canvas/svg-selection-container';
import { TopPaneToolbarComponent } from './views/toolbar/top-pane-toolbar/top-pane-toolbar.component';
import { RightPaneToolbarComponent } from './views/toolbar/right-pane-toolbar/right-pane-toolbar.component';
import { FormulaBuilderComponent } from './views/formula-builder/formula-builder.component';
import { TextInputAutocompleteModule } from 'angular-text-input-autocomplete';
import { CustomMenuComponent } from './views/formula-builder/custom-menu/custom-menu.component';
import { HtmlGraphCanvasComponent } from './views/html-graph-canvas/html-graph-canvas.component';
import { FlowChartComponent } from './views/html-graph-canvas/components/flow-chart/flow-chart.component';
import { FlowChartInputComponent } from './views/html-graph-canvas/components/flow-chart-input/flow-chart-input.component';
import { FlowChartOutputComponent } from './views/html-graph-canvas/components/flow-chart-output/flow-chart-output.component';
import { FlowChartTreasuryInputComponent } from './views/html-graph-canvas/components/flow-chart-treasury-input/flow-chart-treasury-input.component';
import { FlowChartOperationComponent } from './views/html-graph-canvas/components/flow-chart-operation/flow-chart-operation.component';
import { FlowChartConnectorComponent } from './views/html-graph-canvas/components/flow-chart-connector/flow-chart-connector.component';
import { OpenModelPopupComponent } from './views/popup/open-model-popup/open-model-popup.component';
import { MaterialLibModule } from './module/material-lib/material-lib.module';
import { AppPopupModule } from './module/popup-module/app-popup.module';
import { NewModelPopupComponent } from './views/popup/new-model-popup/new-model-popup.component';


@NgModule({
  declarations: [
    OpenModelPopupComponent,
    AppComponent,
    ModelControlBarComponent,
    ActionItemComponent,
    SVGGraphCanvasComponent,
    TopPaneToolbarComponent,
    RightPaneToolbarComponent,
    FormulaBuilderComponent,
    CustomMenuComponent,
    HtmlGraphCanvasComponent,
    FlowChartComponent,
    FlowChartInputComponent,
    FlowChartOutputComponent,
    FlowChartTreasuryInputComponent,
    FlowChartOperationComponent,
    FlowChartConnectorComponent,
    NewModelPopupComponent,
  ],
  imports: [
    BrowserModule, DragDropModule, ReactiveFormsModule, FormsModule, TextInputAutocompleteModule, MaterialLibModule, AppPopupModule
  ],
  exports: [SVGGraphCanvasComponent],
  providers: [ConnectorActionHandler, SVGCanvasActionService, SVGSelectionHandler],
  bootstrap: [AppComponent, FlowChartInputComponent, FlowChartOutputComponent,
    OpenModelPopupComponent, NewModelPopupComponent,
    FlowChartTreasuryInputComponent, FlowChartOperationComponent, FlowChartConnectorComponent],
  entryComponents: [CustomMenuComponent]
})
export class AppModule { }
