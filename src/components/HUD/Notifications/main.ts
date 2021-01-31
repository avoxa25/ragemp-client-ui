import { NotificationType } from '../../../models/enums/notification-type';
import { RemoteResponse } from '../../../models/enums/events/remote-response';

class Notifications {
  private readonly browser: BrowserMp;

  public constructor() {
    this.browser = mp.browsers.new('package://components/HUD/Notifications/notifications.html');
    mp.events.add(RemoteResponse.NotificationSent, (type: NotificationType, text: string) => this.Display(type, text));
  }

  private Display(type: NotificationType, text: string): void {
    this.browser.execute(`window.notificationsUi.Push('${type}', '${text}');`);
  }
};

let notify: Notifications | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => notify = notify ? notify : new Notifications());