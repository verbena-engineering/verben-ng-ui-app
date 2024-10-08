import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  Self,
  TemplateRef,
} from '@angular/core';
import { DropDownItemComponent } from '../drop-down/drop-down-item/drop-down-item.component';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChipChangeEvent } from './ChipChangeEvent';
import { SharedModule } from '../shared.module';
import { TemplateDirective } from '../TemplateDirective.directive';

@Component({
  selector: 'verben-chip',
  standalone: true,
  imports: [CommonModule, DropDownItemComponent, SharedModule, FormsModule],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.css',
})
export class ChipComponent
  implements ControlValueAccessor, OnInit, AfterContentInit
{
  // INPUTS
  @Input() width: string = '100%';
  @Input() placeholder: string = '';
  @Input() max?: number;
  @Input() styleClass: string = '';
  @Input() separator: string = ',';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() invalidMessage?: string;
  @Input() errorPosition: string = '';

  // OUTPUTS
  @Output() onChange: EventEmitter<ChipChangeEvent> = new EventEmitter();
  // @Output() onClear: EventEmitter<Event> = new EventEmitter();

  onItemChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};
  isInvalid: boolean = false;

  //TEMPLATING
  @ContentChildren(TemplateDirective) templates!: QueryList<TemplateDirective>;
  @HostBinding('class.focused') isFocused = false;
  isInputFocused = false;

  @HostListener('focus') onFocus() {
    this.isFocused = true;
  }

  @HostListener('blur') onBlur() {
    this.isFocused = false;
  }

  onInputFocus() {
    this.isFocused = true;
  }

  onInputBlur() {
    this.isFocused = false;
  }

  itemTemplate: TemplateRef<any> | null = null;

  chips: string[] = [];
  chipInput: string = '';

  constructor(@Self() private ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this; // Assign this component as the value accessor
      this.ngControl?.statusChanges?.subscribe((status) => {
        this.isInvalid = this.ngControl.touched
          ? status === 'INVALID' && this.ngControl.touched
          : false;
      });
    }
  }

  ngOnInit(): void {}
  ngAfterContentInit(): void {
    console.log({ Templates: this.templates });
    this.templates.forEach((templateDirective) => {
      if (templateDirective.vTemplate === 'item') {
        this.itemTemplate = templateDirective.template;
      }
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    const inputValue = (event.target as HTMLInputElement).value;
    console.log({ Key: event.key, InputVal: inputValue });
    // Check for 'Enter' key or custom separator
    if (event.key === 'Enter' || event.key == this.separator) {
      event.preventDefault();
      this.addChips(inputValue);
    }

    // Handle 'Backspace' key when input is empty
    if (
      event.key === 'Backspace' &&
      inputValue.length === 0 &&
      this.chips.length > 0
    ) {
      this.removeLastChip();
    }
  }

  addChips(inputValue: string): void {
    if (this.disabled) {
      return;
    }
    // Split by separator and trim each part
    const values = inputValue
      .split(this.separator)
      .map((value) => value.trim());

    values.forEach((value) => {
      if (value.length > 0) {
        if (this.max && this.chips.length == this.max) {
          return;
        }
        this.chips.push(value); // Add chip
      }
    });
    if (this.isInvalid) {
      this.isInvalid = false;
    }

    this.chipInput = ''; // Clear input
    this.onTouched();
    this.onChange.emit({ value: this.chips });
  }

  removeChip(index: number, event: Event): void {
    if (this.disabled) {
      return;
    }
    this.chips.splice(index, 1);
    if (this.chips.length == 0) {
      if (this.required == true) {
        this.isInvalid = true;
      }
    }
    this.onTouched();
    this.onChange.emit({ originalEvent: event, value: this.chips });
  }

  removeLastChip(): void {
    if (this.disabled) {
      return;
    }
    this.chips.pop(); // Remove the last chip
    if (this.chips.length == 0) {
      if (this.required == true) {
        this.isInvalid = true;
      }
    }
    this.onTouched();
    this.onChange.emit({ originalEvent: event, value: this.chips });
  }

  // clearSelection(event: Event) {
  //   if (this.disabled) {
  //     return;
  //   }
  //   this.chips = [];
  //   if (this.required == true) {
  //     this.isInvalid = true;
  //   }
  //   this.onTouched();
  //   this.onChange.emit({ originalEvent: event, value: this.chips });
  // }

  writeValue(obj: string[]): void {
    this.chips = obj;
    this.onTouched();
    this.onChange.emit({ value: this.chips });
  }
  registerOnChange(fn: any): void {
    this.onItemChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get placeholderState(): string | undefined {
    return this.chips && this.chips.length == 0 ? this.placeholder : '';
  }
}
