import { RemoteEvents } from '../Constants/remoteEvents';

abstract class HudNotifications {
  private static browser: BrowserMp;
  private static isActive: boolean;

  public static Start(): void {
    HudNotifications.browser = mp.browsers.new('package://Notifications/notifications.html');
    HudNotifications.isActive = true;
    mp.events.add(RemoteEvents.NotificationSent, (notifyType: string, text: string) => HudNotifications.Notify(notifyType, text));
  }

  public static Notify(notifyType: string, text: string ): void {
    if (HudNotifications.isActive) {
      HudNotifications.browser.execute(`Notify(${notifyType},${text})`);
    }
  }
};

HudNotifications.Start();