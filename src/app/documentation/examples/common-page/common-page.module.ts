import { NgModule } from '@angular/core';
import { CommonPageComponent } from './common-page.component';
import { ExamplesSharedModule } from '../examples-shared.module';

@NgModule({
  declarations: [CommonPageComponent],
  imports: [ExamplesSharedModule],
})
export class CommonPageModule {}
