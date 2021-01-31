import { NotificationType } from '../../../models/enums/notification-type.enum';

class NotificationsUi {
  private readonly container: HTMLElement;
  private readonly maxNotifications: number;
  private readonly notificationShowTimeInSeconds: number;

  private notifications: { type: NotificationType, text: string }[];
  private shownNotification: number;

  public constructor() {
    this.container = document.querySelector('#notifications') as HTMLElement;
    this.maxNotifications = 3;
    this.notificationShowTimeInSeconds = 10;
    this.notifications = [];
    this.shownNotification = 0;
  }

  public Push(type: NotificationType, text: string): void {
    const notification = { timeoutInterval: undefined, type: type, text: text };
    this.notifications.push(notification);

    this.Render();
  }

  private Render(): void {
    if (this.notifications.length === 0) return;
    if (this.shownNotification >= this.maxNotifications) return;

    const notification = this.notifications[0];
    this.notifications = this.notifications.slice(1);
    this.shownNotification++;

    let typeText: string;
    switch (notification.type) {
      case NotificationType.Alert:
        typeText = 'Оповещение';
        break;
      case NotificationType.Info:
        typeText = 'Информация';
        break;
      case NotificationType.Success:
        typeText = 'Успешно';
        break;
      case NotificationType.Warning:
        typeText = 'Предупреждение';
        break;
      default:
      case NotificationType.Error:
        typeText = 'Ошибка';
        break;
    }

    const notificationDivClass = notification.type.toString().toLowerCase();
    const notificationDiv = document.createElement('div') as HTMLElement;
    notificationDiv.classList.add('notification');
    notificationDiv.classList.add(notificationDivClass);

    const notificationTypeText = document.createElement('p') as HTMLElement;
    notificationTypeText.innerHTML = typeText;
    notificationDiv.appendChild(notificationTypeText);

    const notificationText = document.createElement('p') as HTMLElement;
    notificationText.innerHTML = notification.text;
    notificationDiv.appendChild(notificationText);

    this.container.append(notificationDiv);

    setTimeout(() => this.Expire(notificationDiv), this.notificationShowTimeInSeconds * 1000);
  }

  private Expire(notificationDiv: HTMLElement): void {
    notificationDiv.remove();
    this.shownNotification--;
    this.Render();
  }
}

const notificationsUi = new NotificationsUi();
(window as any).notificationsUi = notificationsUi;