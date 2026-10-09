import { Component } from '@angular/core';

@Component({
  selector: 'app-sample-for-dropdowns',
  templateUrl: './sample-for-dropdowns.component.html',
  styleUrl: './sample-for-dropdowns.component.scss'
})
export class SampleForDropdownsComponent {
 isOpen:boolean = false;
 isOpen2:boolean = false;

 /** The pop-up's panel: a surface with a border and a shadow */
 popupStyles = {
  'background-color': 'var(--vbn-color-surface)',
  color: 'var(--vbn-color-text)',
  border: '1px solid var(--vbn-color-border)',
  'border-radius': '10px',
  'box-shadow': 'var(--vbn-shadow-md)',
  padding: '12px 14px',
 };

 onClose(){ 
  this.isOpen = false
 }
 onClose2(){ 
  this.isOpen2 = false
 }
}