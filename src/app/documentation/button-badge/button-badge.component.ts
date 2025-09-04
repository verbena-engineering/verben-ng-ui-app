import { TabItemComponent } from 'verben-ng-ui';
import { ButtonBadgeModule } from './button-badge.module';
import { VerbenaTabComponent } from 'verben-ng-ui';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'button-badge-component',
  templateUrl: './button-badge.component.html',
  styleUrl: './button-badge.scss',
})
export class ButtonBadgeComponent {
  @ViewChild(VerbenaTabComponent) verbenaTabComponent!: VerbenaTabComponent;
  email: string = '';
  age: string = '';
  decimalValue: string = '';

  onTabChange(tab: TabItemComponent) {
    console.log('Active tab changed:', tab.title, 'with ID:', tab.id);
  }

  submit() {
    console.log('Submitted Values:', {
      email: this.email,
      age: this.age,
      decimalValue: this.decimalValue,
    });
  }
}
