import { LocalEvent } from '../../models/enums/events/local-event.enum';
import { RemoteResponse } from '../../models/enums/events/remote-response.enum';

class Chat {
  constructor() {
    const chat = mp.browsers.new('package://components/Chat/chat.html');
    chat.markAsChat();

    mp.events.add(LocalEvent.ChatCursorToggle, (fc: boolean, v: boolean) => this.ToggleCharCursor(fc, v));
  }

  private ToggleCharCursor(freezeControls: boolean, visible: boolean): void {
    mp.gui.cursor.show(freezeControls, visible);
  }
};

mp.gui.chat.activate(false);
mp.gui.chat.show(false);

let chat: Chat | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => chat = chat ? chat : new Chat());