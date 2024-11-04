import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

interface ViewState {
  isSearch?: boolean;
  isColumn?: boolean;
  isFilter?: boolean;
  isSort?: boolean;
  isExport?: boolean;
  isSelect?: boolean;
  isCreate?:boolean
}

@Component({
  selector: 'verben-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
})
export class DataViewComponent implements OnInit {
  @Input() buttonClass?: string;
  @Input() iconClass?: string;
  @Input() activeIconClass?: string=""
  @Input() columnCustomClass?:string=''
  @Input() filterCustomClass?:string=''
  @Input() sortCustomClass?:string=''
  @Input() exportCustomClass?:string=''
  @Input() selectCustomClass?:string=''
  @Input() createCustomClass:string=''
  @Input() tableIcon: string = 'grid-3';
  @Input() cardIcon: string = 'list-view';
  @Input() cardClass: string = '';
  @Input() tableClass: string = '';
  @Input() viewState: ViewState = {
    isSearch: true,
    isColumn: true,
    isFilter: true,
    isSort: true,
    isExport: true,
    isSelect: true,
    isCreate:true
  };

  @Input() searchTemplate?: Node;
  @Input() columnTemplate?: Node;
  @Input() filterTemplate?: Node;
  @Input() sortTemplate?: Node;
  @Input() exportTemplate?: Node;

  @Input() selectedColumnCount?: number = 0;
  @Input() selectedSortCount: number = 0;
  @Input() selectedFilterTableCount: number = 0;
  @Input() inputWidth: string="350px";
  @Input()showColumnChild: boolean = false;
  @Input() showSortChild: boolean = false;
  @Input() showFilterChild: boolean = false;
  @Input() showExportChild: boolean = false;
  @Input() create: boolean = false;
  @Input() showSelected: boolean = false;

  @Output() viewChange = new EventEmitter<boolean>();
  @Output() stateChange = new EventEmitter<{ key: string; value: boolean }>();

  isTableView: boolean = false;

  ngOnInit(): void {}

  toggleView(): void {
    this.isTableView = !this.isTableView;
    this.viewChange.emit(this.isTableView);
  }

  onSearch(event: any): void {
    this.stateChange.emit({ key: 'search', value: event.target.value });
  }

  // Generalized toggle method for managing UI components
  toggleChildView(viewType: string): void {
    switch (viewType) {
      case 'column':
        this.showColumnChild = !this.showColumnChild;
        this.resetChildViewsExcept('column');
        break;
      case 'filter':
        this.showFilterChild = !this.showFilterChild;
        this.resetChildViewsExcept('filter');
        break;
      case 'sort':
        this.showSortChild = !this.showSortChild;
        this.resetChildViewsExcept('sort');
        break;
      case 'select':
        this.showSelected = !this.showSelected;
        this.resetChildViewsExcept('select');
        break;
      case 'export':
        this.showExportChild = !this.showExportChild;
        this.resetChildViewsExcept('export');
        break;
        case 'create':
          this.create = !this.create;
          this.resetChildViewsExcept('create');
          break;
    }
    this.stateChange.emit({ key: viewType, value: this.getChildViewState(viewType) });
  }

  // Reset other child views when one is toggled
  resetChildViewsExcept(viewType: string): void {
    if (viewType !== 'column') this.showColumnChild = false;
    if (viewType !== 'filter') this.showFilterChild = false;
    if (viewType !== 'sort') this.showSortChild = false;
    if (viewType !== 'select') this.showSelected = false;
    if (viewType !== 'export') this.showExportChild = false;
    if (viewType !== 'create') this.create = false;
  }

  // Helper method to get the state of a specific child view
  getChildViewState(viewType: string): boolean {
    switch (viewType) {
      case 'column':
        return this.showColumnChild;
      case 'filter':
        return this.showFilterChild;
      case 'sort':
        return this.showSortChild;
      case 'select':
        return this.showSelected;
      case 'export':
        return this.showExportChild;
        case 'create':
        return this.create;
      default:
        return false;
    }
  }
}
