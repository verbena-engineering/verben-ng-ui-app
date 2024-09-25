import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  Self,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownLoadEvent } from './DropdownLoadEvent';
import { TemplateDirective } from './TemplateDirective.directive';
import { DropdownChangeEvent } from './DropdownChangeEvent';
import { DropDownItemComponent } from './drop-down-item/drop-down-item.component';

export interface DropdownMenuItemWrapper extends DropdownMenuItem {
  expanded: boolean;
  items?: DropdownMenuItemWrapper[];
  isLoading: boolean;
}

@Component({
  selector: 'verbena-drop-down',
  standalone: true,
  imports: [CommonModule, DropDownItemComponent],
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.css',
})
export class DropDownComponent
  implements ControlValueAccessor, OnInit, AfterContentInit
{
  // INTERNAL
  private _options: any[] = []; // Internal variable for options

  // INPUTS
  @Input()
  set options(value: any[]) {
    if (this.group) {
      if (this.isDropdownMenuItemWrapperArray(value)) {
        this._options = value;
      } else {
        this._options = this.convertToExpandable(value); // Set the internal options variable
      }
    } else {
      this._options = value;
    }
  }

  get options(): any[] {
    return this._options; // Return the internal options variable
  }

  @Input() optionLabel?: string;
  @Input() optionSubLabel?: string;
  @Input() optionValue?: string;
  @Input() placeholder?: string;
  @Input() loadMoreCaption: string = 'See more';
  @Input() showClear: boolean = false;
  @Input() lazyLoad: boolean = false;
  @Input() styleClass?: string;
  @Input() group: boolean = false;
  @Input() filter: boolean = false;
  @Input() filterBy?: string;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() load?: (context: DropdownLoadEvent) => Promise<any[]>;
  @Input() search?: (data: any) => DropdownMenuItem[];

  // OUTPUTS
  @Output() optionsChange: EventEmitter<any[]> = new EventEmitter();
  @Output() onChange: EventEmitter<DropdownChangeEvent> = new EventEmitter();
  @Output() onClick: EventEmitter<Event> = new EventEmitter();
  @Output() onClear: EventEmitter<Event> = new EventEmitter();

  onItemChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};
  isInvalid: boolean = false;

  //TEMPLATING
  @ViewChild('dropdownContainer', { static: true })
  dropdownContainer!: ElementRef;
  @ContentChildren(TemplateDirective) templates!: QueryList<TemplateDirective>;

  @HostBinding('class.focused') isFocused = false;

  @HostListener('focus') onFocus() {
    this.isFocused = true;
  }

  @HostListener('blur') onBlur() {
    this.isFocused = false;
  }

  itemTemplate: TemplateRef<any> | null = null; // Allow null for custom item template
  groupTemplate: TemplateRef<any> | null = null;

  //VARIABLES
  isExpanded: boolean = false;
  loadTimes: DropdownLoadEvent = new DropdownLoadEvent();
  initialIncrement: boolean = false;
  selectedOption: any;
  isLoading: boolean = false;

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
    this.templates.forEach((templateDirective) => {
      if (templateDirective.vTemplate === 'item') {
        this.itemTemplate = templateDirective.template;
      }
      if (templateDirective.vTemplate === 'group') {
        this.groupTemplate = templateDirective.template;
      }
    });
  }

  onDropdownClick(event: Event) {
    this.toggleDropdown();
    this.onClick.emit(event);
  }

  toggleDropdown() {
    this.isExpanded = !this.isExpanded;
  }

  async expandMenu(item: DropdownMenuItemWrapper) {
    if (item.loadMore && item.loadTimes && item.items) {
      item.expanded = !item.expanded;
      if (item.expanded) {
        item.isLoading = true;
        var result = await item.loadMore(item.loadTimes);
        item.isLoading = false;
        item.loadTimes.increaseLoadTime();
        item.items = this.convertToExpandable(result);
      } else {
        item.loadTimes.reset();
      }
    }
  }

  async loadMoreMenuItems(item: DropdownMenuItemWrapper) {
    if (item.loadMore && item.loadTimes && item.items) {
      item.isLoading = true;
      var result = await item.loadMore(item.loadTimes);
      item.isLoading = false;
      item.loadTimes.increaseLoadTime();
      const converted = this.convertToExpandable(result);
      for (let res of converted) {
        item.items.push(res);
      }
    }
  }

  async loadMore() {
    if (this.load) {
      if (this.options.length > 0 && !this.initialIncrement) {
        this.loadTimes.increaseLoadTime();
        this.initialIncrement = true;
      }
      this.isLoading = true;
      var result = await this.load(this.loadTimes);
      this.isLoading = false;
      console.log({ LoadResults: result });
      if (this.group) {
        result = this.convertToExpandable(result);
      }
      this.loadTimes.increaseLoadTime();
      for (let item of result) {
        this.options.push(item);
      }
      console.log({ OptionsAfterResults: this.options });
      this.group
        ? this.optionsChange.emit(this.options as DropdownMenuItem[])
        : this.optionsChange.emit(this.options);
    }
  }

  convertToExpandable(items: DropdownMenuItem[]): DropdownMenuItemWrapper[] {
    const wrapper: DropdownMenuItemWrapper[] = [];
    for (let item of items) {
      const convertedItem: DropdownMenuItemWrapper = {
        ...item,
        isLoading: false,
        expanded: false,
        items: item.items ? this.convertToExpandable(item.items) : undefined,
      };
      wrapper.push(convertedItem);
    }
    return wrapper;
  }

  onGroupSelect() {}

  onSelect(value: any, event: Event) {
    this.selectedOption = value;
    console.log({ This: this });
    this.onItemChange(this.getValue(value));
    this.onTouched();
    this.onChange.emit({ originalEvent: event, value: value });
    this.toggleDropdown();
  }

  writeValue(obj: any): void {
    if (obj) {
      this.selectedOption = this.getOptionFromValue(obj);
    }
  }

  getOptionFromValue(value: any): any {
    if (!this.optionValue) {
      return this.group ? value.value : value;
    }
    const index = this.group
      ? this.options.findIndex(
          (x) =>
            x.value[this.optionValue!] && x.value[this.optionValue!] == value
        )
      : this.options.findIndex((x) => x[value] && x[value] == value);
    if (index < 0) {
      return this.group ? value.value : value;
    }
    return this.options[index];
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

  getValue(item: any): any {
    if (!this.optionValue) {
      return this.group ? item.value : item;
    }
    return this.group
      ? item.value &&
        typeof item.value === 'object' &&
        !Array.isArray(item.value)
        ? item.value[this.optionValue]
        : item.value
      : item[this.optionValue];
  }
  getOptionLabel(item: any): any {
    if (this.group) {
      return item.label;
    }
    if (!this.optionLabel) {
      return item;
    }
    return typeof item === 'string' ? item : item[this.optionLabel];
  }

  private isDropdownMenuItemWrapperArray(value: any[]): boolean {
    return (
      Array.isArray(value) &&
      value.every((item) => this.isDropdownMenuItemWrapper(item))
    );
  }

  // Type guard function to check if an object is of type DropdownMenuItem
  private isDropdownMenuItemWrapper(item: any): boolean {
    return 'expanded' in item;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.isExpanded) {
      return;
    }
    if (
      !this.dropdownContainer.nativeElement.contains(event.target) &&
      this.isExpanded
    ) {
      this.isExpanded = false;
    }
  }
}
