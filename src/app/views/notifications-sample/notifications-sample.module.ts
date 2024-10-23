import { NgModule } from '@angular/core';
import { NotificationsSampleComponent } from './notifications-sample.component';
import { CommonModule } from '@angular/common';
import { NotificationModule } from '../../../../projects/verben-ng-ui/src/lib/components/notification/notification.module';
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
