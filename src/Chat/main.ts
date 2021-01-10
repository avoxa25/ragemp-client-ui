import { LocalEvents } from '../Constants/localEvents';
import { RemoteEvents } from '../Constants/remoteEvents';

mp.gui.chat.show(false);

mp.events.add(LocalEvents.ChatCursorToggle, (hidden: boolean) => mp.gui.cursor.show(!hidden, !hidden));
mp.events.add(LocalEvents.ChatMessageSend, (message: string, channel: string) => mp.events.callRemote(RemoteEvents.ChatMessage, message, channel));

const chat = mp.browsers.new('package://Chat/chat.html');
chat.markAsChat();