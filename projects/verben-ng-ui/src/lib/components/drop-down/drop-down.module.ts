import { forwardRef, NgModule } from '@angular/core';
import { DropDownComponent } from './drop-down.component';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropDownItemComponent } from './drop-down-item/drop-down-item.component';
import { SharedModule } from '../shared.module';

@NgModule({
  declarations: [],
  imports: [DropDownComponent, DropDownItemComponent, SharedModule],
  exports: [DropDownComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropDownComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DropDownComponent),
      multi: true,
    },
  ],
})
export class DropDownModule {}
