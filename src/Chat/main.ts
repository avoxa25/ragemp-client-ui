import { LocalEvents } from '../Constants/local-events';
import { RemoteResponse } from '../Constants/remote-response';

class Chat {
  constructor() {
    const chat = mp.browsers.new('package://Chat/chat.html');
    chat.markAsChat();

    mp.events.add(LocalEvents.ChatCursorToggle, (fc: boolean, v: boolean) => this.ToggleCharCursor(fc, v));
  }

  private ToggleCharCursor(freezeControls: boolean, visible: boolean): void {
    mp.gui.cursor.show(freezeControls, visible);
  }
};

mp.gui.chat.show(false);

let chat: Chat | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => chat = chat ? chat : new Chat());

// TODO: Remove after login screen
chat = new Chat();