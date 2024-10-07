// verbena-switch.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbenaSwitchComponent } from './verbena-switch.component';

@NgModule({
  declarations: [VerbenaSwitchComponent],
  imports: [CommonModule],
  exports: [VerbenaSwitchComponent]
})
export class VerbenaSwitchModule {}
