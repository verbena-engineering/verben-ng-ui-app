import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataExportService } from './data-export.service';
import {
  ExportItem,
  ExportProfile,
  Operation,
  Operators,
} from './data-export.types';

@Component({
  selector: 'lib-data-export',
  templateUrl: './data-export.component.html',
  styleUrl: './data-export.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataExportComponent {
  @Input() data!: any[];
  @Output() exportDataEvent = new EventEmitter<Record<string, any>[]>();

  profiles: (ExportProfile & { selected: boolean })[] = [];
  groupItems: (ExportItem & { selected: boolean })[] = [];
  newGroupForm: FormGroup;
  newOperation: Operation = {
    id: '',
    name: '',
    field1: '',
    operator: Operators.add,
    field2: '',
  };
  numericProperties: string[] = [];
  stringProperties: string[] = [];
  isEditingOperation: boolean = false;
  showAllProfiles: boolean = false;
  showAllGroups: boolean = false;

  operatorsNumeric: Operators[] = [
    Operators.add,
    Operators.subtract,
    Operators.multiply,
    Operators.divide,
  ];
  operatorsString: Operators[] = [
    Operators.concatenateSpace,
    Operators.concatenateCommaSpace,
    Operators.concatenateComma,
  ];

  constructor(
    private exportService: DataExportService,
    private fb: FormBuilder
  ) {
    this.newGroupForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.initializeGroupItems();
    this.updateProfiles();
  }

  ngOnChanges() {
    if (this.data) {
      this.initializeGroupItems();
    }
  }

  get visibleProfiles() {
    return this.showAllProfiles ? this.profiles : this.profiles.slice(0, 3);
  }

  get visibleGroups() {
    return this.showAllGroups ? this.groupItems : this.groupItems.slice(0, 3);
  }

  initializeGroupItems() {
    if (this.data && this.data.length > 0) {
      const properties = Object.keys(this.data[0]).filter((k) => k !== 'id');
      this.exportService.setBaseProperties(properties);
      this.numericProperties = properties.filter(
        (prop) => typeof this.data[0][prop] === 'number'
      );
      this.stringProperties = properties.filter(
        (prop) => typeof this.data[0][prop] === 'string'
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

  addGroup() {
    console.log('in');
    if (this.newGroupForm.valid) {
      const selectedItems = this.groupItems.filter((item) => item.selected);
      if (selectedItems.length > 0) {
        const newProfile: ExportProfile = {
          id: Date.now().toString(),
          name: this.newGroupForm.get('name')?.value,
          items: selectedItems,
        };
        this.exportService.addProfile(newProfile);
        this.updateProfiles();
        this.groupItems.forEach((item) => (item.selected = false));
        this.newGroupForm.reset();
        console.log('SELECTED');
      }
      console.log('VALID');
    }
  }

  editProfile(profile: ExportProfile & { selected: boolean }) {
    this.groupItems.forEach((item) => {
      item.selected = profile.items.some(
        (profileItem) => profileItem.id === item.id
      );
    });
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
    this.newGroupForm.reset();
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

  onField1Change() {
    this.newOperation.field2 = '';
    this.newOperation.operator = this.isNumericField(this.newOperation.field1)
      ? Operators.add
      : Operators.concatenateSpace;
  }

  isNumericField(field: string): boolean {
    return this.numericProperties.includes(field);
  }

  get availableOperators(): Operators[] {
    return this.isNumericField(this.newOperation.field1)
      ? this.operatorsNumeric
      : this.operatorsString;
  }

  get availableFields2(): string[] {
    return this.isNumericField(this.newOperation.field1)
      ? this.numericProperties
      : this.stringProperties;
  }

  toggleShowAllProfiles() {
    this.showAllProfiles = !this.showAllProfiles;
  }

  toggleShowAllGroups() {
    this.showAllGroups = !this.showAllGroups;
  }
}
