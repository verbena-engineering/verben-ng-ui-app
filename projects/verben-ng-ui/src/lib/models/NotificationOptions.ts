import { NotificationButton } from './NotificationButton';

export interface NotificationOptions {
  timeout?: number;
  position?: string;
  backgroundColor?: string;
  textColor?: string;
  iconName?: string;
  iconWidth?: number;
  iconHeight?: number;
  stroke?: string;
  fill?: string;
  buttons?: NotificationButton[];
  /** A second, quieter line under the message, e.g. a date or a detail */
  description?: string;
  /** 'default' is the neutral look (NotificationService.show); the others are tinted */
  type: 'default' | 'success' | 'error' | 'warning' | 'info';
}
