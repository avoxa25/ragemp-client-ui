import { LocalEvents } from '../Constants/localEvents';

abstract class Chat {
  public static Start(): void {
    mp.gui.chat.show(false);

    const chat = mp.browsers.new('package://Chat/chat.html');
    chat.markAsChat();

    mp.events.add(LocalEvents.ChatCursorToggle, (h: boolean) => Chat.OnChatCursorToggle(h));
  }

  private static OnChatCursorToggle(hidden: boolean): void {
    mp.gui.cursor.show(!hidden, !hidden)
  }
};

Chat.Start();