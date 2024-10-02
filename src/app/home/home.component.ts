import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  username: string = '';  // Variable to store the username input

  onUsernameChange(value: string) {
    this.username = value;  // Update the username variable with the input value
    console.log('Username changed:', this.username);  // Log the username value for debugging
  }

}
