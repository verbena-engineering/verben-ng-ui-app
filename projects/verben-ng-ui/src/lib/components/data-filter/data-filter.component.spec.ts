import { ColumnDefinition, ColumnValueType } from '../data-table';
import { DataFilterComponent } from './data-filter.component';
import { FilterCondition } from './data-filter.types';

interface Row {
  status: string;
  age: number;
  isActive: boolean;
  createdAt: string;
}

const COLUMNS: ColumnDefinition<Row>[] = [
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    valueType: ColumnValueType.Enum,
    valueOptions: ['Draft', 'Sent', 'Paid'],
    isRequiredFilter: true,
  },
  {
    id: 'age',
    header: 'Age',
    accessorKey: 'age',
    valueType: ColumnValueType.Integer,
  },
  {
    id: 'isActive',
    header: 'Active',
    accessorKey: 'isActive',
    valueType: ColumnValueType.Bool,
  },
  {
    id: 'createdAt',
    header: 'Created At',
    accessorKey: 'createdAt',
    valueType: ColumnValueType.Date,
  },
];

/**
 * Exercised as a plain class rather than through TestBed: every behaviour under
 * test is component state, and the template's only inputs are `verben-svg` and
 * `verben-drop-down`, which would each need stubbing for no added coverage.
 */
function makeComponent(initialFilters?: FilterCondition[]) {
  const component = new DataFilterComponent<Row>();
  component.columns = COLUMNS;
  component.data = [];
  component.initialFilters = initialFilters;
  component.ngOnInit();
  return component;
}

/** Fills the operation row the way the template's bindings would. */
function fillOperationRow(
  component: DataFilterComponent<Row>,
  columnId: string,
  operator: string,
  value: FilterCondition['value']
) {
  component.onColumnSelect(columnId);
  component.currentFilter.operator = operator;
  component.currentFilter.value = value;
}

describe('DataFilterComponent', () => {
  describe('required filters', () => {
    it('reports required-ness from the column definition', () => {
      const component = makeComponent();
      expect(
        component.isRequired({
          columnId: 'status',
          operator: 'is',
          value: 'Draft',
        })
      ).toBe(true);
      expect(
        component.isRequired({ columnId: 'age', operator: 'equal', value: 30 })
      ).toBe(false);
    });

    it('refuses to delete a required filter but deletes an optional one', () => {
      const component = makeComponent([
        { columnId: 'status', operator: 'is', value: 'Draft' },
        { columnId: 'age', operator: 'equal', value: 30 },
      ]);

      component.deleteFilter(component.savedFilters[0]);
      expect(component.savedFilters.length).toBe(2);

      component.deleteFilter(component.savedFilters[1]);
      expect(component.savedFilters.length).toBe(1);
      expect(component.savedFilters[0].columnId).toBe('status');
    });

    it('pins required filters to the top of the visible list', () => {
      const component = makeComponent([
        { columnId: 'age', operator: 'equal', value: 30 },
        { columnId: 'isActive', operator: 'is', value: true },
        { columnId: 'createdAt', operator: 'on', value: '2026-07-31' },
        { columnId: 'status', operator: 'is', value: 'Draft' },
      ]);

      // Fourth in the saved list, but first — and so still visible — once the
      // list is trimmed to `maxVisibleItems`.
      expect(component.visibleFilters.length).toBe(3);
      expect(component.visibleFilters[0].columnId).toBe('status');
    });

    it('keeps required filters through a reset and reports what is left', () => {
      const component = makeComponent([
        { columnId: 'status', operator: 'is', value: 'Draft' },
        { columnId: 'age', operator: 'equal', value: 30 },
      ]);
      const emitted: FilterCondition[][] = [];
      component.filterApplied.subscribe((f) => emitted.push(f));
      spyOn(component.resetFilter, 'emit');

      component.resetAll();

      expect(component.savedFilters.length).toBe(1);
      expect(component.savedFilters[0].columnId).toBe('status');
      expect(emitted).toEqual([
        [{ columnId: 'status', operator: 'is', value: 'Draft' }],
      ]);
      expect(component.resetFilter.emit).not.toHaveBeenCalled();
    });

    it('clears everything and emits resetFilter when nothing is required', () => {
      const component = makeComponent([
        { columnId: 'age', operator: 'equal', value: 30 },
      ]);
      spyOn(component.resetFilter, 'emit');
      spyOn(component.filterApplied, 'emit');

      component.resetAll();

      expect(component.savedFilters.length).toBe(0);
      expect(component.resetFilter.emit).toHaveBeenCalled();
      expect(component.filterApplied.emit).not.toHaveBeenCalled();
    });

    it('emits a required filter even if it is not selected', () => {
      const component = makeComponent([
        { columnId: 'status', operator: 'is', value: 'Draft' },
      ]);
      component.savedFilters[0].selected = false;
      const emitted: FilterCondition[][] = [];
      component.filterApplied.subscribe((f) => emitted.push(f));

      component.applyFilters();

      expect(emitted[0].length).toBe(1);
      expect(component.activeFilterCount).toBe(1);
    });

    it('updates the existing chip rather than adding a second required one', () => {
      const component = makeComponent([
        { columnId: 'status', operator: 'is', value: 'Draft' },
      ]);

      fillOperationRow(component, 'status', 'isNot', 'Paid');
      component.addFilter();

      expect(component.savedFilters.length).toBe(1);
      expect(component.savedFilters[0]).toEqual({
        columnId: 'status',
        operator: 'isNot',
        value: 'Paid',
        selected: true,
      });
    });

    it('allows duplicate filters on an optional column', () => {
      const component = makeComponent();

      fillOperationRow(component, 'age', 'equal', 30);
      component.addFilter();
      fillOperationRow(component, 'age', 'greaterThan', 40);
      component.addFilter();

      expect(component.savedFilters.length).toBe(2);
    });
  });

  describe('editing a saved filter', () => {
    it('loads the filter into the operation row and writes it back in place', () => {
      const component = makeComponent([
        { columnId: 'age', operator: 'equal', value: 30 },
        { columnId: 'status', operator: 'is', value: 'Draft' },
      ]);
      const target = component.savedFilters[0];

      component.editFilter(target);
      expect(component.currentFilter).toEqual({
        columnId: 'age',
        operator: 'equal',
        value: 30,
      });
      expect(component.isEditing(target)).toBe(true);
      expect(component.isEditingRequired).toBe(false);

      component.currentFilter.value = 45;
      component.addFilter();

      expect(component.savedFilters.length).toBe(2);
      // Same object, same position — not removed and re-added at the top.
      expect(component.savedFilters[0]).toBe(target);
      expect(target.value).toBe(45);
      expect(component.isEditing(target)).toBe(false);
      expect(component.currentFilter).toEqual({});
    });

    it('locks the property while a required filter is being edited', () => {
      const component = makeComponent([
        { columnId: 'status', operator: 'is', value: 'Draft' },
      ]);

      component.editFilter(component.savedFilters[0]);

      expect(component.isEditingRequired).toBe(true);
    });

    it('converts a bool back to the dropdown string and to a boolean again', () => {
      const component = makeComponent([
        { columnId: 'isActive', operator: 'is', value: true },
      ]);
      const target = component.savedFilters[0];

      component.editFilter(target);
      // The dropdown's options are strings, since it gates its selected label
      // on truthiness and would render `false` as nothing picked.
      expect(component.currentFilter.value).toBe('true');

      component.currentFilter.value = 'false';
      component.addFilter();
      expect(target.value).toBe(false);
    });

    it('converts a restored Date into the native input format', () => {
      const component = makeComponent([
        { columnId: 'createdAt', operator: 'on', value: new Date(2026, 6, 31) },
      ]);

      component.editFilter(component.savedFilters[0]);

      expect(component.currentFilter.value).toBe('2026-07-31');
    });

    it('abandons the edit on clear, leaving the filter untouched', () => {
      const component = makeComponent([
        { columnId: 'age', operator: 'equal', value: 30 },
      ]);
      const target = component.savedFilters[0];

      component.editFilter(target);
      component.currentFilter.value = 99;
      component.clearCurrentFilter();

      expect(target.value).toBe(30);
      expect(component.isEditing(target)).toBe(false);
      expect(component.currentFilter).toEqual({});

      // The next add is a plain add, not a write-back over the abandoned edit.
      fillOperationRow(component, 'age', 'lessThan', 20);
      component.addFilter();
      expect(component.savedFilters.length).toBe(2);
      expect(target.value).toBe(30);
    });

    it('drops the edit when the filter being edited is deleted', () => {
      const component = makeComponent([
        { columnId: 'age', operator: 'equal', value: 30 },
      ]);
      const target = component.savedFilters[0];

      component.editFilter(target);
      component.deleteFilter(target);

      expect(component.savedFilters.length).toBe(0);
      expect(component.currentFilter).toEqual({});

      fillOperationRow(component, 'age', 'equal', 30);
      component.addFilter();
      expect(component.savedFilters.length).toBe(1);
    });
  });
});
