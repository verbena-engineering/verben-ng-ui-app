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
  
  // Color customization
  @Input() backgroundColor: string = '#f8f8f8';
  @Input() activeTabColor: string = '#0078d4';      // Border/indicator color
  @Input() activeTabBgColor: string = '#ffffff';    // Background color for active tab
  @Input() hoverColor: string = '#eaeaea';
  @Input() textColor: string = '#333';
  @Input() activeTextColor: string = '#0078d4';
  
  // Active tab control
  @Input() set activeTabIndex(index: number) {
    if (this.tabs && this.tabs.length > index && index >= 0) {
      this.selectTab(this.tabs.toArray()[index]);
    }
  }
  
  @Input() set activeTabId(id: string) {
    if (this.tabs) {
      const tab = this.tabs.find(t => t.id === id);
      if (tab) {
        this.selectTab(tab);
      }
    }
  }
  
  activeTab: TabItemComponent | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit() {
    // Default to first tab as active if available and no active tab is specified
    if (this.tabs.length && !this.tabs.find(tab => tab.active)) {
      this.selectTab(this.tabs.first);
    } else {
      // If a tab is already marked as active (via [active]="true"), select it
      const activeTab = this.tabs.find(tab => tab.active);
      if (activeTab) {
        this.selectTab(activeTab);
      }
    }
    
    // Update when tabs change (added/removed)
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

  getActiveTabIndex(): number {
    return this.tabs ? this.tabs.toArray().findIndex(tab => tab === this.activeTab) : -1;
  }
  
  // Method to programmatically select a tab by index
  selectTabByIndex(index: number): void {
    if (this.tabs && this.tabs.length > index && index >= 0) {
      this.selectTab(this.tabs.toArray()[index]);
    }
  }
  
  // Method to programmatically select a tab by id
  selectTabById(id: string): void {
    if (this.tabs) {
      const tab = this.tabs.find(t => t.id === id);
      if (tab) {
        this.selectTab(tab);
      }
    }
  }
}