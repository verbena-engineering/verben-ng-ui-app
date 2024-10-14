import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'verben-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
})
export class DataViewComponent implements OnInit {
  @Input() buttonClass?: string;
  @Input() iconClass?: string;
  @Input() activeIconClass?: string;
  @Input() gridIcon: string = 'table-view';
  @Input() listIcon: string = 'list-view';
  @Input() isSearch: boolean = true;
  @Input() isColumn: boolean = true;
  @Input() isFilter: boolean = true;
  @Input() isSort: boolean = true;
  @Input() isExport: boolean = true;
  @Input() isSelect: boolean = true;
  @Input() searchTemplate?: any;
  @Input() columnTemplate?: any;
  @Input() filterTemplate?: any;
  @Input() sortTemplate?: any;
  @Input() exportTemplate?: any;
  @Input() selectedColumnCount?: number = 0;
  @Input() selectedSortCount: number = 0;
  @Input() selectedFilterTableCount: number = 0;
  @Input() showColumnChild: boolean = false;
  @Input() showSortChild: boolean = false;
  @Input() showSelected:boolean=false
  @Input() showFilterChild: boolean = false;
  @Output() searchChange = new EventEmitter<string>();
  @Output() columnChange = new EventEmitter<boolean>();
  @Output() filterChange = new EventEmitter<boolean>();
  @Output() sortChange = new EventEmitter<boolean>();
  @Output() exportChange = new EventEmitter<boolean>();
  @Output() selectedChange = new EventEmitter<boolean>();
  @Output() viewChange = new EventEmitter<boolean>();
  isGridView: boolean = true;

  ngOnInit(): void {
    
  }
  toggleView(): void {
    this.isGridView = !this.isGridView;
    this.viewChange.emit(this.isGridView);
  }

  onSearch(event: any): void {
    this.searchChange.emit(event.target.value);
  }

  onColumnClick(): void {
    this.showColumnChild = !this.showColumnChild;
    this.columnChange.emit(this.showColumnChild);

  }

  onFilterClick(): void {
    this.showFilterChild = !this.showFilterChild;
    this.filterChange.emit(this.showFilterChild);
  }
  onSelectAllClick(): void {
    this.showSelected = !this.showSelected;
    this.selectedChange.emit(this.showSelected);
  }

  onSortClick(): void {
    this.showSortChild = !this.showSortChild;
    this.sortChange.emit(this.showSortChild);
  }

  onExportClick(): void {
    this.exportChange.emit();
  }
}
