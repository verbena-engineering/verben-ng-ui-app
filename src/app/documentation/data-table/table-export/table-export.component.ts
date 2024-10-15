import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DataExportService,
  ExportItem,
  ExportProfile,
  Operation,
  Operators,
} from 'verben-ng-ui/src/public-api';

@Component({
  selector: 'app-table-export',
  templateUrl: './table-export.component.html',
  styleUrl: './table-export.component.scss',
})
export class TableExportComponent {
  @Input() data!: any[];
  @Output() exportDataEvent = new EventEmitter<Record<string, any>[]>();

  profiles: (ExportProfile & { selected: boolean })[] = [];
  groupItems: (ExportItem & { selected: boolean })[] = [];
  groupSearchTerm: string = '';
  newOperation: Operation = {
    id: '',
    name: '',
    field1: '',
    operator: Operators.add,
    field2: '',
  };
  numericProperties: string[] = [];
  isEditingOperation: boolean = false;
  tooltip: boolean = false;

  showing: number = 3;
  showing2: number = 3;
  operators: Operators[] = Object.values(Operators);

  constructor(private exportService: DataExportService) {}

  ngOnInit() {
    this.initializeGroupItems();
    this.updateProfiles();
  }

  ngOnChanges() {
    if (this.data) {
      this.initializeGroupItems();
    }
  }

  get filteredGroupItems() {
    return this.groupItems.filter((item) =>
      item.name.toLowerCase().includes(this.groupSearchTerm.toLowerCase())
    );
  }

  initializeGroupItems() {
    if (this.data && this.data.length > 0) {
      const properties = Object.keys(this.data[0]);
      this.exportService.setBaseProperties(properties);
      this.numericProperties = properties.filter(
        (prop) => typeof this.data[0][prop] === 'number'
      );
      this.updateGroupItems();
    }
  }

  updateProfiles() {
    this.profiles = this.exportService.getProfiles().map((profile) => ({
      ...profile,
      selected: false,
    }));
  }

  updateGroupItems() {
    this.groupItems = this.exportService.getAllItems().map((item) => ({
      ...item,
      selected: false,
    }));
  }

  addProfile() {
    const selectedItems = this.groupItems.filter((item) => item.selected);
    if (selectedItems.length > 0) {
      const newProfile: ExportProfile = {
        id: Date.now().toString(),
        name: `Profile ${this.profiles.length + 1}`,
        items: selectedItems,
      };
      this.exportService.addProfile(newProfile);
      this.updateProfiles();
      this.groupItems.forEach((item) => (item.selected = false));
    }
  }

  editProfile(profile: ExportProfile & { selected: boolean }) {
    // Set selected items in the group based on the profile's items
    this.groupItems.forEach((item) => {
      item.selected = profile.items.some(
        (profileItem) => profileItem.id === item.id
      );
    });

    // Remove the profile from the list (it will be re-added when user clicks "Add Profile")
    this.removeProfile(profile);
  }

  removeProfile(profile: ExportProfile & { selected: boolean }) {
    this.exportService.removeProfile(profile.id);
    this.updateProfiles();
  }

  addOrUpdateOperation() {
    if (
      this.newOperation.name &&
      this.newOperation.field1 &&
      this.newOperation.field2
    ) {
      if (this.isEditingOperation) {
        this.exportService.updateOperation(
          this.newOperation.id,
          this.newOperation
        );
      } else {
        const operation: Operation = {
          ...this.newOperation,
          id: Date.now().toString(),
        };
        this.exportService.addOperation(operation);
      }
      this.updateGroupItems();
      this.resetOperationForm();
    }
  }

  editOperation(operation: ExportItem & { selected: boolean }) {
    this.newOperation = { ...(operation as unknown as Operation) };
    this.isEditingOperation = true;
  }

  removeOperation(operation: ExportItem & { selected: boolean }) {
    this.exportService.removeOperation(operation.id);
    this.updateGroupItems();
  }

  resetOperationForm() {
    this.newOperation = {
      id: '',
      name: '',
      field1: '',
      operator: Operators.add,
      field2: '',
    };
    this.isEditingOperation = false;
  }

  resetAll() {
    this.exportService.resetAll();
    this.initializeGroupItems();
    this.updateProfiles();
    this.resetOperationForm();
  }

  exportData() {
    const selectedProfiles = this.profiles.filter(
      (profile) => profile.selected
    );
    if (selectedProfiles.length > 0) {
      const exportedData = this.exportService.exportData(
        this.data,
        selectedProfiles
      );
      this.exportDataEvent.emit(exportedData);
    } else {
      console.log('No profiles selected for export');
    }
  }
}
