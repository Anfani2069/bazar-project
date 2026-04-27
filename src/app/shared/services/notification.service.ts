import { Injectable, signal } from '@angular/core';

export type NotifType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: number;
  type: NotifType;
  message: string;
}

const ICONS: Record<NotifType, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
};

const COLORS: Record<NotifType, string> = {
  success: 'bg-emerald-500',
  error:   'bg-red-500',
  warning: 'bg-amber-500',
  info:    'bg-blue-500',
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _id = 0;

  readonly notifications = signal<Notification[]>([]);

  readonly icons  = ICONS;
  readonly colors = COLORS;

  show(type: NotifType, message: string, duration = 3500): void {
    const id = ++this._id;
    this.notifications.update(list => [...list, { id, type, message }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  success(msg: string): void { this.show('success', msg); }
  error(msg: string):   void { this.show('error',   msg); }
  warning(msg: string): void { this.show('warning', msg); }
  info(msg: string):    void { this.show('info',    msg); }
}
