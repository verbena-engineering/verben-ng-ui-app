import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataExportService } from './data-export.service';
import { DataExportComponent } from './data-export.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DataExportComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [DataExportService],
  exports: [DataExportComponent],
})
export class DataExportModule {}
