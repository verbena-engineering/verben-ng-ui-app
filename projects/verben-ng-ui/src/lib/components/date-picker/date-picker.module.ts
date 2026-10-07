import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { DatePickerComponent } from './date-picker.component';
import { VerbenCalendarComponent } from './calendar/calendar.component';
import { VerbenCalendarGridComponent } from './calendar-grid/calendar-grid.component';
import { VerbenPeriodPanelComponent } from './period-panel/period-panel.component';
import { VerbenPresetSearchComponent } from './preset-search/preset-search.component';

const PARTS = [
  VerbenCalendarComponent,
  VerbenCalendarGridComponent,
  VerbenPeriodPanelComponent,
  VerbenPresetSearchComponent,
];

/**
 * <app-date-picker> and its parts. The parts are exported too, so a screen
 * can use, say, an inline <verben-calendar> without the field and popup.
 */
@NgModule({
  declarations: [DatePickerComponent, ...PARTS],
  imports: [CommonModule, OverlayModule],
  exports: [DatePickerComponent, ...PARTS],
})
export class DatePickerModule {}
