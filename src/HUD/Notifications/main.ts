import { NotificationType } from '../../Constants/notification-type';
import { RemoteResponse } from '../../Constants/remote-response';

class Notifications {
  private readonly browser: BrowserMp;

  constructor() {
    this.browser = mp.browsers.new('package://HUD/Notifications/notifications.html');
    mp.events.add(RemoteResponse.NotificationSent, (type: NotificationType, text: string) => this.Display(type, text));
  }

  private Display(type: NotificationType, text: string): void {
    mp.console.logInfo(type);
    this.browser.execute(`window.notificationsUi.ShowNotification('${type}', '${text}');`);
  }
};

let notify: Notifications | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => notify = notify ? notify : new Notifications());