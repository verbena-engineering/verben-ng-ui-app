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
    // Tinted like before, Sonner "rich colors" style: a light tint of the type
    // colour behind a deeper shade of it for the text and icon. Mixed from the
    // theme, so dark mode gets a dark tint with a light shade.
    const tint = (tone: string, bg: number) =>
      `color-mix(in srgb, var(${tone}) ${bg}%, var(--vbn-color-surface))`;
    const shade = (tone: string, fg: number) =>
      `color-mix(in oklab, var(${tone}) ${fg}%, var(--vbn-color-text))`;
    const typeStyles: Record<NotificationOptions['type'], NotificationStyles> =
      {
        success: {
          backgroundColor: tint('--vbn-color-success', 10),
          textColor: shade('--vbn-color-success', 60),
          iconName: 'success',
          iconWidth: 18,
          iconHeight: 18,
          stroke: '',
          fill: '',
        },
        error: {
          backgroundColor: tint('--vbn-color-error', 7),
          textColor: shade('--vbn-color-error', 85),
          iconName: 'warning',
          iconWidth: 18,
          iconHeight: 18,
          stroke: shade('--vbn-color-error', 85),
          fill: shade('--vbn-color-error', 85),
        },
        warning: {
          backgroundColor: tint('--vbn-color-warning', 12),
          textColor: shade('--vbn-color-warning', 62),
          iconName: 'dangerInfo',
          iconWidth: 18,
          iconHeight: 18,
          stroke: shade('--vbn-color-warning', 62),
          fill: shade('--vbn-color-warning', 62),
        },
        info: {
          backgroundColor: tint('--vbn-color-info', 8),
          textColor: shade('--vbn-color-info', 85),
          iconName: 'dangerInfo',
          iconWidth: 18,
          iconHeight: 18,
          stroke: shade('--vbn-color-info', 85),
          fill: shade('--vbn-color-info', 85),
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
