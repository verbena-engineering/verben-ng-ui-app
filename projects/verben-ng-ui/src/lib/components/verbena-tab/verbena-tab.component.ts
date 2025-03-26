import { Component, ContentChildren, QueryList, AfterContentInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { TabItemComponent } from './tab-item.component';

@Component({
  selector: 'verbena-tab',
  templateUrl: './verbena-tab.component.html',
  styleUrls: ['./verbena-tab.component.css']
})
export class VerbenaTabComponent implements AfterContentInit {
  @ContentChildren(TabItemComponent) tabs!: QueryList<TabItemComponent>;
  @Output() tabChange = new EventEmitter<TabItemComponent>();

  @Input() backgroundColor: string = ''; // Global background color
  @Input() activeTabBgColor: string = ''; // Global active tab background
  @Input() textColor: string = ''; // Global text color
  @Input() hoverColor: string = ''; // Global hover color

  activeTab: TabItemComponent | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit() {
    if (this.tabs.length && !this.tabs.find(tab => tab.active)) {
      this.selectTab(this.tabs.first);
    } else {
      const activeTab = this.tabs.find(tab => tab.active);
      if (activeTab) {
        this.selectTab(activeTab);
      }
    }

    this.tabs.changes.subscribe(() => {
      if (!this.activeTab || !this.tabs.find(tab => tab === this.activeTab)) {
        if (this.tabs.length) {
          this.selectTab(this.tabs.first);
        } else {
          this.activeTab = null;
        }
      }
      this.cdr.markForCheck();
    });
  }

  selectTab(tab: TabItemComponent) {
    if (tab.disabled) return;

    if (this.activeTab) {
      this.activeTab.active = false;
    }

    this.activeTab = tab;
    tab.active = true;
    this.tabChange.emit(tab);
  }
}
