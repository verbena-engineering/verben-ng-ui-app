import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-tabs-page',
  templateUrl: './tabs-page.component.html',
})
export class TabsPageComponent {
  activeTitle = 'Account';

  onTabChange(tab: { title: string }): void {
    this.activeTitle = tab.title;
  }

  code = {
    basic: `<verben-tab
  textColor="var(--vbn-color-text)"
  (tabChange)="onTabChange($event)"
>
  <lib-tab-item title="Account" [active]="true">
    Update your name, email and profile photo.
  </lib-tab-item>
  <lib-tab-item title="Password">
    Change your password and two-factor settings.
  </lib-tab-item>
  <lib-tab-item title="Billing">
    Invoices and payment methods.
  </lib-tab-item>
</verben-tab>`,

    basicTs: `onTabChange(tab: TabItemComponent) {
  console.log(tab.title);
}`,

    badges: `<verben-tab textColor="var(--vbn-color-text)">
  <lib-tab-item title="Inbox" [badgeCount]="12" [active]="true">12 unread messages</lib-tab-item>
  <lib-tab-item title="Archived">Nothing archived yet</lib-tab-item>
  <lib-tab-item title="Spam" [disabled]="true">Disabled tab</lib-tab-item>
</verben-tab>`,
  };

  tabsInputs: DocsProp[] = [
    { name: 'textColor', type: 'string', default: "''", description: 'Text color for all tabs. Recommended: by default the active tab uses the primary color for its text, which can be hard to read on light themes.' },
    { name: 'activeTabBgColor', type: 'string', default: "''", description: 'Background of the active tab and panel. Avoid the primary color unless textColor is also set.' },
    { name: 'backgroundColor / hoverColor', type: 'string', default: "''", description: 'Colors for all tabs.' },
  ];

  itemInputs: DocsProp[] = [
    { name: 'title', type: 'string', default: "''", description: 'Tab label.' },
    { name: 'active', type: 'boolean', default: 'false', description: 'Which tab starts selected.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Tab cannot be selected.' },
    { name: 'badgeCount / badgeColor', type: 'number | null / string', default: 'null / error', description: 'Count bubble next to the title.' },
    { name: 'tabColor / activeTabBgColor / textColor / hoverColor', type: 'string', default: "''", description: 'Per-tab colors.' },
  ];

  outputs: DocsProp[] = [
    { name: 'tabChange', type: 'EventEmitter<TabItemComponent>', description: 'On <verben-tab>: the newly selected tab.' },
    { name: 'activeChange', type: 'EventEmitter<boolean>', description: 'On <lib-tab-item>: this tab became active/inactive.' },
  ];
}
