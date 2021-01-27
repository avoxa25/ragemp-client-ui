import { NotificationType } from '../../Constants/notification-type';

class NotificationsUi {
  private readonly maxNotifications = 5;
  private readonly gapHeight = 75;
  private countOfNotifications = 0;
  private bottom = 225;
  private typeText: string | undefined;
  private timeout: number | undefined;
  private readonly container = document.getElementById('notification-container') as HTMLElement;

  public ShowNotification(type: NotificationType, text: string): void {
    clearInterval(this.timeout);

    switch (type) {
      case NotificationType.Alert:
        this.typeText = 'Оповещение';
        break;
      case NotificationType.Info:
        this.typeText = 'Информация';
        break;
      case NotificationType.Success:
        this.typeText = 'Успешно';
        break;
      case NotificationType.Warning:
        this.typeText = 'Предупреждение';
        break;
      default:
        this.typeText = 'Ошибка';
        break;
    }

    const notification = document.createElement('div') as HTMLElement;
    notification.classList.add('notification');
    notification.style.bottom = '225px';
    notification.classList.add(type.toLowerCase());

    const notificationText = document.createElement('p') as HTMLElement;
    notificationText.innerHTML = this.typeText;
    notification.appendChild(notificationText);

    const notificationType = document.createElement('p') as HTMLElement;
    notificationType.innerHTML = text;
    notification.appendChild(notificationType);

    this.countOfNotifications = this.countOfNotifications >= this.maxNotifications ? this.maxNotifications - 1 : this.countOfNotifications;

    if (this.countOfNotifications !== 0) {
      const notifications = document.querySelectorAll('.notification');
      notifications.forEach((cn) => {
        const currentNotify = cn as HTMLElement;
        if (currentNotify.style.bottom == '450px') this.DeleteLastNotification(currentNotify);

        this.bottom = Number.parseInt(currentNotify.style.bottom);
        this.bottom += this.gapHeight;
        currentNotify.style.bottom = `${this.bottom}px`;
      });
    }

    this.container.appendChild(notification);

    this.countOfNotifications++;

    this.timeout = setInterval(() => {
      const notification = document.querySelector('.notification') as HTMLElement;
      this.DeleteLastNotification(notification);
    }, 3000);
  }
  private DeleteLastNotification(notification: HTMLElement): void {
    // TODO: Create smooth hiding @memoryx3

    notification.remove();
  }
}

const notificationsUi = new NotificationsUi();
(window as any).notificationsUi = notificationsUi;