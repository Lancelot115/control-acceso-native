import { Notification } from '../types';
import { generateId } from '../utils/idGenerator';

type Listener = (notification: Notification) => void;
const listeners: Listener[] = [];

export const notificationService = {
  subscribe(listener: Listener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  },

  emit(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const full: Notification = {
      ...notification,
      id: generateId('N'),
      timestamp: new Date(),
      read: false,
    };
    listeners.forEach(l => l(full));
    return full;
  },

  success(title: string, message: string) {
    return this.emit({ title, message, type: 'success' });
  },

  error(title: string, message: string) {
    return this.emit({ title, message, type: 'error' });
  },

  warning(title: string, message: string) {
    return this.emit({ title, message, type: 'warning' });
  },

  info(title: string, message: string) {
    return this.emit({ title, message, type: 'info' });
  },
};