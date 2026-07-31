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
  type: 'success' | 'error' | 'warning' | 'info';
}
