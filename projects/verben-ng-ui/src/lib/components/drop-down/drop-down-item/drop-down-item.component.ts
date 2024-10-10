import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { TemplateDirective } from '../../TemplateDirective.directive';
import { DropdownMenuItemWrapper } from '../drop-down.component';
import { CommonModule } from '@angular/common';
import { isEqual } from 'lodash';
import { FormsModule } from '@angular/forms';
import { SvgModule } from '../../svg/svg.module';

@Component({
  selector: 'drop-down-item',
  standalone: true,
  imports: [CommonModule, FormsModule, SvgModule],
  templateUrl: './drop-down-item.component.html',
  styleUrl: './drop-down-item.component.css',
})
export class DropDownItemComponent implements OnInit {
  @Input() itemTemplate: TemplateRef<any> | null = null; // Allow null for custom item template
  @Input() groupTemplate: TemplateRef<any> | null = null;

  @Input() activeItem?: any;
  @Input() activeItems?: any;
  @Input() optionValue?: string;
  @Input() optionLabel?: string;
  @Input() optionSubLabel?: string;
  @Input() loadMoreCaption?: string;
  @Input() multiselect: boolean = false;
  @Input() options: any[] = [];
  @Input() group: boolean = false;
  @Input() onExpand?: (
    item: DropdownMenuItemWrapper,
    siblings: DropdownMenuItemWrapper[]
  ) => Promise<void>;
  @Input() onLoadMore?: (item: DropdownMenuItemWrapper) => Promise<void>;
  @Input() onSelect?: (value: any, event: Event) => void;

  constructor() {}
  ngOnInit(): void {}

  isEqual(value: any, other: any): boolean {
    return isEqual(value, other);
  }

  isSelected(value: any[], other: any): boolean {
    for (let val of value) {
      if (isEqual(val, other)) {
        return true;
      }
    }
    return false;
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

  getOptionSubLabel(item: any): any {
    if (this.group) {
      return item.subLabel;
    }
    if (!this.optionSubLabel) {
      return item;
    }
    return typeof item === 'string' ? item : item[this.optionSubLabel];
  }
}
