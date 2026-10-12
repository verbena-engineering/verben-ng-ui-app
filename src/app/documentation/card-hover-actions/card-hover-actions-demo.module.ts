import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CardDataViewModule, CardModule } from 'verben-ng-ui';
import { CardHoverActionsDemoComponent } from './card-hover-actions-demo.component';

const routes: Routes = [{ path: '', component: CardHoverActionsDemoComponent }];

@NgModule({
  declarations: [CardHoverActionsDemoComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes), CardDataViewModule, CardModule],
})
export class CardHoverActionsDemoModule {}
