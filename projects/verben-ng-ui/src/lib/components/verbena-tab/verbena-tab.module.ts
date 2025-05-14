import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerbenaTabComponent } from './verbena-tab.component';
import { TabItemComponent } from './tab-item.component';

@NgModule({
  declarations: [
    VerbenaTabComponent,
    TabItemComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VerbenaTabComponent,
    TabItemComponent
  ]
})
export class VerbenaTabModule { }