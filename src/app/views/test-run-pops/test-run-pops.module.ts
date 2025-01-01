import { NgModule } from '@angular/core';
import { TestRunPopsComponent } from './test-run-pops.component';
import { CommonModule } from '@angular/common';
import { CardDataViewModule, CardModule, DataExportModule, DataTableModule, DataViewModule, DropDownModule, SortTableModule, SvgModule, TableFilterModule, VerbenaBadgeModule, VerbenaButtonModule, VerbenaInputModule, VerbenaSwitchModule, VerbenDialogueModule, VerbenPopUpModule, VisibleColumnModule } from 'verben-ng-ui/src/public-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    component: TestRunPopsComponent,
  },
];

@NgModule({
  declarations: [TestRunPopsComponent],
  imports: [
    CommonModule,
    DataTableModule,
    CardModule,
    SvgModule,
    DataViewModule,
    CardDataViewModule,
    SortTableModule,
    VisibleColumnModule,
    TableFilterModule,
    DataExportModule,
    FormsModule,
    ReactiveFormsModule,
    VerbenaInputModule,
    VerbenaButtonModule,
    VerbenaBadgeModule,
    VerbenDialogueModule,
    DropDownModule,
    VerbenaSwitchModule,
    VerbenPopUpModule,
    RouterModule.forChild(appRoutes),
  ],
  exports: [],
})
export class TestRunPopsModule {}