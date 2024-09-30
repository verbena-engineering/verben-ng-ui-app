import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewComponent } from './data-view.component';
@NgModule({
  imports: [CommonModule,DataViewComponent],
  exports: [DataViewComponent]
})
export class DataViewModule {}
