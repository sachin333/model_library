import { GenericCanvasComponent } from '../generic-canvas/generic-canvas.component';
import { IDragDropCanvasComponent } from 'src/app/views/svggraph-canvas/canvas-component.interface';
import { CdkDragDrop, CdkDrag } from '@angular/cdk/drag-drop';
import { ActionTypes } from 'src/app/views/action-item/action-item.model';

export abstract class GenericDragDropCanvasComponent extends GenericCanvasComponent implements
    IDragDropCanvasComponent<Event> {
    dragAllowed = true;
    dropAllowed = true;
    onDrop(event: DragEvent) {
        if (!this.dropAllowed) {
            return;
        }
        event.stopPropagation();
        this.handleDrop(ActionTypes[event.dataTransfer.getData('ACTION_DROP_TYPE')], event.clientX, event.clientY - 50);
    }
    dragEnter(event: DragEvent) {
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();
        return false;
    }
    dragOver(event: Event) {
        return false;
    }


    abstract handleDrop(dropType: ActionTypes, x: number, y: number);

}