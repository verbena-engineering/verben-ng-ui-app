import { Component } from '@angular/core';
import { NotificationService } from 'verben-ng-ui';
import { DocsProp } from '../../docs-kit/props-table.component';

@Component({
  selector: 'docs-notification-page',
  templateUrl: './notification-page.component.html',
})
export class NotificationPageComponent {
  constructor(private notifications: NotificationService) {}

  success(): void {
    this.notifications.success('Changes saved.', { timeout: 3000 });
  }

  error(): void {
    this.notifications.error('Could not reach the server.', { timeout: 3000 });
  }

  warning(): void {
    this.notifications.warning('Your session expires in 5 minutes.', { timeout: 3000 });
  }

  info(): void {
    this.notifications.info('A new version is available.', { timeout: 3000 });
  }

  withAction(): void {
    this.notifications.info('Invoice INV-0042 was deleted.', {
      timeout: 5000,
      buttons: [{ text: 'Undo', callBack: () => this.success() }],
    });
  }

  code = {
    basic: `<!-- Once, e.g. in app.component.html -->
<verben-notification position="top-right"></verben-notification>

<verbena-button text="Success" styleType="outline" (click)="success()"></verbena-button>
<verbena-button text="Error" styleType="outline" (click)="error()"></verbena-button>`,

    basicTs: `import { NotificationService } from 'verben-ng-ui';

constructor(private notifications: NotificationService) {}

success() {
  this.notifications.success('Changes saved.', { timeout: 3000 });
}

error() {
  this.notifications.error('Could not reach the server.', { timeout: 3000 });
}
// also: warning(message, options), info(message, options)`,

    buttons: `<!-- Once, e.g. in app.component.html -->
<verben-notification position="top-right"></verben-notification>`,

    buttonsTs: `import { NotificationService } from 'verben-ng-ui';

constructor(private notifications: NotificationService) {}

leavePage() {
  this.notifications.warning('You have unsaved changes on this invoice.', {
    timeout: 10000,
    buttons: [
      // A button doesn't close the toast by itself: do it in callBack if you want
      { text: 'Stay', callBack: () => this.notifications.clearNotification() },
      {
        text: 'Leave anyway',
        bgColor: 'var(--vbn-color-error)',
        primarycolor: '#ffffff',
        callBack: () => this.discardAndLeave(),
      },
    ],
  });
}

connectionLost() {
  this.notifications.error('Could not reach the server.', {
    timeout: 10000,
    buttons: [
      // Showing another toast replaces the current one
      { text: 'Retry', callBack: () => this.retry().then(() => this.notifications.success('Connected again.')) },
      { text: 'Details', callBack: () => this.openDetails() },
    ],
  });
}`,

    action: `<verbena-button text="Delete with undo" styleType="outline" (click)="withAction()"></verbena-button>`,

    actionTs: `withAction() {
  this.notifications.info('Invoice INV-0042 was deleted.', {
    timeout: 5000,
    buttons: [{ text: 'Undo', callBack: () => this.restore() }],
  });
}`,
  };

  methods: DocsProp[] = [
    { name: 'success(message, options?)', type: 'void', description: 'Green success toast.' },
    { name: 'error(message, options?)', type: 'void', description: 'Error toast.' },
    { name: 'warning(message, options?)', type: 'void', description: 'Warning toast.' },
    { name: 'info(message, options?)', type: 'void', description: 'Informational toast.' },
    { name: 'clearNotification()', type: 'void', description: 'Hide the current toast.' },
  ];

  options: DocsProp[] = [
    { name: 'timeout', type: 'number', default: '2000', description: 'Milliseconds before it hides.' },
    { name: 'buttons', type: 'NotificationButton[]', default: '—', description: 'Buttons under the message, each with its own callBack (see NotificationButton).' },
    { name: 'backgroundColor / textColor', type: 'string', default: 'per type', description: 'Override the type colors.' },
    { name: 'iconName / iconWidth / iconHeight', type: 'string / number', default: 'per type', description: 'Icon from the library set.' },
  ];

  buttonFields: DocsProp[] = [
    { name: 'text', type: 'string', default: '—', description: 'The label.' },
    { name: 'callBack', type: '() => any', default: '—', description: "Runs on click. The toast stays open: call clearNotification() or show another toast to replace it." },
    { name: 'bgColor', type: 'string', default: 'toast colour', description: "Background. Default: the first button is solid in the toast's colour, the others a soft tint. E.g. 'var(--vbn-color-error)' for a destructive action." },
    { name: 'primarycolor / secondarycolor', type: 'string', default: '—', description: 'Text colour (the first one set is used).' },
    { name: 'fontSize / fontWeight', type: 'string', default: '—', description: 'Text size and weight.' },
  ];

  outputs: DocsProp[] = [
    { name: 'buttonClick', type: 'EventEmitter<NotificationButton>', description: 'For buttons given to the component with [buttons] (used when a toast has no buttons of its own).' },
  ];

  inputs: DocsProp[] = [
    { name: 'position', type: 'string', default: "'top-left'", description: "Screen corner, e.g. 'top-right'." },
    { name: 'width', type: 'string', default: "'400px'", description: 'Toast width (never wider than the screen).' },
    { name: 'buttons', type: 'NotificationButton[]', default: '[]', description: 'Buttons for toasts that pass none in their options; clicks also emit (buttonClick).' },
  ];
}
