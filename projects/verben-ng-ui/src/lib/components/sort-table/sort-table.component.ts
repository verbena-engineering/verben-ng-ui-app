import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgComponent } from '../svg/svg.component';

interface SortOption {
  label: string;
  order: 'asc' | 'desc' | null;
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
  styleUrls: ['./sort-table.component.scss'],
})
export class SortTableComponent {
  @Input() columns: string[] = [];
  @Input() items: Item[] = [];

  sortOptions: SortOption[] = [];
  visibleSortOptions: SortOption[] = [];
  hiddenSortOptions: SortOption[] = [];
  showMore: boolean = false;
  showMoreText: string = 'Show more';

  ngOnInit() {
    this.generateSortOptions();
  }

  generateSortOptions() {
    this.sortOptions = this.columns.map((column) => ({
      label: column.charAt(0).toUpperCase() + column.slice(1),
      order: null,
      selected: false,
    }));

    this.updateVisibleOptions();
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
      this.visibleSortOptions = [
        ...this.visibleSortOptions,
        ...this.hiddenSortOptions,
      ];
      this.showMoreText = 'Show less';
    } else {
      this.updateVisibleOptions();
      this.showMoreText = 'Show more';
    }
  }

  applySort() {
    const selectedSorts = this.sortOptions.filter(
      (option) => option.selected && option.order !== null
    );

    if (selectedSorts.length > 0) {
      this.items.sort((a, b) => {
        let comparison = 0;

        for (const sort of selectedSorts) {
          if (
            typeof a[sort.label.toLowerCase()] === 'string' &&
            typeof b[sort.label.toLowerCase()] === 'string'
          ) {
            comparison = a[sort.label.toLowerCase()].localeCompare(
              b[sort.label.toLowerCase()]
            );
          } else {
            comparison =
              a[sort.label.toLowerCase()] - b[sort.label.toLowerCase()];
          }

          if (sort.order === 'desc') {
            comparison *= -1;
          }

          if (comparison !== 0) {
            return comparison;
          }
        }
        return 0;
      });
    }
  }

  toggleSort(index: number) {
    const option = this.sortOptions[index];
    if (option.selected) {
      option.order = option.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.resetSort();
      option.selected = true;
      option.order = 'asc';
    }
  }

  resetSort() {
    this.sortOptions.forEach((option) => {
      option.selected = false;
      option.order = null;
    });
  }

  countSelectedSorts(): number {
    return this.sortOptions.filter((option) => option.selected).length;
  }
}
