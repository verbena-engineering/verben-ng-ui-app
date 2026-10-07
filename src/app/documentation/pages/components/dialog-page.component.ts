import { Component } from '@angular/core';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-dialog-page',
  templateUrl: './dialog-page.component.html',
})
export class DialogPageComponent {
  dialogOpen = false;
  drawerOpen = false;
  lastAction = '';

  confirm(): void {
    this.lastAction = 'Deleted';
    this.dialogOpen = false;
  }

  code = {
    basic: `<verbena-button text="Delete item" styleType="danger" (click)="dialogOpen = true"></verbena-button>

<verben-dialogue
  size="small"
  [isVisible]="dialogOpen"
  [headerTemplate]="header"
  [bodyTemplate]="body"
  [footerTemplate]="footer"
  (closeModal)="dialogOpen = false"
></verben-dialogue>

<ng-template #header>Delete this item?</ng-template>
<ng-template #body>This can't be undone. The invoice will be removed for everyone.</ng-template>
<ng-template #footer>
  <verbena-button text="Cancel" styleType="outline" (click)="dialogOpen = false"></verbena-button>
  <verbena-button text="Delete" styleType="danger" (click)="confirm()"></verbena-button>
</ng-template>`,

    basicTs: `dialogOpen = false;

confirm() {
  // ...delete
  this.dialogOpen = false;
}`,

    drawer: `<verbena-button text="Open drawer" styleType="outline" (click)="drawerOpen = true"></verbena-button>

<verben-dialogue
  mode="drawer"
  position="right"
  drawerWidth="380px"
  [isVisible]="drawerOpen"
  [headerTemplate]="drawerHeader"
  [bodyTemplate]="drawerBody"
  [disableFooter]="true"
  (closeModal)="drawerOpen = false"
></verben-dialogue>`,
  };

  inputs: DocsProp[] = [
    { name: 'isVisible', type: 'boolean', default: 'false', description: 'Open/closed. Set it back to false in (closeModal).' },
    { name: 'headerTemplate / bodyTemplate / footerTemplate', type: 'TemplateRef | null', default: 'null', description: 'Content of each section.' },
    { name: 'mode', type: "'dialogue' | 'drawer'", default: "'dialogue'", description: 'Centered modal or side drawer.' },
    { name: 'size', type: "'small' | 'medium' | 'large' | 'any'", default: "'small'", description: 'Max width of the modal (ignored if dialogueWidth is set).' },
    { name: 'position / drawerWidth', type: "'left' | 'right' / string", default: "'right' / '500px'", description: 'Drawer side and width.' },
    { name: 'dialogueWidth', type: 'string', default: "''", description: 'Exact modal width.' },
    { name: 'showCloseIcon', type: 'boolean', default: 'true', description: 'Show the × button.' },
    { name: 'dismissOutsideClick / closeOnEscape', type: 'boolean', default: 'true', description: 'Close on backdrop click / Esc.' },
    { name: 'disableFooter', type: 'boolean', default: 'false', description: 'Hide the footer area.' },
    { name: 'modalData', type: 'any', default: '—', description: 'Passed back in openModal / closeModal.' },
    { name: 'backdropColor / dialogueBgColor / borderRadius / padding / boxShadow', type: 'string', default: 'theme', description: 'Style overrides.' },
  ];

  outputs: DocsProp[] = [
    { name: 'openModal', type: 'EventEmitter<any>', description: 'Fired when it opens, with modalData.' },
    { name: 'closeModal', type: 'EventEmitter<any>', description: 'Fired when closed by ×, backdrop or Esc, with modalData.' },
  ];
}
