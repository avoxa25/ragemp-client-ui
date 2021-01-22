import { RemoteResponse } from '../Constants/remote-response';
import { LocalEvents } from '../Constants/local-events';

class Chat {
  constructor() {
    const chat = mp.browsers.new('package://Chat/chat.html');
    chat.markAsChat();

    mp.events.add(LocalEvents.ChatCursorToggle, (h: boolean) => this.OnChatCursorToggle(h));
  }

  private OnChatCursorToggle(hidden: boolean): void {
    mp.gui.cursor.show(!hidden, !hidden);
  }
};

mp.events.add(RemoteResponse.LoginSuccess, () => new Chat());