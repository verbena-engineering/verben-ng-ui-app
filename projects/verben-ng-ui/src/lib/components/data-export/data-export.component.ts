import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataExportService } from './data-export.service';
import { ExportProfile } from './data-export.types';

@Component({
  selector: 'lib-data-export',
  templateUrl: './data-export.component.html',
  styleUrl: './data-export.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataExportComponent {
  @Input() availableProperties: string[] = [];
  @Input() data!: any[];
  @Output() exportDataEvent = new EventEmitter<Partial<any>[]>();

  profileForm!: FormGroup;
  profileSelectionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public exportService: DataExportService
  ) {}

  ngOnInit() {
    this.initForm();
    this.initProfileSelectionForm();
  }

  private initForm() {
    const propertyControls = this.availableProperties.map(() => false);
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      properties: this.fb.array(propertyControls),
    });
  }

  private initProfileSelectionForm() {
    const profileControls = this.exportService.getProfiles().map(() => false);
    this.profileSelectionForm = this.fb.group({
      selectedProfiles: this.fb.array(profileControls),
    });
  }

  onSubmit() {
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
      this.initProfileSelectionForm(); // Reinitialize selection form with new profile
    }
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
