import { RemoteEvents } from '../Constants/remoteEvents';

abstract class HudNotifications {
  private static browser: BrowserMp;

  public static Start(): void {
    HudNotifications.browser = mp.browsers.new('package://Notifications/notifications.html');
    mp.events.add(RemoteEvents.NotificationSent, (notifyType: string, text: string) => HudNotifications.Notify(notifyType, text));
  }

  public static Notify(notifyType: string, text: string ): void {
    HudNotifications.browser.execute(`Notify(${notifyType},${text})`);
  }
};

HudNotifications.Start();