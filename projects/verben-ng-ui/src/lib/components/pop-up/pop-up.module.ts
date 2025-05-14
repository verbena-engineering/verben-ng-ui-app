import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbenPopUpComponent } from './pop-up.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [VerbenPopUpComponent],
  imports: [CommonModule, SharedModule],
  exports: [VerbenPopUpComponent],
})
export class VerbenPopUpModule {}
