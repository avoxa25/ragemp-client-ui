import { NotificationType } from '../../Constants/notification-type';

class NotificationsUi {
  private readonly container: HTMLElement;
  private notificationsArray = new Array;
  private readonly maxNotifications = 3;

  constructor() {
    this.container = document.querySelector('#window') as HTMLElement;
  }

  public Push(type: string, text: string): void {
    let typeText;

    switch (type) {
      case 'Alert':
        typeText = 'Оповещение';
        break;
      case 'Info':
        typeText = 'Информация';
        break;
      case 'Success':
        typeText = 'Успешно';
        break;
      case 'Warning':
        typeText = 'Предупреждение';
        break;
      default:
        typeText = 'Ошибка';
        break;
    }

    const notification = document.createElement('div') as HTMLElement;
    notification.classList.add('notification');
    notification.classList.add(type.toString().toLowerCase());

    const notificationText = document.createElement('p') as HTMLElement;
    notificationText.innerHTML = typeText;
    notification.appendChild(notificationText);

    const notificationType = document.createElement('p') as HTMLElement;
    notificationType.innerHTML = text;
    notification.appendChild(notificationType);

    const countNotifications = document.querySelectorAll('.notification');
    if (countNotifications.length >= this.maxNotifications) {
      this.notificationsArray.push(notification);
      return;
    }

    this.container.appendChild(notification);

    setTimeout(() => this.Delete(notification), 9999);
  }

  private Delete(notification: HTMLElement): void {
    notification.remove();

    if (this.notificationsArray.length > 0) {
      this.container.appendChild(this.notificationsArray[0]);
      setTimeout(() => {
        const temp = this.notificationsArray[0];
        this.notificationsArray.shift();
        this.Delete(temp);
      }, 10001);
      return;
    }
  }
}

const notificationsUi = new NotificationsUi();
(window as any).notificationsUi = notificationsUi;