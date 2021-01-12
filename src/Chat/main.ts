import { LocalEvents } from '../Constants/localEvents';
import { RemoteEvents } from '../Constants/remoteEvents';

abstract class Chat {
  public static Start(): void {
    mp.gui.chat.show(false);

    const chat = mp.browsers.new('package://Chat/chat.html');
    chat.markAsChat();

    mp.events.add(LocalEvents.ChatCursorToggle, (h: boolean) => Chat.OnChatCursorToggle(h));
    mp.events.add(LocalEvents.ChatSendMessage, (m: string, c: string) => Chat.OnSendMessage(m, c));
  }

  private static OnChatCursorToggle(hidden: boolean): void {
    mp.gui.cursor.show(!hidden, !hidden)
  }

  private static OnSendMessage(message: string, channel: string): void {
    mp.events.callRemote(RemoteEvents.ChatSendMessage, message, channel)
  }
};

Chat.Start();