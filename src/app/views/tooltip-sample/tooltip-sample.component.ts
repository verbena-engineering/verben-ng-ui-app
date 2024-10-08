import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core';
import { TooltipComponent } from 'verben-ng-ui/src/public-api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tooltip-sample',
  templateUrl: './tooltip-sample.component.html',
  styleUrl: './tooltip-sample.component.scss',
  standalone:true,
  imports:[TooltipComponent,CommonModule]
})

export class TooltipSampleComponent {
  tooltips: boolean[] = [];

  @ViewChildren(TooltipComponent) tooltipComponents!: QueryList<TooltipComponent>;

  constructor() {
    this.tooltips = Array(5).fill(false);
  }

  showTooltip(index: number) {
    this.tooltips[index] = true;
  }

  hideTooltip(index: number) {
    this.tooltips[index] = false;
  }


}
