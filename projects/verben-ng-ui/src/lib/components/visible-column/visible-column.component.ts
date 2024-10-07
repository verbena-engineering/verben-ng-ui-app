import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgComponent } from '../svg/svg.component';
import { Column } from '../../models/column-filter';

interface Item {
  [key: string]: any;
}

@Component({
  selector: 'verben-visible-column',
  standalone: true,
  imports: [CommonModule, FormsModule, SvgComponent],
  templateUrl: './visible-column.component.html',
  styleUrls: ['./visible-column.component.css'],
})

export class VisibleColumnComponent {
  @Input() columns: Column[] = [];
  @Input() items: Item[] = [];
  @Input() enableDragAndDrop: boolean =true;
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
  @Output() columnsUpdated = new EventEmitter<Column[]>(); 

  visibleColumns: boolean[] = [];
  tempVisibleColumns: boolean[] = [];
  initialVisibleColumns: boolean[] = [];
  originalVisibleColumns: boolean[] = [];
  draggedIndex: number | null = null;

  ngOnInit() {
    this.initializeColumnVisibility();
  }

  private initializeColumnVisibility() {
    this.visibleColumns = this.columns.map((column) => column.checked);
    this.tempVisibleColumns = [...this.visibleColumns];
    this.initialVisibleColumns = [...this.visibleColumns];
    this.originalVisibleColumns = [...this.visibleColumns];
  }

  resetColumns() {
    this.tempVisibleColumns = [...this.originalVisibleColumns];
  }

  getSelectedColumnCount(): number {
    return this.tempVisibleColumns.filter((isVisible) => isVisible).length;
  }

  saveColumnVisibility() {
    this.columns.forEach((column, index) => {
      column.checked = this.tempVisibleColumns[index];
    });

    const selectedColumns = this.columns.filter(column => column.checked);
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
