import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { IconsComponent } from './icons.component';
import { IconService } from '../../services/icon.service';

@NgModule({
  declarations: [IconsComponent], // Declare the IconComponent
  imports: [CommonModule, HttpClientModule], // Import CommonModule and HttpClientModule
  exports: [IconsComponent], // Export the IconComponent so it can be used in other modules
  providers: [IconService], // Provide the IconService
})
export class IconModule {}