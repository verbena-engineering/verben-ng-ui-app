import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { VisibleColumnComponent } from './visible-column.component';
@NgModule({
  imports: [FormsModule,CommonModule,VisibleColumnComponent],
  exports: [VisibleColumnComponent]
})
export class VisibleColumnModule {}
