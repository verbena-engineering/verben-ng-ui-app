import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnDefinition } from 'verben-ng-ui/src/lib/components/data-table/data-table.types';
import { TableStyles } from 'verben-ng-ui/src/lib/components/data-table/style.types';
import { DataExportService } from 'verben-ng-ui/src/public-api';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  dropdownOptions: string[] = ['Tester', 'Admin', 'Staff'];

  tableData = signal<YourDataType[]>([]);

  tableColumns: ColumnDefinition<YourDataType>[] = [
    {
      id: 'select',
      header: 'Select',
    },
    {
      id: 'customer',
      header: 'Customer',
      accessorFn: (row) => ({
        names: row.activityDetails
          ?.map((detail) => `${detail.firstName} ${detail.lastName}`)
          .join(', '),
        participants: row.numberOfParticipants,
      }),
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
    },
    {
      id: 'actions',
      header: 'Actions',
    },
  ];

  table2Styles = defaultTableStyles;

  stickyStyles = stickyTableStyles;

  testTableStyles = testTableStyles;

  tableColumns2: ColumnDefinition<YourDataType>[] = [
    {
      id: 'select',
      header: 'Select',
    },
    {
      id: 'names',
      header: 'Full Name',
      accessorFn: (row) => `${row.names?.firstName} ${row.names?.lastName}`,
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
    },
    {
      id: 'age',
      header: 'Age',
      accessorKey: 'age',
    },
    {
      id: 'money',
      header: 'Money',
      accessorKey: 'money',
    },
    {
      id: 'message',
      header: 'Message',
      accessorKey: 'message',
    },
    {
      id: 'actions',
      header: 'Actions',
    },
  ];

  controlledCols = signal<ColumnDefinition<YourDataType>[]>(this.tableColumns2);

  tableColumns3: ColumnDefinition<YourDataType>[] = [
    {
      id: 'names',
      header: 'Full Name',
      accessorFn: (row) => `${row.names?.firstName} ${row.names?.lastName}`,
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
    },
    {
      id: 'age',
      header: 'Age',
      accessorKey: 'age',
    },
    {
      id: 'money',
      header: 'Money',
      accessorKey: 'money',
    },
  ];

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private exportService: DataExportService
  ) {}

  async ngOnInit() {
    this.form = this.fb.group({
      customer: this.fb.group({
        names: ['', Validators.required],
        participants: [0, [Validators.required, Validators.min(1)]],
      }),
      // Add other form controls as needed
    });

    setTimeout(() => {
      this.tableData.set(
        Array.from({ length: 10 }, (_, index) => ({
          id: `ACTIVITY-${index + 1}`,
          activityDetails: Array.from(
            { length: Math.floor(Math.random() * 5) + 1 },
            () => generateRandomName()
          ),
          numberOfParticipants: Math.floor(Math.random() * 20) + 1,
          role: 'Tester',
          names: generateRandomName(),
          age: Math.floor(Math.random() * 50) + 1,
          money: Math.floor(Math.random() * 500) + 1,
          message:
            'Dark seas and dark towers. Night sky and wry smile. Loneliness, nonetheless.',
        }))
      );
    }, 500);
  }

  changeCols() {
    this.controlledCols.set(pickRandomSubset(this.tableColumns2));
    this.tableData.update((d) => d.slice(1));
    console.log(this.controlledCols);
  }

  onRowEdit(editedRow: YourDataType) {
    console.log('Row edited:', editedRow);
    // Handle the edited row
  }

  onSelectionChange(selectedRows: YourDataType[]) {
    console.log('Selection changed:', selectedRows);
    // Handle the selection change
  }

  onRowSave(row: YourDataType) {
    if (this.form.valid) {
      this.tableData.update((data) => {
        const index = data.findIndex((item) => item.id === row.id);
        if (index !== -1) {
          data[index] = row;
        }
        return [...data];
      });
      console.log('Saved row:', row);
    }
  }

  onRowDelete(row: YourDataType) {
    this.tableData.update((data) => data.filter((item) => item.id !== row.id));
    console.log('Deleted row:', row);
  }

  getDataProperties(): string[] {
    if (this.tableData && this.tableData.length > 0) {
      return Object.keys(this.tableData()[0]);
    }
    return [];
  }

  handleExport(exportedData: Partial<any>[]) {
    // Here you would implement the actual download functionality
    console.log('Exported data:', exportedData);
    // For example, you could convert to CSV and trigger a download
    this.downloadCSV(exportedData);
  }

  private downloadCSV(data: Partial<any>[]) {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) => headers.map((header) => row[header]).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  reverseNameTransform(namesString: string) {
    // Handle empty or undefined input
    if (!namesString) {
      return { activityDetails: [], numberOfParticipants: 0 };
    }

    // Split the comma-separated string and clean up whitespace
    const names = namesString.split(',').map((name) => name.trim());

    // Transform each name into an activity detail object
    const activityDetails = names.map((fullName) => {
      const [firstName, ...lastNameParts] = fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      return {
        firstName,
        lastName,
      };
    });

    return {
      activityDetails,
      numberOfParticipants: activityDetails.length,
    };
  }

  reverseNameTransform2(namesString: string, count: number) {
    // Split the comma-separated string and clean up whitespace
    const names = namesString.split(',').map((name) => name.trim());

    // Transform each name into an activity detail object
    const activityDetails = names.map((fullName) => {
      const [firstName, ...lastNameParts] = fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      return {
        firstName,
        lastName,
      };
    });

    return {
      activityDetails: activityDetails.slice(0, count),
      numberOfParticipants: count,
    };
  }
}

// Function to generate random first and last names
function generateRandomName(): { firstName: string; lastName: string } {
  const firstNames = [
    'John',
    'Jane',
    'Emily',
    'Michael',
    'Sarah',
    'William',
    'Olivia',
    'James',
    'Ava',
    'Robert',
  ];
  const lastNames = [
    'Doe',
    'Smith',
    'Johnson',
    'Williams',
    'Jones',
    'Brown',
    'Davis',
    'Miller',
    'Wilson',
    'Moore',
  ];

  return {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
  };
}
interface YourDataType {
  id: string;
  activityDetails: { firstName: string; lastName: string }[];
  numberOfParticipants: number;
  role?: string;
  age?: number;
  money?: number;
  message?: string;
  names?: { firstName: string; lastName: string };
}

// Default styles
const defaultTableStyles: TableStyles = {
  // borderCollapse: 'collapse',
  position: 'relative',
  borderSpacing: '0px',
  border: '1px solid #D4A007',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  width: '100%',
  maxHeight: '678px',
  header: {
    backgroundColor: '#ffffff',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '2px solid #e0e0e0',
    position: 'sticky',
    top: '0px',
  },
  rows: {
    even: {
      backgroundColor: '#F7F6FE',
    },
    odd: {
      backgroundColor: '#FFFFFF',
    },
    nth: {
      interval: 5,
      style: {
        backgroundColor: '#f0f0f0',
      },
    },
  },
  cells: {
    padding: '12px 16px',
    borderBottom: '1px solid #e0e0e0',
  },
  footer: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    padding: '12px 16px',
    borderTop: '2px solid #e0e0e0',
  },
};

// Default styles
const testTableStyles: TableStyles = {
  // borderCollapse: 'collapse',
  position: 'relative',
  borderSpacing: '0px',
  overflow: 'hidden',
  width: '100%',
  maxHeight: '678px',
  fontSize: '14px',
  header: {
    backgroundColor: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'left',
    padding: '12px 16px',
    position: 'sticky',
    top: '0px',
  },
  rows: {
    even: {
      backgroundColor: '#F7F6FE',
    },
    odd: {
      backgroundColor: '#FFFFFF',
    },
  },
  cells: {
    padding: '12px 16px',
    fontWeight: '400',
  },
};

const stickyTableStyles: TableStyles = {
  fontFamily: '"Fraunces", serif',
  fontSize: '125%',
  whiteSpace: 'nowrap',
  margin: '0',
  border: '1px solid black',
  borderCollapse: 'separate',
  borderSpacing: '0',
  tableLayout: 'fixed',
  cells: {
    border: '1px solid black',
    padding: '0.5rem 1rem',
  },
  header: {
    stickyTop: true,
    zIndex: 1,
    background: 'lightyellow',
    padding: '3px',
  },
  footer: {
    stickyBottom: true,
    zIndex: 1,
    background: 'lightyellow',
    padding: '3px',
  },
  body: {
    background: '#fff',
    padding: '4px 5px',
    textAlign: 'center',
  },
  firstColumn: {
    stickyLeft: true,
    zIndex: 2,
    background: 'lightyellow',
    fontWeight: '100',
    fontStyle: 'italic',
    textAlign: 'left',
  },
  lastColumn: {
    stickyRight: true,
    zIndex: 1,
    background: 'lightyellow',
  },
};

function pickRandomSubset<T>(arr: T[], count?: number): T[] {
  // If count is not specified or exceeds array length, pick a random number of items
  const pickCount = count ?? Math.floor(Math.random() * arr.length) + 1;

  // Ensure pickCount doesn't exceed array length
  const safePickCount = Math.min(pickCount, arr.length);

  // Create a copy of the original array to shuffle
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  // Return the first 'safePickCount' items
  return shuffled.slice(0, safePickCount);
}
