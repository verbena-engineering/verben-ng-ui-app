import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgComponent } from '../svg/svg.component';
import { SortType } from './model/SortOptionType';

interface SortOption {
  label: string;
  type: SortType;
  selected: boolean;
}

interface Item {
  [key: string]: any;
}

@Component({
  selector: 'verben-sort-table',
  standalone: true,
  imports: [CommonModule, FormsModule, SvgComponent],
  templateUrl: './sort-table.component.html',
  styleUrls: ['./sort-table.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SortTableComponent {
  @Input() sortOptions: SortOption[] = [];
  @Input() items: Item[] = [];
  @Input() resetText: string = 'Reset'; // Default text for reset
  @Input() propertyText: string = 'Property'; // Default text for property label
  @Input() showMoreText: string = 'Show more'; // Default text for "show more"
  @Input() sortButtonText: string = 'Sort'; // Default text for the sort button
  draggedIndex: number | null = null;
  visibleSortOptions: SortOption[] = [];
  hiddenSortOptions: SortOption[] = [];
  showMore: boolean = false;
  dateFilters: { startDate: string; endDate: string }[] = [];

  ngOnInit() {
    this.updateVisibleOptions();
    this.sortOptions.forEach((option, index) => {
      if (option.type === 'date') {
        this.dateFilters[index] = { startDate: '', endDate: '' };
      }
    });
  }

  updateVisibleOptions() {
    if (this.sortOptions.length > 3) {
      this.visibleSortOptions = this.sortOptions.slice(0, 3);
      this.hiddenSortOptions = this.sortOptions.slice(3);
      this.showMore = true;
    } else {
      this.visibleSortOptions = this.sortOptions;
      this.showMore = false;
    }
  }

  toggleShowMore() {
    if (this.showMoreText === 'Show more') {
      this.visibleSortOptions.push(...this.hiddenSortOptions);
      this.showMoreText = 'Show less';
    } else {
      this.updateVisibleOptions();
      this.showMoreText = 'Show more';
    }
  }

  applySort() {
    const selectedSorts = this.sortOptions.filter(option => option.selected);

    if (selectedSorts.length > 0) {
      this.items.sort((a, b) => {
        for (const sort of selectedSorts) {
          const label = sort.label; // Use the label directly for sorting
          let comparison = 0;

          switch (sort.type) {
            case 'string':
              comparison = a[label].localeCompare(b[label]);
              break;
            case 'number':
              comparison = a[label] - b[label];
              break;
            case 'date':
              const index = this.sortOptions.indexOf(sort);
              const aDate = new Date(a[label]).getTime();
              const bDate = new Date(b[label]).getTime();
              const start = new Date(this.dateFilters[index]?.startDate).getTime();
              const end = new Date(this.dateFilters[index]?.endDate).getTime();

              const aInRange = this.dateFilters[index].startDate && this.dateFilters[index].endDate 
                ? (aDate >= start && aDate <= end) : true;
              const bInRange = this.dateFilters[index].startDate && this.dateFilters[index].endDate 
                ? (bDate >= start && bDate <= end) : true;

              comparison = aInRange === bInRange ? 0 : (aInRange ? -1 : 1);
              break;
          }

          if (comparison !== 0) {
            return comparison; // Return the first non-zero comparison
          }
        }
        return 0; // If all comparisons are zero
      });
    }
  }

  toggleSort(index: number) {
    const option = this.sortOptions[index];
    option.selected = !option.selected;
    this.applySort(); // Apply sorting whenever a sort option is toggled
  }

  resetSort() {
    this.sortOptions.forEach(option => option.selected = false);
  }

  countSelectedSorts(): number {
    return this.sortOptions.filter(option => option.selected).length;
  }

  updateDateFilter(index: number, startDate: string, endDate: string) {
    if (this.dateFilters[index]) {
      this.dateFilters[index].startDate = startDate;
      this.dateFilters[index].endDate = endDate;
    }
  }

  onDragStart(index: number, event: DragEvent) {
    this.draggedIndex = index;
    event.dataTransfer?.setData('text/plain', String(index));
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(index: number, event: DragEvent) {
    event.preventDefault();
    if (this.draggedIndex !== null) {
      this.swapColumns(this.draggedIndex, index);
    }
  }

  swapColumns(fromIndex: number, toIndex: number) {
    const temp = this.visibleSortOptions[fromIndex];
    this.visibleSortOptions[fromIndex] = this.visibleSortOptions[toIndex];
    this.visibleSortOptions[toIndex] = temp;

    const mainTemp = this.sortOptions[fromIndex];
    this.sortOptions[fromIndex] = this.sortOptions[toIndex];
    this.sortOptions[toIndex] = mainTemp;

    this.draggedIndex = null;
  }
}
