import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgComponent } from '../svg/svg.component';
interface SortOption {
  label: string;
  order: 'asc' | 'desc'|null;
  selected: boolean;
}
@Component({
  selector: 'verben-sort-table',
  standalone: true,
  imports: [CommonModule,FormsModule,SvgComponent],
  templateUrl: './sort-table.component.html',
  styleUrl: './sort-table.component.scss'
})
export class SortTableComponent {
  @Input() sortOptions: SortOption[] =  [
    { label: 'Amount', order: null, selected: false },
    { label: 'Name', order: null, selected: false },
    { label: 'Date', order: null, selected: false },
    { label: 'Category', order: null, selected: false },
    { label: 'Rating', order: null, selected: false }
  ];
  

  visibleSortOptions: SortOption[] = [];
  hiddenSortOptions: SortOption[] = [];
  showMore: boolean = false;
  showMoreText: string = 'Show more';

  ngOnInit() {
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
      this.visibleSortOptions = [...this.visibleSortOptions, ...this.hiddenSortOptions];
      this.showMoreText = 'Show less';
    } else {
      this.updateVisibleOptions();
      this.showMoreText = 'Show more';
    }
  }

  resetSort() {
    this.sortOptions.forEach(option => {
      option.selected = false;
      option.order = null;
    });
  }  

  applySort() {
    const selectedSorts = this.sortOptions.filter(option => option.selected);
    console.log('Selected Sort Options: ', selectedSorts);
  }

  toggleSort(index: number) {
    console.log('Toggled sort option', index);
  }
}
