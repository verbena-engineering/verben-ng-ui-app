import { Component, ChangeDetectionStrategy } from '@angular/core';



@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl:'./date-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SampleDatePickerComponent {
 selectedDate:Date=new Date()
 endDate:Date=new Date()
  minDate: Date = new Date(2025, 8, 1);  
  maxDate: Date = new Date(Date.now()); 
 onDateChange(date:Date){
  console.log('cool');
  
  
 }
}
