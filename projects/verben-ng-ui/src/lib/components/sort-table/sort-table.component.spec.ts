import { SortTableComponent } from './sort-table.component';
import { DataFilterType, IDataFilter } from 'verben-ng-ui/src/lib/models';
import { ColumnDefinition, ColumnValueType } from 'verben-ng-ui/src/lib/components/data-table';
import { SortCondition, SortDirection } from 'verben-ng-ui/src/lib/components/data-sort';

interface TestUser {
  id: string;
  name: string;
  age: number;
  joined: string;
}

const TEST_COLUMNS: ColumnDefinition<TestUser>[] = [
  {
    id: 'name',
    header: 'Full Name',
    accessorKey: 'name',
    valueType: ColumnValueType.String,
  },
  {
    id: 'age',
    header: 'User Age',
    accessorKey: 'age',
    valueType: ColumnValueType.Integer,
  },
  {
    id: 'joined',
    header: 'Joined Date',
    accessorKey: 'joined',
    valueType: ColumnValueType.Date,
  },
];

describe('SortTableComponent', () => {
  let component: SortTableComponent<TestUser>;

  beforeEach(() => {
    component = new SortTableComponent<TestUser>();
  });

  describe('Classic mode (sortOptions)', () => {
    beforeEach(() => {
      component.sortOptions = [
        { name: 'Name', type: DataFilterType.String, checked: false },
        { name: 'Age', type: DataFilterType.Number, checked: false },
      ];
      component.ngOnInit();
    });

    it('initializes visibleSortOptions correctly', () => {
      expect(component.isColumnsMode).toBe(false);
      expect(component.sortOptions.length).toBe(2);
      expect(component.visibleSortOptions.length).toBe(2);
    });

    it('selects option and emits selectedOptions on applySort', () => {
      let emitted: IDataFilter[] = [];
      component.selectedOptions.subscribe((opts) => (emitted = opts));

      component.toggleSort(0);
      component.setSortOrder(0, 'desc');
      component.applySort();

      expect(emitted.length).toBe(1);
      expect(emitted[0].name).toBe('Name');
      expect(emitted[0].value).toBe('desc');
    });

    it('resets selections and emits resetSortData', () => {
      const resetSpy = spyOn(component.resetSortData, 'emit');
      component.toggleSort(0);
      component.resetSort();

      expect(component.sortOptions[0].checked).toBe(false);
      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe('Columns mode (data-sort drop-in)', () => {
    beforeEach(() => {
      component.columns = TEST_COLUMNS;
      component.data = [
        { id: '1', name: 'John Doe', age: 30, joined: '2026-01-01' },
      ];
      component.ngOnInit();
    });

    it('maps columns to sortOptions with headers and types', () => {
      expect(component.isColumnsMode).toBe(true);
      expect(component.sortOptions.length).toBe(3);
      expect(component.sortOptions[0].name).toBe('Full Name');
      expect(component.sortOptions[0].type).toBe(DataFilterType.String);
      expect(component.sortOptions[1].name).toBe('User Age');
      expect(component.sortOptions[1].type).toBe(DataFilterType.Number);
      expect(component.sortOptions[2].name).toBe('Joined Date');
      expect(component.sortOptions[2].type).toBe(DataFilterType.Date);
    });

    it('emits sortApplied with SortCondition[] mapped to column IDs and SortDirection', () => {
      let emittedSorts: SortCondition[] = [];
      component.sortApplied.subscribe((sorts) => (emittedSorts = sorts));

      // Select Full Name with desc and Joined Date with asc
      component.toggleSort(0);
      component.setSortOrder(0, 'desc');

      component.toggleSort(2);
      component.setSortOrder(2, 'asc');

      component.applySort();

      expect(emittedSorts.length).toBe(2);
      expect(emittedSorts[0]).toEqual({
        columnId: 'name',
        direction: SortDirection.Desc,
      });
      expect(emittedSorts[1]).toEqual({
        columnId: 'joined',
        direction: SortDirection.Asc,
      });
    });

    it('emits resetFilter on resetSort and resetAll', () => {
      const resetFilterSpy = spyOn(component.resetFilter, 'emit');
      component.toggleSort(0);
      component.resetAll();

      expect(component.sortOptions[0].checked).toBe(false);
      expect(resetFilterSpy).toHaveBeenCalled();
    });
  });
});
