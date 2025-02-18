import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChipComponent } from './chip.component';
import { ChipModule, SharedModule } from 'verben-ng-ui/src/public-api';
import { RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    component: ChipComponent,
  },
];

@NgModule({
  declarations: [ChipComponent],
  imports: [
    RouterModule.forChild(appRoutes),
    CommonModule,
    ChipModule,
    FormsModule,
    SharedModule,
  ],
})
export class ChipExampleModule {}
