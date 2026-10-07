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
    { name: 'buttons', type: 'NotificationButton[]', default: '—', description: 'Action buttons: { text, callBack, bgColor, … }.' },
    { name: 'backgroundColor / textColor', type: 'string', default: 'per type', description: 'Override the type colors.' },
    { name: 'iconName / iconWidth / iconHeight', type: 'string / number', default: 'per type', description: 'Icon from the library set.' },
  ];

  inputs: DocsProp[] = [
    { name: 'position', type: 'string', default: "'top-left'", description: "Screen corner, e.g. 'top-right'." },
    { name: 'width', type: 'string', default: "'400px'", description: 'Toast width.' },
  ];
}
