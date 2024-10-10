import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardDataViewModule } from '../card-data-view/card-data-view.module';
import { SvgModule } from '../svg/svg.module';
import { DataTableModule } from '../../../../../../src/app/documentation/data-table/data-table.module';
import { CardData } from '../card-data-view/card-data';

@Component({
  selector: 'verben-data-view',
  standalone: true,
  imports: [CommonModule, SvgModule,CardDataViewModule,DataTableModule],
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css']
})
export class DataViewComponent {
  isGridView: boolean = true; 
  cardDataArray: CardData[] = [
    {
      title: 'Card 1',
      body: [
        { title: 'Detail 1', value: 'Value for detail 1' },
        { title: 'Detail 2', value: 'Value for detail 2' }
      ]
    },
    {
      title: 'Card 2',
      body: [
        { title: 'Detail 1', value: 'Value for detail 1' },
        { title: 'Detail 2', value: 'Value for detail 2' }
      ]
    },
    {
      title: 'Card 3',
      body: [
        { title: 'Detail 1', value: 'Value for detail 1' },
        { title: 'Detail 2', value: 'Value for detail 2' }
      ]
    }
  ];
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
