import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DataFilterType, IDataFilter } from 'verben-ng-ui/src/lib/models';
import { Config } from 'verben-ng-ui/src/lib/models';

@Component({
  selector: 'verben-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.css'],
})
export class TableFilterComponent implements OnInit {
  @Input() filterOptions: IDataFilter[] = [];
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
  @Input() maxFilterLength: number = 3;
  @Input() savedFilters: IDataFilter[] = [];
  @Input() tooltip: boolean = false;
  @Input() saveCallback?: (items: IDataFilter[]) => Promise<void>;
  @Output() filtersApplied = new EventEmitter<any>();
  @Output() resetSortData = new EventEmitter<any>();
  filterArray: string[] = [];
  selectedFilterValue: string = '';
  selectedFilterType: DataFilterType | null = null;
  conditionOptions: string[] = [];
  selectedCondition: string | undefined = '';
  inputValue?: string | number;
  selectedFilters: IDataFilter[] = [];
  showAllFilters: boolean = false;
  editIndex: number | null = null;
  checkAll: boolean = false;
  isDuplicateFilter: boolean = false;
  disableAddFilterBtn: boolean = false;
  //disableApplyFilterBtn: boolean = true;
  duplicateMessage?: string = '';
  configInstance: Config;
  storageKey: string = 'savedFilters';
  filterCount: number = 0;

  constructor() {
    this.configInstance = new Config();
  }

  ngOnInit(): void {
    this.filterArray = this.filterOptions.map((item) => item.name);
  }

  onFilterNameChange(selectedFilterValue: string) {
    const selectedFilter = this.filterOptions.find(
      (option) => option.name === selectedFilterValue,
    );

    if (selectedFilter) {
      this.selectedFilterType = selectedFilter.type;
      this.conditionOptions =
        this.configInstance.getConditionOptions(this.selectedFilterType) || [];
      this.selectedCondition = '';
    }
  }

  resetFilters() {
    this.selectedFilterType = null;
    this.selectedCondition = '';
    this.inputValue = '';
    // this.savedFilters = [];
    this.savedFilters.forEach((x) => {
      x.checked = false;
    });
    this.editIndex = null;
    this.checkAll = false;
    this.isDuplicateFilter = false;
    // this.disableApplyFilterBtn = true;
    this.duplicateMessage = '';
    localStorage.removeItem(this.storageKey);
    this.filterCount = this.savedFilters.filter(
      (item) => item.checked === true,
    ).length;
    this.resetSortData.emit();
    this.applyFilters(true);
  }

  addFilter() {
    if (
      !this.selectedFilterValue ||
      !this.selectedCondition ||
      !this.inputValue
    ) {
      return;
    }

    if (this.editIndex === null && this.isDuplicateFilter) {
      return;
    }
    // 00:00 23:59
    if (
      (this.selectedFilterType as DataFilterType) == DataFilterType.Date &&
      this.selectedCondition == 'On'
    ) {
      const leftFilter: IDataFilter = {
        name: this.selectedFilterValue,
        type: this.selectedFilterType || DataFilterType.String,
        condition: 'After',
        value: (this.inputValue as string).concat(' 00:00'),
        checked: true,
      };

      const rightFilter: IDataFilter = {
        name: this.selectedFilterValue,
        type: this.selectedFilterType || DataFilterType.String,
        condition: 'Before',
        value: (this.inputValue as string).concat(' 23:59'),
        checked: true,
      };

      const filters = [leftFilter, rightFilter];

      for (let newFilter of filters) {
        if (this.editIndex !== null) {
          const isDuplicate = this.savedFilters.some(
            (filter, index) =>
              filter.name === newFilter.name &&
              filter.condition === newFilter.condition &&
              index !== this.editIndex,
          );

          if (isDuplicate) {
            continue;
          }
          this.savedFilters[this.editIndex] = newFilter;
          this.editIndex = null;
        } else {
          if (
            this.savedFilters.some(
              (filter) =>
                filter.name === newFilter.name &&
                filter.condition === newFilter.condition,
            )
          ) {
            continue;
          }
          this.savedFilters.push(newFilter);
          this.filterCount = this.savedFilters.filter(
            (item) => item.checked === true,
          ).length;
        }
      }
    } else {
      const newFilter: IDataFilter = {
        name: this.selectedFilterValue,
        type: this.selectedFilterType || DataFilterType.String,
        condition: this.selectedCondition,
        value: this.inputValue,
        checked: true,
      };

      if (this.editIndex !== null) {
        const isDuplicate = this.savedFilters.some(
          (filter, index) =>
            filter.name === newFilter.name &&
            filter.condition === newFilter.condition &&
            index !== this.editIndex,
        );

        if (isDuplicate) {
          return;
        }
        this.savedFilters[this.editIndex] = newFilter;
        this.editIndex = null;
      } else {
        if (
          this.savedFilters.some(
            (filter) =>
              filter.name === newFilter.name &&
              filter.condition === newFilter.condition,
          )
        ) {
          return;
        }
        this.savedFilters.push(newFilter);
        this.filterCount = this.savedFilters.filter(
          (item) => item.checked === true,
        ).length;
      }
    }

    this.clearOperationSection();
    // this.checkFilterButton();
  }

  toggleCheckbox(index: number) {
    this.savedFilters[index].checked = !this.savedFilters[index].checked;
    this.checkAll = this.savedFilters.every((item) => item.checked);
    this.filterCount = this.savedFilters.filter(
      (item) => item.checked === true,
    ).length;
  }

  deleteFilter(index: number) {
    this.savedFilters.splice(index, 1);
    this.checkDuplicateFilter();
    //  this.checkFilterButton();
    this.filterCount = this.savedFilters.filter(
      (item) => item.checked === true,
    ).length;
    if (this.savedFilters.length === 0) {
      this.checkAll = false;
    }
    if (this.saveCallback) {
      this.saveCallback(this.savedFilters);
    }
  }

  editFilter(index: number) {
    const filter = this.savedFilters[index];
    this.selectedFilterType = filter.type;
    this.selectedFilterValue = filter.name;
    this.onFilterNameChange(this.selectedFilterValue);
    this.selectedCondition = filter.condition;
    this.inputValue = filter.value;
    this.editIndex = index;
  }

  applyFilters(skipSave: boolean = false) {
    this.selectedFilters = this.savedFilters.filter((filter) => filter.checked);
    if (this.saveCallback && !skipSave) {
      this.saveCallback(this.savedFilters);
    }
    this.filtersApplied.emit(this.selectedFilters);
    this.filtersApplied.emit(this.storageKey);
  }

  toggleShowMore() {
    this.showAllFilters = !this.showAllFilters;
  }

  get visibleFilters() {
    return this.showAllFilters
      ? this.savedFilters
      : this.savedFilters.slice(0, this.maxFilterLength);
  }

  clearOperationSection() {
    this.selectedFilterValue = '';
    this.selectedCondition = '';
    this.inputValue = '';
  }

  // checkFilterButton() {
  //   this.disableApplyFilterBtn = this.savedFilters.length === 0;
  // }

  toggleSelectAll(): void {
    this.checkAll = !this.checkAll;
    this.savedFilters.forEach((filter) => (filter.checked = this.checkAll));
    this.filterCount = this.savedFilters.filter(
      (item) => item.checked === true,
    ).length;
  }

  checkDuplicateFilter(): void {
    if (this.editIndex !== null) {
      const exists = this.savedFilters.some(
        (filter, index) =>
          filter.name === this.selectedFilterValue &&
          filter.condition === this.selectedCondition &&
          index !== this.editIndex,
      );
      this.disableAddFilterBtn = exists;
      this.isDuplicateFilter = exists;
      this.duplicateMessage = exists
        ? 'This entry is a duplicate and cannot be added.'
        : '';
    } else {
      const exists = this.savedFilters.some(
        (filter) =>
          filter.name === this.selectedFilterValue &&
          filter.condition === this.selectedCondition,
      );
      this.disableAddFilterBtn = exists;
      this.isDuplicateFilter = exists;
      this.duplicateMessage = exists
        ? 'This entry is a duplicate and cannot be added.'
        : '';
    }
  }
}
