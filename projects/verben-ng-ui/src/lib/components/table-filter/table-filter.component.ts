import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgComponent } from '../svg/svg.component';
import { IFilter } from '../../models/table-filter';

@Component({
  selector: 'verben-table-filter',
  standalone: true,
  imports: [CommonModule,FormsModule,SvgComponent],
  templateUrl: './table-filter.component.html',
  styleUrl: './table-filter.component.css'
})

export class TableFilterComponent {
  @Input() filterOptions: string[] = ['Date', 'Credit'];
  @Input() conditionOptions: any[] = [
    { value: 'equal', label: 'Equal' },
    { value: 'before', label: 'Before'},
    { value: 'after', label: 'After'},
    { value: 'less than', label: 'Less than'},
    { value: 'greater than', label: 'Greater than'},
  ];
  @Input() pd?:string ;
  @Input() mg?:string ;
  @Input() height?:string ;
  @Input() width?:string ;
  @Input() bgColor?:string ;
  @Input() boxShadow?:string ;
  @Input() textColor?:string ;
  @Input() primaryColor?:string ;
  @Input() secondaryColor?:string ;
  @Input() tertiaryColor?:string ;
  @Input() border?:string ;
  @Input() borderRadius?:string;
  @Output() filtersApplied = new EventEmitter<IFilter[]>();


  selectedFilterType: string = '';
  selectedCondition: string = '';
  inputValue: string | number = '';
  savedFilters: IFilter[] = [];
  selectedFilters: IFilter[] = [];
  showAllFilters: boolean = false;
  readonly MAX_VISIBLE_FILTERS = 3;
  editIndex: number | null = null;
  checkAll:boolean = false;
  isDuplicateFilter: boolean = false;
  disableAddFilterBtn:boolean = false;
  disableApplyFilterBtn:boolean = false;

  resetFilters() {
    this.selectedFilterType = '';
    this.selectedCondition = '';
    this.inputValue = '';
    this.savedFilters = [];
    this.editIndex = null;
    this.checkAll = false;
    this.isDuplicateFilter = false; 
  }

  addFilter() {
    if (!this.selectedFilterType || !this.selectedCondition || !this.inputValue) {
      return; 
    }

    if (this.isDuplicateFilter) {
      return;
    }

    const newFilter: IFilter = {
      type: this.selectedFilterType,
      condition: this.selectedCondition,
      value: this.inputValue,
      checked: false
    };

    if (this.editIndex !== null) {
      this.savedFilters[this.editIndex] = newFilter;
      this.editIndex = null;
    } else {
      this.savedFilters.push(newFilter);
    }
    this.clearOperationSection();
  }

  toggleCheckbox(index: number) {
    this.savedFilters[index].checked = !this.savedFilters[index].checked;
    this.checkAll = this.savedFilters.every(item => item.checked)
  }

  deleteFilter(index: number) {
    this.savedFilters.splice(index, 1);
    this.checkDuplicateFilter();
    if(this.savedFilters.length === 0){
    this.checkAll = false
    }
  }

  editFilter(index: number) {
    const filter = this.savedFilters[index];
    this.selectedFilterType = filter.type;
    this.selectedCondition = filter.condition;
    this.inputValue = filter.value;
    this.editIndex = index;
  }
 
  applyFilters() {
    this.selectedFilters = this.savedFilters.filter(filter => filter.checked);
    this.filtersApplied.emit(this.selectedFilters);
  }

  toggleShowMore() {
    this.showAllFilters = !this.showAllFilters;
  }

  get visibleFilters() {
    return this.showAllFilters
      ? this.savedFilters 
      : this.savedFilters.slice(0, this.MAX_VISIBLE_FILTERS); 
  }

  clearOperationSection() {
    this.selectedFilterType = '';
    this.selectedCondition = '';
    this.inputValue = '';
  }


  toggleSelectAll(): void {
    this.checkAll = !this.checkAll
    if(this.checkAll === true){ 
      this.savedFilters.forEach(filter => filter.checked = true);
    }else if (this.checkAll === false){ 
      this.savedFilters.forEach(filter => filter.checked = false);
    }
  }
  
  checkDuplicateFilter(): void {
    const exists = this.savedFilters.some(
      filter =>
        filter.type === this.selectedFilterType &&
        filter.condition === this.selectedCondition 
    );
    this.disableAddFilterBtn = exists
    this.isDuplicateFilter = exists;
  }
}
