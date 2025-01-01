import { Component } from '@angular/core';

@Component({
  selector: 'app-sample-for-dropdowns',
  templateUrl: './sample-for-dropdowns.component.html',
  styleUrl: './sample-for-dropdowns.component.scss'
})
export class SampleForDropdownsComponent {
 isOpen:boolean = false;

 onClose(){ 
  console.log('uessss',this.isOpen)
  this.isOpen = false
 }
}
