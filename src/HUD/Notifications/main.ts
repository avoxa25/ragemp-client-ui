import { RemoteResponse } from '../../Constants/remote-response';

class Notifications {
  private readonly browser: BrowserMp;

  constructor() {
    this.browser = mp.browsers.new('package://HUD/Notifications/notifications.html');
    mp.events.add(RemoteResponse.NotificationSent, (notifyType: string, text: string) => this.Notification(notifyType, text));
  }

  private Notification(notifyType: string, text: string): void {
    this.browser.execute(`window.notificationsUi.ShowNotification('${notifyType}', '${text}');`);
  }
};

let notify: Notifications | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => notify = notify ? notify : new Notifications());

// FIXME: Remove after login screen

notify = new Notifications();