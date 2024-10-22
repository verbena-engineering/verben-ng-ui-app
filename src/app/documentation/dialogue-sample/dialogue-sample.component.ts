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

  onModalClose() {
    this.isModalVisible = false;
  }

  onConfirm() {
      this.onModalClose();
  }
}
