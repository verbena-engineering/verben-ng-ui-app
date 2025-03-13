import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColumnDefinition } from '../data-table/data-table.types';

@Component({
  selector: 'lib-data-columns',
  templateUrl: './data-columns.component.html',
  styleUrl: './data-columns.component.css'
})
export class DataColumnsComponent<T> implements OnInit {
  @Input() columns!: ColumnDefinition<T>[];
  @Input() enableDragAndDrop: boolean = true;
  @Input() maxVisibleItems: number = 5;
  @Output() columnsUpdated = new EventEmitter<ColumnDefinition<T>[]>();

  visibleColumns: ColumnDefinition<T>[] = [];
  showAllColumns = false;
  draggedIndex: number | null = null;
  selectAll: boolean = false;
  columnVisibility: Map<string, boolean> = new Map();

  ngOnInit() {
    this.initializeColumns();
  }

  private initializeColumns() {
    this.visibleColumns = [...this.columns];
    // Initialize visibility map with current column states
    this.visibleColumns.forEach(column => {
      this.columnVisibility.set(column.id, true);
    });
    this.updateSelectAllStatus();
  }

  get columnsToShow() {
    return this.showAllColumns 
      ? this.visibleColumns 
      : this.visibleColumns.slice(0, this.maxVisibleItems);
  }

  // Drag and Drop functionality
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
    if (this.draggedIndex !== null && this.draggedIndex !== index) {
      this.swapColumns(this.draggedIndex, index);
    }
    this.draggedIndex = null;
  }

  private swapColumns(fromIndex: number, toIndex: number) {
    const temp = this.visibleColumns[fromIndex];
    this.visibleColumns[fromIndex] = this.visibleColumns[toIndex];
    this.visibleColumns[toIndex] = temp;
    this.emitUpdatedColumns();
  }

  // Column Selection functionality
  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    const newValue = this.selectAll;
    this.visibleColumns.forEach(column => {
      this.columnVisibility.set(column.id, newValue);
    });
    this.emitUpdatedColumns();
  }

  toggleColumnVisibility(columnId: string) {
    const currentValue = this.columnVisibility.get(columnId);
    this.columnVisibility.set(columnId, !currentValue);
    this.updateSelectAllStatus();
    this.emitUpdatedColumns();
  }

  isColumnVisible(columnId: string): boolean {
    return this.columnVisibility.get(columnId) ?? false;
  }

  private updateSelectAllStatus() {
    this.selectAll = Array.from(this.columnVisibility.values()).every(value => value);
  }

  getColumnHeader(column: ColumnDefinition<T>): string {
    return typeof column.header === 'function' 
      ? column.header({}) 
      : column.header;
  }

  resetColumns() {
    this.initializeColumns();
    this.emitUpdatedColumns();
  }

  emitUpdatedColumns() {
    const updatedColumns = this.visibleColumns.filter(column => 
      this.columnVisibility.get(column.id)
    );
    this.columnsUpdated.emit(updatedColumns);
  }

  get activeColumnCount(): number {
    return Array.from(this.columnVisibility.values()).filter(value => value).length;
  }
}
