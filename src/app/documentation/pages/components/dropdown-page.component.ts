import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

interface Country {
  code: string;
  name: string;
  region: string;
}

@Component({
  selector: 'docs-dropdown-page',
  templateUrl: './dropdown-page.component.html',
})
export class DropdownPageComponent {
  fruits = ['Apple', 'Banana', 'Mango', 'Orange', 'Pineapple'];
  fruit: string | null = 'Banana';

  countries: Country[] = [
    { code: 'NG', name: 'Nigeria', region: 'Africa' },
    { code: 'GH', name: 'Ghana', region: 'Africa' },
    { code: 'KE', name: 'Kenya', region: 'Africa' },
    { code: 'GB', name: 'United Kingdom', region: 'Europe' },
    { code: 'US', name: 'United States', region: 'Americas' },
  ];
  countryCode: string | null = 'GH';

  skills = ['Angular', 'React', 'TypeScript', 'Node.js', 'Design', 'Testing'];
  selectedSkills: string[] = ['Angular', 'TypeScript'];

  invoices = Array.from({ length: 60 }, (_, i) => ({
    id: i + 1,
    label: `Invoice #${String(i + 1).padStart(3, '0')}`,
  }));
  invoice = { id: 42, label: 'Invoice #042' };

  code = {
    basic: `<verben-drop-down
  placeholder="Pick a fruit"
  [options]="fruits"
  [showClear]="true"
  [(ngModel)]="fruit"
></verben-drop-down>`,

    basicTs: `fruits = ['Apple', 'Banana', 'Mango', 'Orange', 'Pineapple'];
fruit: string | null = 'Banana';`,

    objects: `<verben-drop-down
  placeholder="Country"
  [options]="countries"
  optionLabel="name"
  optionSubLabel="region"
  optionValue="code"
  [(ngModel)]="countryCode"
></verben-drop-down>
<!-- countryCode === 'GH' -->`,

    search: `<verben-drop-down
  placeholder="Search countries"
  [options]="countries"
  optionLabel="name"
  [filter]="true"
  filterBy="name"
></verben-drop-down>`,

    multi: `<verben-drop-down
  placeholder="Skills"
  [options]="skills"
  [multiselect]="true"
  [showClear]="true"
  width="320px"
  [(ngModel)]="selectedSkills"
></verben-drop-down>`,

    scroll: `<verben-drop-down
  [options]="invoices"
  optionLabel="label"
  selectKey="id"
  [autoScrollToCurrentItem]="true"
  [(ngModel)]="invoice"
></verben-drop-down>`,

    scrollTs: `invoices = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  label: \`Invoice #\${String(i + 1).padStart(3, '0')}\`,
}));
// A different object with the same id — matched through selectKey
invoice = { id: 42, label: 'Invoice #042' };`,
  };

  inputs: DocsProp[] = [
    { name: 'options', type: 'any[] | DropdownMenuItem[]', default: '[]', description: 'Items to choose from. Supports [(options)].' },
    { name: 'placeholder', type: 'string', default: '—', description: 'Shown when nothing is selected.' },
    { name: 'optionLabel / optionSubLabel', type: 'string', default: '—', description: 'Property names to display for object options.' },
    { name: 'optionValue', type: 'string', default: '—', description: 'Property used as the bound value instead of the whole object.' },
    { name: 'selectKey', type: 'string | null', default: 'null', description: 'Property used to match the current value to an option.' },
    { name: 'multiselect', type: 'boolean', default: 'false', description: 'Allow several selections (value becomes an array).' },
    { name: 'display', type: "'chip' | 'default'", default: "'chip'", description: 'How multiselect values are shown.' },
    { name: 'filter / filterBy', type: 'boolean / string', default: 'false / —', description: 'Search box, and which property to search.' },
    { name: 'showClear', type: 'boolean', default: 'false', description: 'Show a clear (×) button.' },
    { name: 'autoScrollToCurrentItem', type: 'boolean', default: 'false', description: 'Open with the selected item scrolled into view.' },
    { name: 'group', type: 'boolean', default: 'false', description: 'Nested options using DropdownMenuItem[].' },
    { name: 'lazyLoad / load / search', type: 'boolean / fn / fn', default: 'false', description: 'Load pages of options on demand ("See more").' },
    { name: 'required / invalidMessage', type: 'boolean / string', default: 'false', description: 'Validation state and message.' },
    { name: 'width / overlayWidth', type: 'string / number', default: "'12rem' / auto", description: 'Field width and list width.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the dropdown.' },
  ];

  outputs: DocsProp[] = [
    { name: 'onChange', type: 'EventEmitter<DropdownChangeEvent>', description: 'Selection changed: { value, dataSet, originalEvent }.' },
    { name: 'onClear', type: 'EventEmitter<Event>', description: 'The clear button was used.' },
    { name: 'onClick', type: 'EventEmitter<Event>', description: 'The field was clicked.' },
    { name: 'optionsChange', type: 'EventEmitter<any[]>', description: 'Options changed internally (search / lazy load).' },
  ];
}
