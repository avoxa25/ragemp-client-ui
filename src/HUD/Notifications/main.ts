import { RemoteResponse } from '../../Constants/remote-response';

class Notifications {
  private static browser: BrowserMp;
  
  constructor() {
    Notifications.browser = mp.browsers.new('package://Notifications/notifications.html');
    mp.events.add(RemoteResponse.NotificationSent, (notifyType: string, text: string) => this.Notify(notifyType, text));
  }

  private Notify(notifyType: string, text: string ): void {
    Notifications.browser.execute(`Notify(${notifyType},${text})`);
  }
};

let notify: Notifications | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => notify = notify ? notify : new Notifications());

// TODO: Remove after login screen
notify = new Notifications();