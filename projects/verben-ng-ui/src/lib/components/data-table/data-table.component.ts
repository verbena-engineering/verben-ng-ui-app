import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChildren,
  effect,
  Input,
  OnChanges,
  QueryList,
  Signal,
  signal,
  SimpleChanges,
  untracked,
  WritableSignal,
} from '@angular/core';
import { ColumnDefinition } from './data-table.types';
import { ColumnDirective } from './column.directive';

@Component({
  selector: 'lib-data-table',
  // standalone: true,
  // imports: [],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends { id: string | number }>
  implements OnChanges
{
  @Input({ required: true }) data!: T[];
  @Input({ required: true }) columns!: ColumnDefinition<T>[];
  @ContentChildren(ColumnDirective)
  columnTemplates!: QueryList<ColumnDirective>;

  private editingRowsSignal = signal<Set<string | number>>(new Set());

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns']) {
      this.mergeColumnTemplates();
    }
  }

  ngAfterContentInit() {
    this.mergeColumnTemplates();
    this.columnTemplates.changes.subscribe(() => this.mergeColumnTemplates());
  }

  private mergeColumnTemplates() {
    const templates = this.columnTemplates?.toArray() || [];
    this.columns = this.columns.map((column) => {
      const matchingTemplate = templates.find((t) => t.columnId === column.id);
      return matchingTemplate
        ? { ...column, cellTemplate: matchingTemplate.template }
        : column;
    });
  }

  getCellValue = (row: T, column: ColumnDefinition<T>): any => {
    return column.accessorFn ? column.accessorFn(row) : (row as any)[column.id];
  };

  isRowEditing = computed(() => {
    const editingRows = this.editingRowsSignal();
    return (rowId: string | number) => editingRows.has(rowId);
  });

  toggleRowEdit(rowId: string | number) {
    this.editingRowsSignal.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  }
}
