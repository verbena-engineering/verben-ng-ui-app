import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IDataFilter } from '../../models/data-filter';

interface Item {
  [key: string]: any;
}

@Component({
  selector: 'verben-visible-column',
  templateUrl: './visible-column.component.html',
  styleUrls: ['./visible-column.component.css'],
})
export class VisibleColumnComponent {
  @Input() columns: IDataFilter[] = [];
  @Input() items: Item[] = [];
  @Input() enableDragAndDrop: boolean = true;
  @Input() displayedColumns: number = 5;
  @Input() showMore: boolean = false;
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
  @Output() columnsUpdated = new EventEmitter<IDataFilter[]>();

  originalColumnOrder: IDataFilter[] = [];
  visibleColumns: boolean[] = [];
  draggedIndex: number | null = null;
  selectAll: boolean = false;

  ngOnInit() {
    this.originalColumnOrder = [...this.columns];
    this.initializeColumnVisibility();
  }

  private initializeColumnVisibility() {
    this.visibleColumns = this.columns.map((column) => column.checked);
    this.updateSelectAllStatus();
  }

  resetColumns() {
    // Reset columns to the original order
    this.columns = JSON.parse(JSON.stringify(this.originalColumnOrder)); // Ensure it's a deep copy
    this.initializeColumnVisibility();
    this.selectAll = false; // Reset select all
    this.updateSelectAllStatus();
  }

  getSelectedColumnCount(): number {
    return this.visibleColumns.filter((isVisible) => isVisible).length;
  }

  saveColumnVisibility() {
    this.columns.forEach((column, index) => {
      column.checked = this.visibleColumns[index];
    });

    const selectedColumns = this.columns.filter(column => column.checked);
    this.columnsUpdated.emit(selectedColumns);
    console.log(selectedColumns);
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
    this.displayedColumns = this.showMore ? this.columns.length : 5;
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.visibleColumns = this.visibleColumns.map(() => this.selectAll);
  }

  updateSelectAllStatus() {
    this.selectAll = this.visibleColumns.every(isVisible => isVisible);
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
    if (this.draggedIndex !== null && this.draggedIndex !== index) {
      this.swapColumns(this.draggedIndex, index);
    }
    this.draggedIndex = null;
  }

  private swapColumns(fromIndex: number, toIndex: number) {
    [this.columns[fromIndex], this.columns[toIndex]] = [this.columns[toIndex], this.columns[fromIndex]];
    [this.visibleColumns[fromIndex], this.visibleColumns[toIndex]] = [this.visibleColumns[toIndex], this.visibleColumns[fromIndex]];
  }
}
