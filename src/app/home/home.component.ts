import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  username: string = '';

  onUsernameChange(value: string) {
    this.username = value;
    console.log('Username changed:', this.username);  
  }

}
