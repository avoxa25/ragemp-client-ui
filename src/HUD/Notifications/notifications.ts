import { NotificationType } from '../../Constants/notification-type';

class NotificationsUi {
  private readonly container: HTMLElement;
  private notificationsArray = new Array;
  private timeout: number | undefined;

  constructor() {
    this.container = document.querySelector('#window') as HTMLElement;
  }

  public Push(type: string, text: string): void {
    clearTimeout(this.timeout);
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

    this.notificationsArray.push(notification);

    this.timeout = setTimeout(() => this.ShowController(), 3000);
  }

  private ShowController(): void {
    const isArrayNotEmpty = this.notificationsArray.length > 0;

    if (isArrayNotEmpty) {
      for (let i = 0; i < this.notificationsArray.length; i++) {
        if ((i + 1) % 2 === 0) setTimeout(() => this.ShowHide(this.notificationsArray[i]), 9000);
        else this.ShowHide(this.notificationsArray[i]);
      }
    }
  }

  private ShowHide(notification: HTMLElement): void {
    this.container.appendChild(notification);
    setTimeout(() => 
    {
      this.notificationsArray.shift();
      notification.remove();
    }, 10000);
  }
}

const notificationsUi = new NotificationsUi();
(window as any).notificationsUi = notificationsUi;