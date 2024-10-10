import { NgModule } from '@angular/core';
import { NotificationsSampleComponent } from './notifications-sample.component';
import { CommonModule } from '@angular/common';
import { NotificationModule } from 'verben-ng-ui/src/public-api';
import { RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    component: NotificationsSampleComponent,
  },
];

@NgModule({
  declarations:[NotificationsSampleComponent],
  imports: [
    RouterModule.forChild(appRoutes),
    CommonModule,
    NotificationModule
  ],
})
export class NotificationsSampleModule {}
