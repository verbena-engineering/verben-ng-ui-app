import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-verbena-input-textarea',
  templateUrl: './verbena-input-textarea.component.html',
  styleUrl: './verbena-input-textarea.component.scss'
})
export class VerbenaInputTextareaComponent {
  // Your existing properties
  testMail: string = '';
  email: string = '';
  age: string = '';
  decimalValue: string = '';
  quantity: number = 1;
  number: number = 3;
  value: any;

  // ====================================
  // NEW: Properties for testing disabled
  // ====================================
  
  // For template-driven forms (using [(ngModel)] with [disabled] binding)
  isDisabled: boolean = false;
  isInputDisabled: boolean = false;
  
  // For reactive forms - add more controls to test
  form = new FormGroup({
    quantity: new FormControl(5),
    email: new FormControl(''),
    textarea: new FormControl(''),
    password: new FormControl('')
  });

  // ====================================
  // NEW: Methods to test disabled state
  // ====================================

  // Toggle textarea disabled state (for template-driven)
  toggleTextareaDisabled() {
    this.isDisabled = !this.isDisabled;
    console.log('📝 Textarea disabled:', this.isDisabled);
  }

  // Toggle input disabled state (for template-driven)
  toggleInputDisabled() {
    this.isInputDisabled = !this.isInputDisabled;
    console.log('📝 Input disabled:', this.isInputDisabled);
  }

  // Toggle specific form control (for reactive forms)
  toggleFormControl(controlName: string) {
    const control = this.form.get(controlName);
    if (control) {
      if (control.disabled) {
        control.enable();
        console.log(`✅ ${controlName} ENABLED`);
      } else {
        control.disable();
        console.log(`🚫 ${controlName} DISABLED`);
      }
      console.log(`   Status: ${control.status}`);
    }
  }

  // Disable all form controls at once
  disableAllFormControls() {
    this.form.disable();
    console.log('🚫 ALL form controls DISABLED');
    console.log('   Form status:', this.form.status);
  }

  // Enable all form controls at once
  enableAllFormControls() {
    this.form.enable();
    console.log('✅ ALL form controls ENABLED');
    console.log('   Form status:', this.form.status);
  }

  // Programmatically set specific control disabled state
  setControlDisabled(controlName: string, disabled: boolean) {
    const control = this.form.get(controlName);
    if (control) {
      if (disabled) {
        control.disable();
      } else {
        control.enable();
      }
      console.log(`${controlName} is now ${disabled ? 'DISABLED' : 'ENABLED'}`);
    }
  }

  // ====================================
  // Your existing methods
  // ====================================

  onSubmit() {
    console.log('📋 Form Value (excludes disabled):', this.form.value);
    console.log('📋 Form Raw Value (includes disabled):', this.form.getRawValue());
    console.log('📋 Form Status:', this.form.status);
    console.log('📋 Form Valid:', this.form.valid);
  }

  onValueChange(newValue: number) {
    console.log('Updated Value:', newValue, this.quantity);
  }

  submit() {
    console.log('Submitted Values:', {
      quantity: this.quantity,
      email: this.email,
      age: this.age,
      decimalValue: this.decimalValue,
      isDisabled: this.isDisabled,
      isInputDisabled: this.isInputDisabled
    });
    
    // Also log form values
    console.log('Form Values:', this.form.value);
    console.log('Form Raw Values (includes disabled):', this.form.getRawValue());
  }

  // ====================================
  // NEW: Utility methods for debugging
  // ====================================

  // Log current state of all controls
  logFormState() {
    console.log('=== FORM STATE ===');
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      console.log(`${key}:`, {
        value: control?.value,
        disabled: control?.disabled,
        status: control?.status
      });
    });
    console.log('==================');
  }

  // Check if a specific control is disabled
  isControlDisabled(controlName: string): boolean {
    return this.form.get(controlName)?.disabled || false;
  }

  // Get control status text for display
  getControlStatus(controlName: string): string {
    const control = this.form.get(controlName);
    return control?.disabled ? 'DISABLED' : 'ENABLED';
  }
}