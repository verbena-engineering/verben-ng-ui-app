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
  tempVisibleColumns: boolean[] = [];
  initialVisibleColumns: boolean[] = [];
  originalVisibleColumns: boolean[] = [];
  draggedIndex: number | null = null;

  ngOnInit() {
    this.initializeColumnVisibility();
    this.originalColumnOrder = [...this.columns];
  }

  private initializeColumnVisibility() {
    this.visibleColumns = this.columns.map((column) => column.checked);
    this.tempVisibleColumns = [...this.visibleColumns];
    this.initialVisibleColumns = [...this.visibleColumns];
    this.originalVisibleColumns = [...this.visibleColumns];
  }

  resetColumns() {
    this.tempVisibleColumns = [...this.originalVisibleColumns];
    this.columns = [...this.originalColumnOrder];
    this.saveColumnVisibility();
  }

  getSelectedColumnCount(): number {
    return this.tempVisibleColumns.filter((isVisible) => isVisible).length;
  }

  saveColumnVisibility() {
    this.columns.forEach((column, index) => {
      column.checked = this.tempVisibleColumns[index];
    });

    const selectedColumns: IDataFilter[] = this.columns.filter(
      (column) => column.checked
    ).map((column:IDataFilter) => ({
      name: column.name,
      checked: column.checked,
      type: column.type,
      value: column.name,
    }));
    this.columnsUpdated.emit(selectedColumns);

    this.visibleColumns = [...this.tempVisibleColumns];
    this.initialVisibleColumns = [...this.tempVisibleColumns];
  }

  cancelChanges() {
    this.tempVisibleColumns = [...this.visibleColumns];
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
    this.displayedColumns = this.showMore ? this.columns.length : 5;
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
    const draggedIndex = this.draggedIndex;
    if (draggedIndex !== null && draggedIndex !== index) {
      this.swapColumns(draggedIndex, index);
    }
    this.draggedIndex = null;
  }

  swapColumns(fromIndex: number, toIndex: number) {
    const tempColumn = this.columns[fromIndex];
    this.columns[fromIndex] = this.columns[toIndex];
    this.columns[toIndex] = tempColumn;

    const tempVisible = this.tempVisibleColumns[fromIndex];
    this.tempVisibleColumns[fromIndex] = this.tempVisibleColumns[toIndex];
    this.tempVisibleColumns[toIndex] = tempVisible;
  }
}
