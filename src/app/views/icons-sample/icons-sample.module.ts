import { NgModule } from '@angular/core';
import { IconsSampleComponent } from './icons-sample.component';
import { CommonModule } from '@angular/common';
import { SvgModule } from 'verben-ng-ui/src/public-api';

@NgModule({
  declarations:[IconsSampleComponent],
  imports: [CommonModule,SvgModule],
  exports: [IconsSampleComponent]
})
export class IconSampleModule {}


