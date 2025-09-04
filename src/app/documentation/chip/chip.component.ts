import { Component } from '@angular/core';
import { ChipChangeEvent } from 'verben-ng-ui';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
})
export class ChipComponent {
  chipValues: string[] = ['try', 'to'];
  basicChip: string[] = [];

  onChipChange(event: ChipChangeEvent) {
    console.log({
      'Basic Chip': this.basicChip,
      'Chip. Max 10. Templated item': this.chipValues,
    });
  }
}
