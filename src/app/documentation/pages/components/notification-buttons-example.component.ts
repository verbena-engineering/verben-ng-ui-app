import { Component } from '@angular/core';
import { NotificationService } from 'verben-ng-ui';

/**
 * Live "toast with buttons" for the Notification docs: its own
 * NotificationService (so the page's other toasts don't show here) and a
 * stage with `transform`, which makes the stage, not the window, the frame
 * for the toast's position: fixed. In an app you don't need either.
 */
@Component({
  selector: 'docs-notification-buttons-example',
  providers: [NotificationService],
  template: `
    <div class="nx">
      <div class="nx-triggers">
        <verbena-button size="sm" styleType="outline" text="Delete an invoice" (click)="deleteInvoice()"></verbena-button>
        <verbena-button size="sm" styleType="outline" text="Leave with unsaved changes" (click)="leavePage()"></verbena-button>
        <verbena-button size="sm" styleType="outline" text="Lose the connection" (click)="connectionLost()"></verbena-button>
        <verbena-button size="sm" styleType="outline" text="New version" (click)="newVersion()"></verbena-button>
      </div>

      <div class="nx-stage">
        <verben-notification position="top-right"></verben-notification>
        <p class="nx-hint" *ngIf="!last">Pick a scenario: the toast slides in here with its buttons.</p>
        <p class="nx-hint" *ngIf="last">Button clicked: <b>{{ last }}</b></p>
      </div>
    </div>
  `,
  styles: [
    `
      .nx {
        display: grid;
        gap: 14px;
        width: 100%;
      }
      .nx-triggers {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      /* transform: the toast (position: fixed) is placed in this box */
      .nx-stage {
        position: relative;
        transform: translateZ(0);
        overflow: hidden;
        display: grid;
        place-items: end start;
        min-height: 190px;
        padding: 14px;
        border: 1px dashed var(--vbn-color-border);
        border-radius: 12px;
        background: var(--vbn-color-background, transparent);
      }
      /* In this box (not the screen) the toast's 100vw limit would be too wide */
      .nx-stage ::ng-deep .mainwrapper {
        max-width: calc(100% - 2rem);
      }
      .nx-hint {
        margin: 0;
        color: var(--vbn-color-text-muted);
        font-size: 13px;
      }
    `,
  ],
})
export class NotificationButtonsExampleComponent {
  last = '';

  constructor(private notifications: NotificationService) {}

  deleteInvoice(): void {
    this.notifications.info('Invoice INV-0042 was deleted.', {
      timeout: 8000,
      buttons: [
        {
          text: 'Undo',
          callBack: () => {
            this.last = 'Undo';
            this.notifications.success('Invoice INV-0042 restored.', { timeout: 3000 });
          },
        },
      ],
    });
  }

  leavePage(): void {
    this.notifications.warning('You have unsaved changes on this invoice.', {
      timeout: 10000,
      buttons: [
        {
          text: 'Stay',
          callBack: () => {
            this.last = 'Stay';
            this.notifications.clearNotification();
          },
        },
        {
          text: 'Leave anyway',
          bgColor: 'var(--vbn-color-error)',
          primarycolor: '#ffffff',
          callBack: () => {
            this.last = 'Leave anyway';
            this.notifications.info('Changes discarded.', { timeout: 3000 });
          },
        },
      ],
    });
  }

  connectionLost(): void {
    this.notifications.error('Could not reach the server.', {
      timeout: 10000,
      buttons: [
        {
          text: 'Retry',
          callBack: () => {
            this.last = 'Retry';
            this.notifications.success('Connected again.', { timeout: 3000 });
          },
        },
        {
          text: 'Details',
          callBack: () => {
            this.last = 'Details';
          },
        },
      ],
    });
  }

  newVersion(): void {
    this.notifications.info('A new version of the app is available.', {
      timeout: 10000,
      buttons: [
        {
          text: 'Reload',
          bgColor: 'var(--vbn-color-primary)',
          primarycolor: 'var(--vbn-color-on-primary)',
          callBack: () => {
            this.last = 'Reload';
            this.notifications.success('Updated to the latest version.', { timeout: 3000 });
          },
        },
        {
          text: 'Later',
          callBack: () => {
            this.last = 'Later';
            this.notifications.clearNotification();
          },
        },
      ],
    });
  }
}
