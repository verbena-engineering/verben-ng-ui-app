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
import { TemplateDirective } from '../TemplateDirective.directive';
import { DropdownMenuItemWrapper } from '../drop-down.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'drop-down-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drop-down-item.component.html',
  styleUrl: './drop-down-item.component.css',
})
export class DropDownItemComponent implements OnInit {
  @Input() itemTemplate: TemplateRef<any> | null = null; // Allow null for custom item template
  @Input() groupTemplate: TemplateRef<any> | null = null;

  @Input() activeItem?: any;
  @Input() optionLabel?: string;
  @Input() optionSubLabel?: string;
  @Input() loadMoreCaption?: string;
  @Input() options: any[] = [];
  @Input() group: boolean = false;
  @Input() onExpand?: (item: DropdownMenuItemWrapper) => Promise<void>;
  @Input() onLoadMore?: (item: DropdownMenuItemWrapper) => Promise<void>;
  @Input() onSelect?: (value: any, event: Event) => void;

  constructor() {}
  ngOnInit(): void {}

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      console.log('Options changed', this.options);
    }
  }
}
