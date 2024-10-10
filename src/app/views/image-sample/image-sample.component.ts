import { Component } from '@angular/core';
import { ImageComponent } from 'verben-ng-ui/src/public-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-sample',
  templateUrl: './image-sample.component.html',
  styleUrl: './image-sample.component.scss',
  standalone:true,
  imports:[ImageComponent,CommonModule]
})
export class ImageSampleComponent {

}
