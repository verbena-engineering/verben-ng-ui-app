import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataExportService } from './data-export.service';
import { ExportProfile, Operation } from './data-export.types';

@Component({
  selector: 'lib-data-export',
  templateUrl: './data-export.component.html',
  styleUrl: './data-export.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataExportComponent {
  @Input() availableProperties: string[] = [];
  @Input() data!: any[];
  @Output() exportDataEvent = new EventEmitter<Record<string, any>[]>();

  profileForm!: FormGroup;
  operationForm!: FormGroup;
  profileSelectionForm!: FormGroup;
  numericalProperties: string[] = [];

  constructor(
    private fb: FormBuilder,
    public exportService: DataExportService
  ) {}

  ngOnInit() {
    this.initForms();
    this.updateNumericalProperties();
    this.exportService.updateDefaultProfile(this.availableProperties);
  }

  private initForms() {
    this.initProfileForm();
    this.initOperationForm();
    this.initProfileSelectionForm();
  }

  private initProfileForm() {
    const propertyControls = this.availableProperties.map(() => false);
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      properties: this.fb.array(propertyControls),
    });
  }

  private initOperationForm() {
    this.operationForm = this.fb.group({
      name: ['', Validators.required],
      field1: ['', Validators.required],
      operator: ['', Validators.required],
      field2: ['', Validators.required],
    });
  }

  private initProfileSelectionForm() {
    const profileControls = this.exportService.getProfiles().map(() => false);
    this.profileSelectionForm = this.fb.group({
      selectedProfiles: this.fb.array(profileControls),
    });
  }

  private updateNumericalProperties() {
    if (this.data && this.data.length > 0) {
      this.numericalProperties = Object.keys(this.data[0]).filter(
        (key) => typeof this.data[0][key] === 'number'
      );
    }
  }

  onSubmitOperation() {
    if (this.operationForm.valid) {
      const operation: Operation = {
        id: Date.now().toString(),
        ...this.operationForm.value,
      };
      this.exportService.addOperation(operation);
      this.operationForm.reset();
      this.updateAvailableProperties();
    }
  }

  onSubmitProfile() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      const selectedProperties = this.availableProperties.filter(
        (_, i) => formValue.properties[i]
      );
      const newProfile: ExportProfile = {
        id: Date.now().toString(),
        name: formValue.name,
        properties: selectedProperties,
      };
      this.exportService.addProfile(newProfile);
      this.profileForm.reset();
      this.initProfileSelectionForm();
    }
  }

  editOperation(operation: Operation) {
    this.operationForm.patchValue(operation);
  }

  removeOperation(id: string) {
    this.exportService.removeOperation(id);
    this.updateAvailableProperties();
  }

  editProfile(profile: ExportProfile) {
    this.profileForm.patchValue({
      name: profile.name,
      properties: this.availableProperties.map((prop) =>
        profile.properties.includes(prop)
      ),
    });
  }

  removeProfile(id: string) {
    this.exportService.removeProfile(id);
    this.initProfileSelectionForm();
  }

  resetAll() {
    this.exportService.resetAll();
    this.initForms();
    this.updateAvailableProperties();
  }

  private updateAvailableProperties() {
    this.availableProperties = [
      ...Object.keys(this.data[0]),
      ...this.exportService.getOperations().map((op) => op.name),
    ];
    this.initProfileForm();
    this.exportService.updateDefaultProfile(this.availableProperties);
  }

  exportData() {
    const selectedProfiles = this.exportService
      .getProfiles()
      .filter(
        (_, i) =>
          (this.profileSelectionForm.get('selectedProfiles') as FormArray).at(i)
            .value
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
