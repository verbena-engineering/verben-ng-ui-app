import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgComponent } from '../svg/svg.component';
import { VerbenaInputModule } from '../../Verbena-input/verbena-input.module';
import { DataFilterType } from '../../models/table-filter';
import { IDataFilter } from '../../models/data-filter';

@Component({
  selector: 'verben-sort-table',
  standalone: true,
  imports: [CommonModule, FormsModule, SvgComponent, VerbenaInputModule],
  templateUrl: './sort-table.component.html',
  styleUrls: ['./sort-table.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SortTableComponent {
  @Input() enableDragAndDrop: boolean = false;
  @Input() sortOptions: IDataFilter[] = [];
  @Input() resetText: string = 'Reset';
  @Input() displayedOptions: number = 4;
  @Input() propertyText: string = 'Property';
  @Input() showMoreText: string = 'Show more';
  @Input() sortButtonText: string = 'Sort';
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
  @Output() selectedOptions = new EventEmitter<IDataFilter[]>();
  draggedIndex: number | null = null;
  visibleSortOptions: IDataFilter[] = [];
  hiddenSortOptions: IDataFilter[] = [];
  showMore: boolean = false;
  disableSortButton: boolean = false;

  selectedOrders: Map<number, 'asc' | 'desc'> = new Map();

  ngOnInit() {
    this.updateVisibleOptions();
    this.updateSortButtonState();
  }

  updateVisibleOptions() {
    if (this.sortOptions.length > this.displayedOptions) {
      this.visibleSortOptions = this.sortOptions.slice(
        0,
        this.displayedOptions
      );
      this.hiddenSortOptions = this.sortOptions.slice(this.displayedOptions);
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
    const selectedSorts = this.sortOptions.filter((option) => option.checked);

    const selectedSortDetails = selectedSorts.map((sort, index) => {
      return {
        type: sort.type || 'String',
        value:
          this.getSortOrder(
            sort.type,
            this.selectedOrders.get(index) || 'asc'
          ) || '',
        checked: sort.checked || false,
      };
    });
    this.selectedOptions.emit(selectedSortDetails);
    return selectedSortDetails;
  }

  getSortOrder(type: DataFilterType, selectedOrder: 'asc' | 'desc') {
    if (type === 'Number') {
      return selectedOrder === 'asc' ? '1-100' : '100-1';
    } else if (type === 'String') {
      return selectedOrder === 'asc' ? 'asc' : 'desc';
    } else if (type === 'Date') {
      return selectedOrder === 'asc' ? 'asc' : 'desc';
    }
    return null;
  }

  toggleSort(index: number) {
    const option = this.sortOptions[index];
    option.checked = !option.checked;

    if (option.checked) {
      this.selectedOrders.set(index, 'asc');
    } else {
      this.selectedOrders.delete(index);
    }
    this.updateSortButtonState();
  }

  resetSort() {
    this.sortOptions.forEach((option, index) => {
      option.checked = false;
      this.selectedOrders.delete(index); // remove sort order entry
    });
    this.updateSortButtonState();
  }

  updateSortButtonState() {
    this.disableSortButton = this.countSelectedSorts() === 0;
  }

  countSelectedSorts(): number {
    return this.sortOptions.filter((option) => option.checked).length;
  }

  setSortOrder(index: number, order: 'asc' | 'desc') {
    this.selectedOrders.set(index, order);
  }

  onDragStart(index: number, event: DragEvent) {
    if (!this.enableDragAndDrop) return;
    this.draggedIndex = index;
    event.dataTransfer?.setData('text/plain', String(index));
  }

  onDragOver(event: DragEvent) {
    if (!this.enableDragAndDrop) return;
    event.preventDefault();
  }

  onDrop(index: number, event: DragEvent) {
    if (!this.enableDragAndDrop) return;
    event.preventDefault();
    if (this.draggedIndex !== null) {
      this.swapColumns(this.draggedIndex, index);
    }
  }

  swapColumns(fromIndex: number, toIndex: number) {
    if (
      fromIndex < this.visibleSortOptions.length &&
      toIndex < this.visibleSortOptions.length
    ) {
      const temp = this.visibleSortOptions[fromIndex];
      this.visibleSortOptions[fromIndex] = this.visibleSortOptions[toIndex];
      this.visibleSortOptions[toIndex] = temp;

      const globalFromIndex = this.sortOptions.indexOf(temp);
      const globalToIndex = this.sortOptions.indexOf(
        this.visibleSortOptions[fromIndex]
      );

      if (globalFromIndex !== -1 && globalToIndex !== -1) {
        const tempGlobal = this.sortOptions[globalFromIndex];
        this.sortOptions[globalFromIndex] = this.sortOptions[globalToIndex];
        this.sortOptions[globalToIndex] = tempGlobal;
      }
    }
    this.draggedIndex = null;
  }
}
