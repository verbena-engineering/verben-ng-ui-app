import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { NotificationService } from 'verben-ng-ui/src/lib/services';
import {
  NotificationButton,
  NotificationOptions,
} from 'verben-ng-ui/src/lib/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'verben-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent implements OnInit, OnDestroy {
  @Input() width?: string = '400px';
  height?: string = '50px';
  // Look (2026-10-16): close to shadcn / Sonner "rich colors" toasts
  borderRadius: string = '10px';
  fontSize: string = '14px';
  fontWeight: string = '500';
  padding: string = '14px 2.5rem 14px 16px';
  @Input() content?: string;
  top: string = '';
  bottom: string = '';
  @Input() buttons: NotificationButton[] = [];
  @Input() timeout: number = 10000;
  @Input() position: string = 'top-left';
  transition: string = '0.6s ease-in-out';

  showNotification = false;
  notificationContent = '';
  notificationOptions: NotificationOptions | null = null;
  subscription: Subscription;

  constructor(private notificationService: NotificationService) {
    this.subscription = new Subscription();
  }

  ngOnInit() {
    this.subscription = this.notificationService.notification$.subscribe(
      (notification) => {
        if (notification) {
          this.showNotification = true;
          this.notificationContent = notification.message;
          this.notificationOptions = notification.options;

          setTimeout(() => {
            this.closeNotification();
          }, this.notificationOptions.timeout);
        } else {
          this.showNotification = false;
        }
      },
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeNotification() {
    this.showNotification = false;
    this.notificationService.clearNotification();
  }

  @Output() buttonClick = new EventEmitter<NotificationButton>();
  @Output() close = new EventEmitter();

  get notificationStyles() {
    return {
      'background-color': this.notificationOptions
        ? this.notificationOptions.backgroundColor
        : '',
      color: this.notificationOptions ? this.notificationOptions.textColor : '',
      // The toast's colours for its buttons (main = text colour, others = a tint of it)
      '--vbn-toast-fg': this.notificationOptions?.textColor || 'currentColor',
      '--vbn-toast-bg': this.notificationOptions?.backgroundColor || 'transparent',
      '--vbn-toast-soft': 'color-mix(in srgb, var(--vbn-toast-fg) 12%, transparent)',
      padding: this.padding,
      'border-radius': this.borderRadius,
      border: '1px solid color-mix(in srgb, currentColor 20%, transparent)',
      width: this.width,
      'font-size': this.fontSize,
      'font-weight': this.fontWeight,
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'space-between',
      ...this.getPositionStyles(),
      position: 'fixed',
      'z-index': '9999',
      transition: this.transition,
    };
  }

  getPositionStyles() {
    const positions: { [key: string]: any } = {
      'top-left': {
        top: this.top || '1rem',
        left: this.showNotification ? '1rem' : '-100%',
        transition: 'top 0.5s ease-in-out',
      },
      'top-right': {
        top: this.top || '1rem',
        right: this.showNotification ? '1rem' : '-100%',
        transition: 'top 0.5s ease-in-out',
      },
      'middle-left': {
        top: this.top || '45%',
        left: this.showNotification ? '1rem' : '-100%',
        transition: 'top 0.5s ease-in-out',
      },
      'middle-right': {
        top: this.top || '45%',
        right: this.showNotification ? '1rem' : '-100%',
        transition: 'top 0.5s ease-in-out',
      },
      'bottom-left': {
        bottom: this.bottom || '1rem',
        left: this.showNotification ? '1rem' : '-100%',
        transition: 'bottom 0.5s ease-in-out',
      },
      'bottom-right': {
        bottom: this.bottom || '1rem',
        right: this.showNotification ? '1rem' : '-100%',
        transition: 'bottom 0.5s ease-in-out',
      },
    };

    return positions[this.position] || positions['top-left'];
  }

  get btnWrapperStyle() {
    return {
      display: 'flex',
      'align-items': 'center',
      gap: '6px',
    };
  }

  get innerWrapperStyles() {
    return {
      display: 'flex',
      'align-items': 'center',
      gap: '10px',
    };
  }

  onButtonClick(button: NotificationButton) {
    this.buttonClick.emit(button);
  }
}
