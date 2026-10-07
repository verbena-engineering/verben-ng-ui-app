import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { VerbenDatePickerComponent } from './verben-date-picker.component';
import { VerbenCalendarGridComponent } from './calendar-grid/calendar-grid.component';
import { VerbenPeriodPanelComponent } from './period-panel/period-panel.component';

@NgModule({
  declarations: [
    VerbenDatePickerComponent,
    VerbenCalendarGridComponent,
    VerbenPeriodPanelComponent,
  ],
  imports: [CommonModule, OverlayModule],
  // The grid and the period panel are exported too, so they can be reused on their own
  exports: [
    VerbenDatePickerComponent,
    VerbenCalendarGridComponent,
    VerbenPeriodPanelComponent,
  ],
})
export class VerbenDatePickerModule {}
