import { NgModule } from '@angular/core';
import { ThemeSwitcherDirective } from './theme-switcher.directive';

@NgModule({
  declarations: [ThemeSwitcherDirective],
  exports: [ThemeSwitcherDirective]
})
export class ThemeSwitcherModule {}
