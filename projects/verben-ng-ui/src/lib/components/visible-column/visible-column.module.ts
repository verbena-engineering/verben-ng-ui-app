import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { VisibleColumnComponent } from './visible-column.component';
import { SvgModule } from '../svg/svg.module';
@NgModule({
  declarations:[VisibleColumnComponent],
  imports: [CommonModule, FormsModule,SvgModule],
  exports: [VisibleColumnComponent]
})
export class VisibleColumnModule {}
