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
  @Input() tabColor: string = ''; // Individual tab color override
  @Input() activeTabBgColor: string = ''; // Individual active tab background color
  @Input() textColor: string = ''; // Individual tab text color override
  @Input() badgeCount: number | null = null; // Optional badge number
  @Input() badgeColor: string = '#ff4081'; // Badge background color
  
  @ViewChild('content', { static: true }) content!: TemplateRef<any>;
  
  private _active: boolean = false;
}