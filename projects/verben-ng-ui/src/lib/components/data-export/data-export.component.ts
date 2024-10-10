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
  @Input() data!: any[];
  @Output() exportDataEvent = new EventEmitter<Record<string, any>[]>();

  profileForm!: FormGroup;
  operationForm!: FormGroup;
  profileSelectionForm!: FormGroup;
  baseProperties: string[] = [];
  allProperties: string[] = [];

  constructor(
    private fb: FormBuilder,
    public exportService: DataExportService
  ) {}

  ngOnInit() {
    this.initForms();
    this.updateProperties();
  }

  private initForms() {
    this.initProfileForm();
    this.initOperationForm();
    this.initProfileSelectionForm();
  }

  private initProfileForm() {
    const propertyControls = this.allProperties.map(() => false);
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

  private updateProperties() {
    if (this.data && this.data.length > 0) {
      this.baseProperties = Object.keys(this.data[0]);
      this.exportService.setBaseProperties(this.baseProperties);
    }
    this.allProperties = this.exportService.getAllProperties();
    this.initProfileForm();
  }

  onSubmitOperation() {
    if (this.operationForm.valid) {
      const operation: Operation = {
        id: Date.now().toString(),
        ...this.operationForm.value,
      };
      this.exportService.addOperation(operation);
      this.operationForm.reset();
      this.updateProperties();
    }
  }

  onSubmitProfile() {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      const selectedProperties = this.allProperties.filter(
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
    this.updateProperties();
  }

  editProfile(profile: ExportProfile) {
    this.profileForm.patchValue({
      name: profile.name,
      properties: this.allProperties.map((prop) =>
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
    this.updateProperties();
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
