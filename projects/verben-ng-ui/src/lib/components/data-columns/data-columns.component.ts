import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColumnDefinition } from 'verben-ng-ui/src/lib/components/data-table';

@Component({
  selector: 'lib-data-columns',
  templateUrl: './data-columns.component.html',
  styleUrl: './data-columns.component.css',
})
export class DataColumnsComponent<T> implements OnInit, OnChanges {
  @Input() columns!: ColumnDefinition<T>[];
  @Input() enableDragAndDrop: boolean = true;
  @Input() maxVisibleItems: number = 5;
  /**
   * Optional restored/active selection: the columns that should be checked, in
   * the order to display them. When provided, the panel opens reflecting this
   * (these checked and ordered first, remaining columns shown unchecked).
   * Defaults to "all columns checked" when omitted.
   */
  @Input() selectedColumns?: ColumnDefinition<T>[];
  @Output() columnsUpdated = new EventEmitter<ColumnDefinition<T>[]>();

  visibleColumns: ColumnDefinition<T>[] = [];
  showAllColumns = false;
  draggedIndex: number | null = null;
  selectAll: boolean = false;
  columnVisibility: Map<string, boolean> = new Map();
  // Set once the user edits the panel, so later host input changes don't clobber
  // their in-progress selection. Reset to defaults by Reset.
  private userTouched = false;

  ngOnInit() {
    this.initializeColumns();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Re-derive from inputs whenever the host provides them (e.g. saved column
    // arrangement restored asynchronously), unless the user has started editing.
    if ((changes['selectedColumns'] || changes['columns']) && !this.userTouched) {
      this.initializeColumns();
    }
  }

  private initializeColumns() {
    this.columnVisibility = new Map();
    const selected = this.selectedColumns;

    if (selected && selected.length) {
      const selectedIds = new Set(selected.map((column) => column.id));
      const hidden = this.columns.filter(
        (column) => !selectedIds.has(column.id)
      );
      // Selected (checked) first, in their saved order, then the rest unchecked.
      this.visibleColumns = [...selected, ...hidden];
      this.visibleColumns.forEach((column) =>
        this.columnVisibility.set(column.id, selectedIds.has(column.id))
      );
    } else {
      this.visibleColumns = [...this.columns];
      this.visibleColumns.forEach((column) =>
        this.columnVisibility.set(column.id, true)
      );
    }

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
    this.userTouched = true;
    // Staged only — applied/emitted when the user clicks Save (see template).
  }

  // Column Selection functionality
  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    const newValue = this.selectAll;
    this.visibleColumns.forEach((column) => {
      this.columnVisibility.set(column.id, newValue);
    });
    this.userTouched = true;
    // Staged only — applied/emitted when the user clicks Save (see template).
  }

  toggleColumnVisibility(columnId: string) {
    const currentValue = this.columnVisibility.get(columnId);
    this.columnVisibility.set(columnId, !currentValue);
    this.updateSelectAllStatus();
    this.userTouched = true;
    // Staged only — applied/emitted when the user clicks Save (see template).
  }

  isColumnVisible(columnId: string): boolean {
    return this.columnVisibility.get(columnId) ?? false;
  }

  private updateSelectAllStatus() {
    this.selectAll = Array.from(this.columnVisibility.values()).every(
      (value) => value
    );
  }

  getColumnHeader(column: ColumnDefinition<T>): string {
    return typeof column.header === 'function'
      ? column.header({})
      : column.header;
  }

  resetColumns() {
    // Reset restores the default (all columns visible, config order) regardless
    // of the restored selection, then applies immediately.
    this.userTouched = true;
    this.columnVisibility = new Map();
    this.visibleColumns = [...this.columns];
    this.visibleColumns.forEach((column) =>
      this.columnVisibility.set(column.id, true)
    );
    this.updateSelectAllStatus();
    this.emitUpdatedColumns();
  }

  emitUpdatedColumns() {
    const updatedColumns = this.visibleColumns.filter((column) =>
      this.columnVisibility.get(column.id)
    );
    this.columnsUpdated.emit(updatedColumns);
  }

  get activeColumnCount(): number {
    return Array.from(this.columnVisibility.values()).filter((value) => value)
      .length;
  }
}
