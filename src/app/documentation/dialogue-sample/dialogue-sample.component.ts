import { Component } from '@angular/core';
import { DataFilterType, IDataFilter } from 'verben-ng-ui/src/public-api';

@Component({
  selector: 'app-dialogue-sample',
  templateUrl: './dialogue-sample.component.html',
  styleUrl: './dialogue-sample.component.scss'
})
export class DialogueSampleComponent {
  isModalVisible: boolean = false;

  openModal() {
    this.isModalVisible = true;
  }

  filterArray: IDataFilter[] = [
    {
      name: 'Name',
      type: DataFilterType.String,
      checked: false,
    },
    {
      name: 'Age',
      type: DataFilterType.Integer,
      checked: false,
    },
    {
      name: 'Salary',
      type: DataFilterType.Decimal,
      checked: false,
    },
    {
      name: 'Date',
      type: DataFilterType.Date,
      checked: false,
    },
    {
      name: 'Qualify for payment',
      type: DataFilterType.Bool,
      checked: false,
    },
  ];

  onConfirm() {
    this.isModalVisible = false;
  }
  onModalOpen(eventData: any) {
    console.log('Modal opened, received data:', eventData);
  }

  onModalClose(eventData: any) {
    console.log('Modal closed, received data:', eventData);
    this.isModalVisible = false;
  }
}
