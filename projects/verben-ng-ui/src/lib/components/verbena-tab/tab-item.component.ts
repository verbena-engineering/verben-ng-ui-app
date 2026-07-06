import { Component, Input, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-tab-item',
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class TabItemComponent {
  @Input() title: string = '';
  @Input() id: string = '';
  @Input() 
  set active(value: boolean) {
    if (this._active !== value) {
      this._active = value;
      this.activeChange.emit(value);
    }
  }
  get active(): boolean {
    return this._active;
  }

  @Output() activeChange = new EventEmitter<boolean>();

  @Input() disabled: boolean = false;
  @Input() tabColor: string = ''; // Tab background color
  @Input() activeTabBgColor: string = ''; // Active tab background color
  @Input() textColor: string = ''; // Tab text color
  @Input() hoverColor: string = ''; // Hover color
  @Input() badgeCount: number | null = null;
  @Input() badgeColor: string = 'var(--vbn-color-error)'; // Badge background color

  @ViewChild('content', { static: true }) content!: TemplateRef<any>;

  private _active: boolean = false;
}
