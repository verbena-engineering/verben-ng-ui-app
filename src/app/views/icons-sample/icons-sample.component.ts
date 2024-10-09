import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SvgComponent} from '../../../../projects/verben-ng-ui/src/lib/components/svg/svg.component'

@Component({
  selector: 'app-icons-sample',
  templateUrl: './icons-sample.component.html',
  styleUrl: './icons-sample.component.scss',
  standalone:true,
  imports:[SvgComponent,CommonModule]
})
export class IconsSampleComponent {

}
