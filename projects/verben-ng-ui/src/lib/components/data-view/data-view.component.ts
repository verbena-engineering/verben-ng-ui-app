import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SvgComponent } from '../svg/svg.component';

@Component({
  selector: 'verben-data-view',
  standalone: true,
  imports: [CommonModule, SvgComponent],
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css']
})
export class DataViewComponent {

  isGridView: boolean = true; 
 
  toggleView(): void {
    this.isGridView = !this.isGridView;
  }
}
