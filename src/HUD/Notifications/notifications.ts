import { NotificationType } from "../../Constants/notification-type";

class NotificationsUi {
  private readonly maxNotifications = 5;
  private readonly gapHeight = 75;
  private countOfNotifications = 0;
  private bottom = 225;
  private typeText: string | undefined;
  private timeout: number | undefined;

  public ShowNotification(type: string, text: string): void {
    clearInterval(this.timeout);

    switch (type) {
      case 'Alert':
        this.typeText = NotificationType.Alert;
        break;
      case 'Info':
        this.typeText = NotificationType.Info;
        break;
      case 'Success':
        this.typeText = NotificationType.Success;
        break;
      case 'Warning':
        this.typeText = NotificationType.Warning;
        break;
      default:
        this.typeText = NotificationType.Error;
        break;
    }

    const container = document.getElementById('notification-container') as HTMLElement;

    const notification = document.createElement('div') as HTMLElement;
    notification.classList.add('notification');
    notification.style.bottom = '225px';
    notification.classList.add(`${type.toLowerCase()}`);

    const notificationText = document.createElement('p') as HTMLElement;
    notificationText.innerHTML = this.typeText;
    notification.appendChild(notificationText);

    const notificationType = document.createElement('p') as HTMLElement;
    notificationType.classList.add(`${type}Text`);
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

    container.appendChild(notification);

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