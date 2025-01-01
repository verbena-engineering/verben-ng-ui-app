import { Component } from '@angular/core';

@Component({
  selector: 'app-sample-for-dropdowns',
  templateUrl: './sample-for-dropdowns.component.html',
  styleUrl: './sample-for-dropdowns.component.scss'
})
export class SampleForDropdownsComponent {
 isOpen:boolean = false;
 isOpen2:boolean = false;

 onClose(){ 
  this.isOpen = false
 }
 onClose2(){ 
  this.isOpen2 = false
 }
}
