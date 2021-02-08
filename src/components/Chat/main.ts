import { RemoteResponse } from '../../constants/events/remote-response';

class Chat {
  constructor() {
    const chat = mp.browsers.new('package://components/Chat/chat.html');
    chat.markAsChat();
  }
};

mp.gui.chat.activate(false);
mp.gui.chat.show(false);

let chat: Chat | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => chat = chat ? chat : new Chat());