import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface NotificationOptions {
  timeout?: number;
  position?: string;
  buttons?: { text: string; bgColor?: string; primaryColor?: string }[];
  type: 'success' | 'error' | 'warning' | 'info';
}

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
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<{ message: string, options: NotificationOptions & NotificationStyles } | null>(null);
  notification$ = this.notificationSubject.asObservable();

  private getDefaultOptions(type: NotificationOptions['type']): NotificationStyles {
    const typeStyles: Record<NotificationOptions['type'], NotificationStyles> = {
      success: { 
        backgroundColor: '#D6F3E6', 
        textColor: '#2DB76F', 
        iconName: 'success',
        iconWidth: 20,
        iconHeight: 20,
        stroke: '',
        fill: ''
      },
      error: { 
        backgroundColor: '#FFE681', 
        textColor: '#E20000', 
        iconName: 'warning',
        iconWidth: 20,
        iconHeight: 20,
        stroke: '#E20000',
        fill: '#E20000'
      },
      warning: { 
        backgroundColor: '#FFE681', 
        textColor: '#E20000', 
        iconName: 'dangerInfo',
        iconWidth: 20,
        iconHeight: 20,
        stroke: '#E20000',
        fill: '#E20000'
      },
      info: {
        backgroundColor: '#FFE681', 
        textColor: '#E20000', 
        iconName: 'dangerInfo',
        iconWidth: 20,
        iconHeight: 20,
        stroke: '#E20000',
        fill: '#E20000'
      }
    };

    return typeStyles[type] || { 
      backgroundColor: '#333', 
      textColor: '#fff', 
      iconName: '', 
      iconWidth: 20, 
      iconHeight: 20, 
      stroke: '', 
      fill: '' 
    };
  }

  showNotification(type: NotificationOptions['type'], message: string, options: Partial<NotificationOptions> = {}) {
    const defaultOptions: NotificationOptions & NotificationStyles = { 
      timeout: 2000, 
      position: 'top-right', 
      ...this.getDefaultOptions(type), 
      type 
    };
    this.notificationSubject.next({ message, options: { ...defaultOptions, ...options } });
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
