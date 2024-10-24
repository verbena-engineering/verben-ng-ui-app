import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogueSampleComponent } from './dialogue-sample.component';
import { CommonModule } from '@angular/common';
import { VerbenDialogueModule } from 'verben-ng-ui/src/public-api';


const routes: Routes = [{ path: '', component:DialogueSampleComponent  }];

@NgModule({
  declarations: [DialogueSampleComponent],
  imports: [ RouterModule.forChild(routes),CommonModule,VerbenDialogueModule],
})
export class DialogueSampleModule {}
