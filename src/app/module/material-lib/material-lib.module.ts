import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    MatMenuModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatDialogModule, MatListModule, MatDividerModule, BrowserAnimationsModule, MatIconModule
  ],
  exports: [MatInputModule, MatFormFieldModule, MatMenuModule, 
    MatButtonModule, MatDialogModule, MatListModule, MatDividerModule, MatIconModule]
})
export class MaterialLibModule { }
