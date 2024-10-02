import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgComponent } from '../svg/svg.component';
import { IFilter, FilterType } from '../../models/table-filter';
import { DropDownComponent } from '../drop-down/drop-down.component';
import { VerbenaInputModule } from '../../Verbena-input/verbena-input.module';
import { TooltipModule } from '../tooltip/tooltip.module';
import { ValidationModule } from '../../validate/validate.module';
@Component({
  selector: 'verben-table-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, SvgComponent, DropDownComponent, VerbenaInputModule,TooltipModule, ValidationModule],
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.css']
})
export class TableFilterComponent {
  @Input() filterOptions: FilterType[] = [FilterType.Date, FilterType.Credit];
  @Input() conditionOptions: string[] = ['Equal', 'Before', 'After', 'Less than', 'Greater than'];
  @Input() pd?: string;
  @Input() mg?: string;
  @Input() height?: string;
  @Input() width?: string;
  @Input() bgColor?: string;
  @Input() boxShadow?: string;
  @Input() textColor?: string;
  @Input() primaryColor?: string;
  @Input() secondaryColor?: string;
  @Input() tertiaryColor?: string;
  @Input() border?: string;
  @Input() borderRadius?: string;
  @Input() selectWidth?: string;
  @Output() filtersApplied = new EventEmitter<IFilter[]>();

  selectedFilterType: FilterType | null = null;
  selectedCondition: string = '';
  inputValue: string | number = '';
  savedFilters: IFilter[] = [];
  selectedFilters: IFilter[] = [];
  showAllFilters: boolean = false;
  readonly MAX_VISIBLE_FILTERS = 3;
  editIndex: number | null = null;
  checkAll: boolean = false;
  isDuplicateFilter: boolean = false;
  disableAddFilterBtn: boolean = false;
  disableApplyFilterBtn: boolean = true;
  duplicateMessage?:string = '';

  resetFilters() {
    this.selectedFilterType = null;
    this.selectedCondition = '';
    this.inputValue = '';
    this.savedFilters = [];
    this.editIndex = null;
    this.checkAll = false;
    this.isDuplicateFilter = false;
    this.disableApplyFilterBtn = true;
    this.duplicateMessage = ''
  }

  addFilter() {
    console.log({
      filter: this.selectedFilterType,
      condition: this.selectedCondition,
      value: this.inputValue
    });

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
    this.checkFilterButton();
  }

  toggleCheckbox(index: number) {
    this.savedFilters[index].checked = !this.savedFilters[index].checked;
    this.checkAll = this.savedFilters.every(item => item.checked);
  }

  deleteFilter(index: number) {
    this.savedFilters.splice(index, 1);
    this.checkDuplicateFilter();
    this.checkFilterButton();
    if (this.savedFilters.length === 0) {
      this.checkAll = false;
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
    this.selectedFilterType = null;
    this.selectedCondition = '';
    this.inputValue = '';
  }

  checkFilterButton() {
    this.disableApplyFilterBtn = this.savedFilters.length === 0;
  }

  toggleSelectAll(): void {
    this.checkAll = !this.checkAll;
    this.savedFilters.forEach(filter => filter.checked = this.checkAll);
  }

  checkDuplicateFilter(): void {
    const exists = this.savedFilters.some(
      filter =>
        filter.type === this.selectedFilterType &&
        filter.condition === this.selectedCondition
    );
    this.disableAddFilterBtn = exists;
    this.isDuplicateFilter = exists;
    this.duplicateMessage = 'This entry is a duplicate and cannot be added.'
  }
}
