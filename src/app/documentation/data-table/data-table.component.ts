import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnDefinition } from 'verben-ng-ui/src/lib/components/data-table/data-table.types';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  tableData: YourDataType[] = Array.from({ length: 10 }, (_, index) => ({
    id: `ACTIVITY-${index + 1}`,
    activityDetails: Array.from(
      { length: Math.floor(Math.random() * 5) + 1 },
      () => generateRandomName()
    ),
    numberOfParticipants: Math.floor(Math.random() * 20) + 1,
    role: 'Tester',
  }));

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

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      customer: this.fb.group({
        names: ['', Validators.required],
        participants: [0, [Validators.required, Validators.min(1)]],
      }),
      // Add other form controls as needed
    });
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
      // Find the index of the row in tableData
      const index = this.tableData.findIndex((item) => item.id === row.id);
      if (index !== -1) {
        // Update the row in tableData
        this.tableData[index] = row;
        // If you're using OnPush change detection, you might need to create a new reference
        this.tableData = [...this.tableData];
      }
      console.log('Saved row:', row);
    }
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
}
