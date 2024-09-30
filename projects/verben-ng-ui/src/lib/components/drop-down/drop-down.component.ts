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
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownLoadEvent } from './DropdownLoadEvent';
import { TemplateDirective } from '../TemplateDirective.directive';
import { DropdownChangeEvent } from './DropdownChangeEvent';
import { DropDownItemComponent } from './drop-down-item/drop-down-item.component';
import { isEqual, cloneDeep } from 'lodash';
import { debounceTime, Subject } from 'rxjs';
import { SharedModule } from '../shared.module';

export interface DropdownMenuItemWrapper extends DropdownMenuItem {
  expanded: boolean;
  items?: DropdownMenuItemWrapper[];
  isLoading: boolean;
  copy: DropdownMenuItemWrapper[];
  loadTimes?: DropdownLoadEvent;
  loadTimesCopy?: DropdownLoadEvent;
}

@Component({
  selector: 'verbena-drop-down',
  standalone: true,
  imports: [CommonModule, DropDownItemComponent, SharedModule, FormsModule],
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

  @Input() width: string = '12rem';
  @Input() optionLabel?: string;
  @Input() optionSubLabel?: string;
  @Input() optionValue?: string;
  @Input() placeholder?: string;
  @Input() loadMoreCaption: string = 'See more';
  @Input() display: string = 'default';
  @Input() showClear: boolean = false;
  @Input() lazyLoad: boolean = false;
  @Input() styleClass: string = '';
  @Input() group: boolean = false;
  @Input() multiselect: boolean = false;
  @Input() filter: boolean = false;
  @Input() avoidDuplication: boolean = false;
  @Input() filterBy?: string;
  @Input() debounceTime: number = 500;
  @Input() minChar: number = 0;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() load?: (context: DropdownLoadEvent) => Promise<any[]>;
  @Input() asyncLabel?: (context: any) => string | null;
  @Input() search?: (data: any, context: DropdownLoadEvent) => Promise<any[]>;

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
  isInputFocused = false;

  @HostListener('focus') onFocus() {
    this.isFocused = true;
  }

  @HostListener('blur') onBlur() {
    this.isFocused = false;
  }

  onSearchFocus() {
    this.isInputFocused = true;
  }

  onSearchBlur() {
    this.isInputFocused = false;
  }

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    this.isInputFocused = false;
  }

  selectedItemTemplate: TemplateRef<any> | null = null;
  itemTemplate: TemplateRef<any> | null = null; // Allow null for custom item template
  groupTemplate: TemplateRef<any> | null = null;

  //VARIABLES
  isExpanded: boolean = false;
  loadTimes: DropdownLoadEvent = new DropdownLoadEvent();
  initialIncrement: boolean = false;
  selectedOption: any;
  selectedOptions: any[] = [];
  selectedOptionLabel: any;
  selectedOptionLabels: any[] = [];
  isLoading: boolean = false;
  optionsCopy: any[] = [];
  loadTimesCopy: DropdownLoadEvent = new DropdownLoadEvent();
  selectedContexts: any[] = [];
  searchHistory: string[] = [];
  searchTerm$ = new Subject<string>();
  searchContext: string = '';
  allowSelectAll: boolean = false;
  selectedAll: boolean = false;

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
  ngOnInit(): void {
    if (this.multiselect) {
      if (!this.lazyLoad) {
        if (!this.group) {
          this.allowSelectAll = true;
        } else {
          let isAllowed = true;
          for (let item of this.options) {
            if (item.lazyLoad) {
              isAllowed = false;
              break;
            }
          }
          this.allowSelectAll = isAllowed;
        }
      }
    }
    if (this.filter) {
      this.optionsCopy = cloneDeep(this._options);
      this.searchTerm$
        .pipe(debounceTime(this.debounceTime)) // Adjust debounce time here (in ms)
        .subscribe(async (searchTerm) => {
          if (searchTerm.length < this.minChar) {
            return;
          }
          if (this.selectedContexts.length > 0) {
            const item = this.selectedContexts[
              this.selectedContexts.length - 1
            ] as DropdownMenuItemWrapper;
            if (item.search && item.loadTimes) {
              item.loadTimes.reset();
              item.isLoading = true;
              const result = await item.search(searchTerm, item.loadTimes);
              item.isLoading = false;
              if (this.searchContext.length > 0) {
                item.loadTimes.increaseLoadTime();
                item.items = this.convertToExpandable(result);
                this.group
                  ? this.optionsChange.emit(this.options as DropdownMenuItem[])
                  : this.optionsChange.emit(this.options);
              }
            }
          } else {
            if (this.search && this.loadTimes) {
              this.isLoading = true;
              this.loadTimes.reset();
              const result = await this.search(searchTerm, this.loadTimes);
              this.isLoading = false;
              if (this.searchContext.length > 0) {
                this.options = this.convertToExpandable(result);
                this.group
                  ? this.optionsChange.emit(this.options as DropdownMenuItem[])
                  : this.optionsChange.emit(this.options);
              }
            }
          }
        });
    }
  }
  ngAfterContentInit(): void {
    console.log({ Templates: this.templates });
    this.templates.forEach((templateDirective) => {
      if (templateDirective.vTemplate === 'selected') {
        this.selectedItemTemplate = templateDirective.template;
      }
      if (templateDirective.vTemplate === 'item') {
        this.itemTemplate = templateDirective.template;
      }
      if (templateDirective.vTemplate === 'group') {
        this.groupTemplate = templateDirective.template;
      }
    });
  }

  onSearch(event: any) {
    if (this.disabled) {
      return;
    }
    const searchTerm = event.target.value;
    if (this.selectedContexts.length > 0) {
      const item = this.selectedContexts[
        this.selectedContexts.length - 1
      ] as DropdownMenuItemWrapper;
      if (searchTerm.trim().length == 0) {
        item.items = cloneDeep(item.copy);
        item.loadTimes = cloneDeep(item.loadTimesCopy);
        this.group
          ? this.optionsChange.emit(this.options as DropdownMenuItem[])
          : this.optionsChange.emit(this.options);
        return;
      }
      if (item.lazyLoad) {
        this.searchTerm$.next(searchTerm);
      } else {
        if (item.filterBy) {
          if (!item.items) {
            return;
          }
          item.items = item.items.filter(
            (x) =>
              typeof x.value[item.filterBy!] == 'string' &&
              new RegExp(searchTerm, 'i').test(x.value[item.filterBy!])
          );
          this.group
            ? this.optionsChange.emit(this.options as DropdownMenuItem[])
            : this.optionsChange.emit(this.options);
        } else {
          if (!item.items) {
            return;
          }
          item.items = item.copy.filter(
            (x) =>
              typeof x.value == 'string' &&
              new RegExp(searchTerm, 'i').test(x.value)
          );
          this.group
            ? this.optionsChange.emit(this.options as DropdownMenuItem[])
            : this.optionsChange.emit(this.options);
        }
      }
    } else {
      if (searchTerm.trim().length == 0) {
        this.options = cloneDeep(this.optionsCopy);
        this.loadTimes = cloneDeep(this.loadTimesCopy);
        this.group
          ? this.optionsChange.emit(this.options as DropdownMenuItem[])
          : this.optionsChange.emit(this.options);
        return;
      }
      if (this.lazyLoad) {
        this.searchTerm$.next(searchTerm);
      } else {
        if (this.filterBy) {
          this.options = this.optionsCopy.filter(
            (x) =>
              typeof x[this.filterBy!] == 'string' &&
              new RegExp(searchTerm, 'i').test(x[this.filterBy!])
          );
          this.group
            ? this.optionsChange.emit(this.options as DropdownMenuItem[])
            : this.optionsChange.emit(this.options);
        } else {
          this.options = this.optionsCopy.filter(
            (x) => typeof x == 'string' && new RegExp(searchTerm, 'i').test(x)
          );
          this.group
            ? this.optionsChange.emit(this.options as DropdownMenuItem[])
            : this.optionsChange.emit(this.options);
        }
      }
    }
  }

  onDropdownClick(event: Event) {
    if (this.disabled) {
      return;
    }
    this.toggleDropdown();
    this.onClick.emit(event);
  }

  toggleDropdown() {
    this.isExpanded = !this.isExpanded;
  }

  hasSibling(siblings: DropdownMenuItemWrapper[]): number | null {
    for (let i = 0; i < siblings.length; i++) {
      const index = this.selectedContexts.indexOf(siblings[i]);
      if (index > -1) {
        return index;
      }
    }
    return null;
  }

  async expandMenu(
    item: DropdownMenuItemWrapper,
    siblings: DropdownMenuItemWrapper[]
  ) {
    if (item.items) {
      if (this.filter) {
        for (let it of siblings.filter((x) => x !== item)) {
          if (it.expanded) {
            it.expanded = false;
            it.loadTimes && it.loadTimes.reset();
          }
        }
      }
      item.expanded = !item.expanded;
      if (item.expanded) {
        if (this.filter) {
          const siblingCheck = this.hasSibling(siblings);
          if (this.selectedContexts.length > 0 && siblingCheck !== null) {
            const contextsLength = this.selectedContexts.length;
            this.selectedContexts.splice(
              siblingCheck,
              contextsLength - siblingCheck
            );
          }
          this.selectedContexts.push(item);
          if (siblingCheck == null) {
            this.searchHistory.push(this.searchContext);
          }
          this.searchContext = '';
        }
        if (item.lazyLoad && item.loadMore && item.loadTimes) {
          item.isLoading = true;
          var result = await item.loadMore(item.loadTimes);
          item.isLoading = false;
          item.loadTimes.increaseLoadTime();
          item.items = this.convertToExpandable(result);
          if (this.filter) {
            item.copy = cloneDeep(item.items);
            item.loadTimesCopy = cloneDeep(item.loadTimes);
          }
          this.group
            ? this.optionsChange.emit(this.options as DropdownMenuItem[])
            : this.optionsChange.emit(this.options);
        }
      } else {
        if (this.filter) {
          const index = this.selectedContexts.indexOf(item);
          const contextsLength = this.selectedContexts.length;
          if (index > -1) {
            this.selectedContexts.splice(index, contextsLength - index);
          }
        }
        if (item.loadTimes) {
          item.loadTimes.reset();
          if (this.filter) {
            item.loadTimesCopy = cloneDeep(item.loadTimes);
          }
        }
        if (this.filter) {
          if (this.searchHistory.length > 0) {
            this.searchContext =
              this.searchHistory[this.searchHistory.length - 1];
            this.searchHistory.splice(this.searchHistory.length - 1, 1);
          }
        }
      }
    }
  }

  async loadMoreMenuItems(item: DropdownMenuItemWrapper) {
    if (item.loadMore && item.loadTimes && item.items) {
      const searchContext = this.searchContext.trim();
      item.isLoading = true;
      var result =
        searchContext.length > 0 && item.search
          ? await item.search(searchContext, item.loadTimes)
          : await item.loadMore(item.loadTimes);
      item.isLoading = false;
      item.loadTimes.increaseLoadTime();
      const converted = this.convertToExpandable(result);
      for (let res of converted) {
        item.items.push(res);
      }
      if (this.filter) {
        if (searchContext.length == 0 || !item.search) {
          item.copy = cloneDeep(item.items);
          item.loadTimesCopy = cloneDeep(item.loadTimes);
        }
      }
      this.group
        ? this.optionsChange.emit(this.options as DropdownMenuItem[])
        : this.optionsChange.emit(this.options);
    }
  }

  async loadMore() {
    if (this.load) {
      if (this.options.length > 0 && !this.initialIncrement) {
        this.loadTimes.increaseLoadTime();
        if (this.filter) {
          this.loadTimesCopy = cloneDeep(this.loadTimes);
        }
        this.initialIncrement = true;
      }
      const searchContext = this.searchContext.trim();
      this.isLoading = true;
      var result =
        searchContext.length > 0 && this.search
          ? await this.search(searchContext, this.loadTimes)
          : await this.load(this.loadTimes);
      this.isLoading = false;
      if (this.group) {
        result = this.convertToExpandable(result);
      }
      this.loadTimes.increaseLoadTime();
      for (let item of result) {
        this.options.push(item);
      }
      if (this.filter) {
        if (searchContext.length == 0 || !this.search) {
          this.optionsCopy = cloneDeep(this.options);
          this.loadTimesCopy = cloneDeep(this.loadTimes);
        }
      }
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
        loadTimes: item.items ? new DropdownLoadEvent() : undefined,
        loadTimesCopy: item.items ? new DropdownLoadEvent() : undefined,
        items: item.items ? this.convertToExpandable(item.items) : undefined,
        copy: item.items ? cloneDeep(this.convertToExpandable(item.items)) : [],
      };
      wrapper.push(convertedItem);
    }
    return wrapper;
  }

  onSelectAll(event: Event) {
    if (this.selectedAll) {
      this.selectedOptions = [];
      this.selectedOptionLabels = [];
      this.onItemChange([]);
      this.onTouched();
      this.onChange.emit({ originalEvent: event, value: [] });
      if (this.required) {
        this.isInvalid = true;
      }
      return;
    }
    if (!this.group) {
      this.selectedOptions = [];
      this.selectedOptionLabels = [];
      for (let option of this.options) {
        const index = this.checkMultiselectValue(option);
        if (index == null) {
          this.selectedOptions.push(this.getValue(option));
          this.selectedOptionLabels.push(this.getOptionLabel(option));
        }
      }
    } else {
      this.selectedOptions = [];
      this.selectedOptionLabels = [];
      for (let option of this.options) {
        for (let item of option.items) {
          const index = this.checkMultiselectValue(item);
          if (index == null) {
            this.selectedOptions.push(this.getValue(item));
            this.selectedOptionLabels.push(this.getOptionLabel(option));
          }
        }
      }
    }
    this.onItemChange(this.selectedOptions);
    this.onTouched();
    this.onChange.emit({ originalEvent: event, value: this.selectedOptions });
  }

  clearSelection(event: Event) {
    if (!this.multiselect) {
      this.selectedOption = null;
      this.selectedOptionLabel = null;
      this.onItemChange(null);
      this.onTouched();
      this.onChange.emit({ originalEvent: event, value: null });
    } else {
      this.selectedOptions = [];
      this.selectedOptionLabels = [];
      this.onItemChange([]);
      this.onTouched();
      this.onChange.emit({ originalEvent: event, value: [] });
    }
    if (this.required) {
      this.isInvalid = true;
    }
    this.selectedAll = false;
    this.onClear.emit(event);
  }

  onSelect(value: any, event: Event) {
    if (!this.multiselect) {
      this.selectedOption = this.getValue(value);
      this.selectedOptionLabel = this.getOptionLabel(value);
      this.onItemChange(this.getValue(value));
      this.onTouched();
      this.onChange.emit({ originalEvent: event, value: this.getValue(value) });
      this.toggleDropdown();
    } else {
      const exists = this.checkMultiselectValue(value);
      if (exists == null) {
        const newSelectedOptions = [
          ...this.selectedOptions,
          this.getValue(value),
        ];
        const newSelectedOptionLabels = [
          ...this.selectedOptionLabels,
          this.getOptionLabel(value),
        ];
        this.selectedOptions = newSelectedOptions;
        this.selectedOptionLabels = newSelectedOptionLabels;
        this.onItemChange(this.selectedOptions);
        this.onTouched();
        this.onChange.emit({
          originalEvent: event,
          value: this.selectedOptions,
        });
      } else {
        this.selectedAll = false;
        const newSelectedOptions = [...this.selectedOptions];
        newSelectedOptions.splice(exists, 1);
        const newSelectedOptionLabels = [...this.selectedOptionLabels];
        newSelectedOptionLabels.splice(exists, 1);
        this.selectedOptions = newSelectedOptions;
        this.selectedOptionLabels = newSelectedOptionLabels;
        this.onItemChange(this.selectedOptions);
        this.onTouched();
        this.onChange.emit({
          originalEvent: event,
          value: this.selectedOptions,
        });
      }
    }
  }

  onMultiselectItemClosed(index: number, event: Event) {
    const newSelectedOptions = [...this.selectedOptions];
    newSelectedOptions.splice(index, 1);
    const newSelectedOptionLabels = [...this.selectedOptionLabels];
    newSelectedOptionLabels.splice(index, 1);
    this.selectedOptions = newSelectedOptions;
    this.selectedOptionLabels = newSelectedOptionLabels;
    this.onItemChange(this.selectedOptions);
    this.onTouched();
    this.onChange.emit({ originalEvent: event, value: this.selectedOptions });
  }

  checkMultiselectValue(value: any): number | null {
    for (let i = 0; i < this.selectedOptions.length; i++) {
      if (isEqual(this.selectedOptions[i], this.getValue(value))) {
        return i;
      }
    }
    return null;
  }

  writeValue(obj: any): void {
    if (!this.multiselect) {
      if (obj == null || obj == undefined) {
        this.selectedOption = obj;
        this.selectedOptionLabel = obj;
        return;
      }
      if (!this.group && !this.lazyLoad) {
        for (let option of this.options) {
          if (isEqual(this.getValue(option), obj)) {
            this.selectedOption = this.getValue(option);
            this.selectedOptionLabel = this.getOptionLabel(option);
            break;
          }
        }
        this.onTouched();
        this.onChange.emit({ value: this.selectedOption });
        return;
      }
      this.selectedOption = obj;
      this.selectedOptionLabel = this.asyncLabel ? this.asyncLabel(obj) : obj;
      this.onTouched();
      this.onChange.emit({ value: this.selectedOption });
    } else {
      if (!Array.isArray(obj)) {
        this.selectedOptions = [];
        this.selectedOptionLabels = [];
        return;
      }
      this.selectedOptions = [];
      this.selectedOptionLabels = [];
      if (!this.group && !this.lazyLoad) {
        for (let option of this.options) {
          for (let object of obj) {
            if (isEqual(this.getValue(option), object)) {
              this.selectedOptions.push(this.getValue(option));
              this.selectedOptionLabels.push(this.getOptionLabel(option));
              break;
            }
          }
        }
        this.onTouched();
        this.onChange.emit({ value: this.selectedOptions });
        return;
      }
      this.selectedOptions = obj;
      for (let object of obj) {
        this.selectedOptionLabels.push(
          this.asyncLabel ? this.asyncLabel(object) : object
        );
      }
      this.onTouched();
      this.onChange.emit({ value: this.selectedOptions });
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
      : this.options.findIndex(
          (x) => x[this.optionValue!] && x[this.optionValue!] == value
        );
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
    return this.group ? item.value[this.optionValue] : item[this.optionValue];
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
