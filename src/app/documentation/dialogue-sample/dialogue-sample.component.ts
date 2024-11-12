import { Component } from '@angular/core';

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
