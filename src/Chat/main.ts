import { RemoteEvents } from '../Constants/remoteEvents';
import { LocalEvents } from '../Constants/localEvents';

abstract class Chat {
  public static Start(): void {
    mp.gui.chat.show(false);
    mp.events.add(RemoteEvents.ChatOpen, () => Chat.Open);
    mp.events.add(LocalEvents.ChatCursorToggle, (h: boolean) => Chat.OnChatCursorToggle(h));
  }

  private static OnChatCursorToggle(hidden: boolean): void {
    mp.gui.cursor.show(!hidden, !hidden);
  }

  private static Open(): void {
    const chat = mp.browsers.new('package://Chat/chat.html');
    chat.markAsChat();
  }
};

Chat.Start();