import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  NotificationButton,
  NotificationOptions,
} from 'verben-ng-ui/src/lib/models';

interface NotificationStyles {
  backgroundColor: string;
  textColor: string;
  iconName: string;
  iconWidth: number;
  iconHeight: number;
  stroke: string;
  fill: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<{
    message: string;
    options: NotificationOptions & NotificationStyles;
  } | null>(null);
  notification$ = this.notificationSubject.asObservable();

  private getDefaultOptions(
    type: NotificationOptions['type'],
  ): NotificationStyles {
    const typeStyles: Record<NotificationOptions['type'], NotificationStyles> =
      {
        success: {
          backgroundColor: 'var(--vbn-status-success-bg)',
          textColor: 'var(--vbn-status-success-fg)',
          iconName: 'success',
          iconWidth: 20,
          iconHeight: 20,
          stroke: '',
          fill: '',
        },
        error: {
          backgroundColor: 'var(--vbn-status-error-bg)',
          textColor: 'var(--vbn-status-error-fg)',
          iconName: 'warning',
          iconWidth: 20,
          iconHeight: 20,
          stroke: 'var(--vbn-status-error-fg)',
          fill: 'var(--vbn-status-error-fg)',
        },
        warning: {
          backgroundColor: 'var(--vbn-status-warning-bg)',
          textColor: 'var(--vbn-status-warning-fg)',
          iconName: 'dangerInfo',
          iconWidth: 20,
          iconHeight: 20,
          stroke: 'var(--vbn-status-warning-fg)',
          fill: 'var(--vbn-status-warning-fg)',
        },
        info: {
          backgroundColor: 'var(--vbn-status-info-bg)',
          textColor: 'var(--vbn-status-info-fg)',
          iconName: 'dangerInfo',
          iconWidth: 20,
          iconHeight: 20,
          stroke: 'var(--vbn-status-info-fg)',
          fill: 'var(--vbn-status-info-fg)',
        },
      };

    return (
      typeStyles[type] || {
        backgroundColor: 'var(--vbn-color-text)',
        textColor: 'var(--vbn-color-surface)',
        iconName: '',
        iconWidth: 20,
        iconHeight: 20,
        stroke: '',
        fill: '',
      }
    );
  }

  showNotification(
    type: NotificationOptions['type'],
    message: string,
    options: Partial<NotificationOptions> = {},
  ) {
    const defaultOptions: NotificationOptions & NotificationStyles = {
      timeout: 2000,
      position: 'top-right',
      ...this.getDefaultOptions(type),
      type,
    };
    this.notificationSubject.next({
      message,
      options: { ...defaultOptions, ...options },
    });
  }

  clearNotification() {
    this.notificationSubject.next(null);
  }

  success(message: string, options?: Partial<NotificationOptions>) {
    this.showNotification('success', message, options);
  }

  warning(message: string, options?: Partial<NotificationOptions>) {
    this.showNotification('warning', message, options);
  }

  error(message: string, options?: Partial<NotificationOptions>) {
    this.showNotification('error', message, options);
  }

  info(message: string, options?: Partial<NotificationOptions>) {
    this.showNotification('info', message, options);
  }
}
