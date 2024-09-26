import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgComponent } from '../svg/svg.component';

@Component({
  selector: 'verben-table-filter',
  standalone: true,
  imports: [CommonModule,FormsModule,SvgComponent],
  templateUrl: './table-filter.component.html',
  styleUrl: './table-filter.component.css'
})

export class TableFilterComponent {
  savedFiltersArray = [
    { name: 'Date after 22/05/2022', checked: false },
    { name: 'Credit greater than ₦1,000,000,000', checked: false },
    { name: 'Now it worked', checked: false }
  ];
  
  operationsArray: { filterBy: string; condition: string; value: string }[] = [
    { filterBy: '', condition: 'equal', value: '₦1,000,000' }
  ];

  savedFilters = [...this.savedFiltersArray]
  operations = [...this.operationsArray]

  visibleFilters = 2; 

  toggleShowMore() {
    this.visibleFilters = this.visibleFilters === 2 ? this.savedFilters.length : 2;
  }

  deleteFilter(index: number) {
    this.savedFilters.splice(index, 1);
  }

  toggleCheckbox(index: number) {
    this.savedFilters[index].checked = !this.savedFilters[index].checked;
  }

  addOperation() {
    this.operations.push({ filterBy: '', condition: 'equal', value: '' });
  }

  resetFilters() {
    this.savedFilters = [...this.savedFiltersArray];
    this.operations = [...this.operationsArray];
  }
}
