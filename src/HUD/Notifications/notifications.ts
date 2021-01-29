import { NotificationType } from '../../Constants/notification-type';

class NotificationsUi {
  private readonly container: HTMLElement;
  private notificationsArray = new Array;

  constructor() {
    this.container = document.querySelector('#window') as HTMLElement;
  }

  public Push(type: NotificationType, text: string): void {

    let typeText;

    switch (type) {
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

    setTimeout(this.ShowController, 30000);
  }

  private ShowController(): void {
    const isArrayNotEmpty = this.notificationsArray.length > 0;

    if (isArrayNotEmpty) {
      for (let i = 0; i < this.notificationsArray.length; i++) {
        if (i++ % 2) setTimeout(() => {}, 10000);
        this.Show(this.notificationsArray[i]);
        this.Delete(i++);
      }
    }
  }

  private Show(notification: HTMLElement): void {
    this.container.innerHTML += notification;
  }

  private Delete(count: number): void {
    let firstNotification;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        firstNotification = document.querySelector('.notification') as HTMLElement;
        firstNotification.remove();
      }, 10000);
    }
  }
}

const notificationsUi = new NotificationsUi();
(window as any).notificationsUi = notificationsUi;