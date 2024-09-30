import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvgComponent } from '../svg/svg.component';

interface Item {
  [key: string]: any;
}

@Component({
  selector: 'verben-visible-column',
  standalone: true,
  imports: [CommonModule, FormsModule, SvgComponent],
  templateUrl: './visible-column.component.html',
  styleUrls: ['./visible-column.component.scss'],
})
export class VisibleColumnComponent {
  @Input() columns: string[] = [];
  @Input() items: Item[] = [];

  visibleColumns: boolean[] = [];
  tempVisibleColumns: boolean[] = [];
  displayedColumns: number = 5;
  showMore: boolean = false;

  ngOnInit() {
    this.visibleColumns = this.columns.map(() => true);
    this.tempVisibleColumns = [...this.visibleColumns];
  }

  resetColumns() {
    this.visibleColumns = this.columns.map(() => true);
    this.tempVisibleColumns = [...this.visibleColumns];
  }

  getSelectedColumnCount(): number {
    return this.tempVisibleColumns.filter(isVisible => isVisible).length;
  }

  saveColumnVisibility() {
    this.visibleColumns = [...this.tempVisibleColumns];
  }

  cancelChanges() {
    this.tempVisibleColumns = [...this.visibleColumns];
  }

  toggleShowMore() {
    this.showMore = !this.showMore;
    if (this.showMore) {
      this.displayedColumns = this.columns.length;
    } else {
      this.displayedColumns = 5;
    }
  }
}
