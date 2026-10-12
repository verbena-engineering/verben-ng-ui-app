import { TableFilterComponent } from './table-filter.component';
import { DataFilterType } from 'verben-ng-ui/src/lib/models';
import { ColumnDefinition, ColumnValueType } from 'verben-ng-ui/src/lib/components/data-table';
import { FilterCondition } from '../data-filter/data-filter.types';

interface TestRow {
  name: string;
  age: number;
  status: string;
  isActive: boolean;
  registeredDate: string;
}

const TEST_COLUMNS: ColumnDefinition<TestRow>[] = [
  {
    id: 'name',
    header: 'Full Name',
    accessorKey: 'name',
    valueType: ColumnValueType.String,
  },
  {
    id: 'age',
    header: 'Age',
    accessorKey: 'age',
    valueType: ColumnValueType.Integer,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    valueType: ColumnValueType.Enum,
    valueOptions: ['Active', 'Pending', 'Suspended'],
    isRequiredFilter: true,
  },
  {
    id: 'isActive',
    header: 'Active',
    accessorKey: 'isActive',
    valueType: ColumnValueType.Bool,
  },
  {
    id: 'registeredDate',
    header: 'Registered Date',
    accessorKey: 'registeredDate',
    valueType: ColumnValueType.Date,
  },
];

describe('TableFilterComponent', () => {
  let component: TableFilterComponent;

  beforeEach(() => {
    component = new TableFilterComponent();
  });

  describe('Classic mode (filterOptions)', () => {
    beforeEach(() => {
      component.filterOptions = [
        { name: 'Username', type: DataFilterType.String, checked: false },
        { name: 'Amount', type: DataFilterType.Decimal, checked: false },
      ];
      component.ngOnInit();
    });

    it('initializes filterArray from filterOptions', () => {
      expect(component.isColumnsMode).toBe(false);
      expect(component.filterArray).toEqual(['Username', 'Amount']);
    });

    it('selects filter and loads conditions', () => {
      component.onFilterNameChange('Username');
      expect(component.selectedFilterType).toBe(DataFilterType.String);
      expect(component.conditionOptions.length).toBeGreaterThan(0);
    });

    it('adds and applies filter emitting legacy events', () => {
      const filtersAppliedSpy = spyOn(component.filtersApplied, 'emit');
      component.onFilterNameChange('Username');
      component.selectedCondition = 'Contains';
      component.inputValue = 'john';
      component.addFilter();

      expect(component.savedFilters.length).toBe(1);
      expect(component.savedFilters[0].name).toBe('Username');

      component.applyFilters();
      expect(filtersAppliedSpy).toHaveBeenCalled();
    });
  });

  describe('Columns mode (lib-data-filter drop-in)', () => {
    beforeEach(() => {
      component.columns = TEST_COLUMNS;
      component.data = [];
      component.initialFilters = [
        { columnId: 'status', operator: 'is', value: 'Active' },
        { columnId: 'age', operator: 'greaterThan', value: 25 },
      ];
      component.ngOnInit();
    });

    it('sets isColumnsMode to true and maps filter headers', () => {
      expect(component.isColumnsMode).toBe(true);
      expect(component.filterArray).toContain('Full Name');
      expect(component.filterArray).toContain('Age');
      expect(component.filterArray).toContain('Status');
    });

    it('hydrates initialFilters into savedFilters', () => {
      expect(component.savedFilters.length).toBe(2);
      expect(component.savedFilters[0].name).toBe('Status');
      expect(component.savedFilters[0].value).toBe('Active');
      expect(component.savedFilters[1].name).toBe('Age');
      expect(component.savedFilters[1].value).toBe(25);
    });

    it('identifies required filters based on ColumnDefinition', () => {
      const statusFilter = component.savedFilters[0];
      const ageFilter = component.savedFilters[1];
      expect(component.isRequiredFilter(statusFilter)).toBe(true);
      expect(component.isRequiredFilter(ageFilter)).toBe(false);
    });

    it('prevents deleting a required filter', () => {
      const statusFilter = component.savedFilters[0];
      component.deleteFilter(0);
      expect(component.savedFilters.length).toBe(2);
      expect(component.savedFilters).toContain(statusFilter);

      // But deletes optional filter
      component.deleteFilter(1);
      expect(component.savedFilters.length).toBe(1);
      expect(component.savedFilters[0].name).toBe('Status');
    });

    it('preserves required filters through resetFilters and emits resetFilter', () => {
      const resetSpy = spyOn(component.resetFilter, 'emit');
      component.resetFilters();

      expect(component.savedFilters.length).toBe(1);
      expect(component.savedFilters[0].name).toBe('Status');
      expect(resetSpy).toHaveBeenCalled();
    });

    it('emits filterApplied with FilterCondition[] mapped to column IDs and operator codes', () => {
      let emittedConditions: FilterCondition[] = [];
      component.filterApplied.subscribe((conds) => {
        emittedConditions = conds;
      });

      component.applyFilters();

      expect(emittedConditions.length).toBe(2);
      expect(emittedConditions[0]).toEqual({
        columnId: 'status',
        operator: 'is',
        value: 'Active',
      });
      expect(emittedConditions[1]).toEqual({
        columnId: 'age',
        operator: 'greaterThan',
        value: 25,
      });
    });

    it('handles adding new filter and updating required filter in-place', () => {
      component.onFilterNameChange('Full Name');
      component.selectedCondition = 'Starts With';
      component.inputValue = 'Alice';
      component.addFilter();

      expect(component.savedFilters.length).toBe(3);

      // Editing required filter replaces it rather than duplicating
      component.onFilterNameChange('Status');
      component.selectedCondition = 'Is Not';
      component.inputValue = 'Suspended';
      component.addFilter();

      expect(component.savedFilters.length).toBe(3);
      const updatedStatus = component.savedFilters.find((f) => f.name === 'Status');
      expect(updatedStatus?.condition).toBe('Is Not');
      expect(updatedStatus?.value).toBe('Suspended');
    });
  });
});
