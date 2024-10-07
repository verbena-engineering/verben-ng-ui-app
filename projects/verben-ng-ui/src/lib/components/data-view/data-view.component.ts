import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Output() viewChange = new EventEmitter<boolean>();


  @Input() buttonClass?: string;
  @Input() iconClass?: string;
  @Input() activeIconClass?: string;


  @Input() gridIcon: string = 'table-view';
  @Input() listIcon: string = 'list-view';

  toggleView(): void {
    this.isGridView = !this.isGridView;
    this.viewChange.emit(this.isGridView);
  }
}
