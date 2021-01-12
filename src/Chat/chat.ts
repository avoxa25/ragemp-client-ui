import { LocalEvents } from '../Constants/localEvents';
import { SpecificLocalEvents } from '../Constants/specificLocalEvents';

abstract class ChatUi {
  private static hidden: boolean;

  private static messages: string[];
  private static messagesDiv: HTMLElement;

  private static messageForm: HTMLFormElement;
  private static messageFormHidden: boolean;

  public static Start() {
    ChatUi.hidden = false;
    ChatUi.messages = [];
    ChatUi.messageFormHidden = true;

    // To prevent player control freeze/cursor visibility interruption from system menus
    setInterval(() => ChatUi.sendChatToggleEvent(), 250);

    mp.events.add(SpecificLocalEvents.ChatPush, (message: string) => ChatUi.displayMessage(message));
    mp.events.add(SpecificLocalEvents.ChatClear, () => ChatUi.clearChat());
    mp.events.add(SpecificLocalEvents.ChatActivate, (visible: boolean) => ChatUi.toggleChat(visible));
    mp.events.add(SpecificLocalEvents.ChatShow, () => ChatUi.toggleMessageInput());

    ChatUi.messagesDiv = document.getElementById('messagesDiv') as HTMLElement;

    ChatUi.messageForm = document.querySelector('form') as HTMLFormElement;
    ChatUi.messageForm.hidden = ChatUi.messageFormHidden;
    ChatUi.messageForm.addEventListener('submit', (e) => ChatUi.onNewMessageFormSubmit(e));

    document.body.addEventListener('keydown', (e) => ChatUi.onKeydown(e));
  }

  private static displayMessage(message: string): void {
    ChatUi.messages.push(message);

    const messageElement = document.createElement('p');
    messageElement.innerHTML = message;
    ChatUi.messagesDiv.appendChild(messageElement);
  }

  private static clearChat(): void {
    ChatUi.messages = [];
    ChatUi.messagesDiv.innerHTML = '';
  }

  private static toggleChat(visible: boolean): void {
    ChatUi.hidden = !visible;
    document.body.hidden = ChatUi.hidden;
  }

  private static toggleMessageInput(): void {
    ChatUi.messageFormHidden = !ChatUi.messageFormHidden;

    ChatUi.messageForm.reset();
    ChatUi.messageForm.hidden = ChatUi.messageFormHidden;

    if (!ChatUi.messageForm.hidden) {
      const messageInput = document.querySelector('input[type=text]') as HTMLInputElement;
      messageInput.focus();
    }

    setTimeout(() => mp.events.call(LocalEvents.ChatCursorToggle, ChatUi.messageFormHidden), 250);
  }

  private static onKeydown(event: KeyboardEvent): void {
    const isToggleChatKey = event.which === 84;
    const isEscapeKey = event.which === 27;

    const newMessageFormData = new FormData(ChatUi.messageForm);
    const message = newMessageFormData.get('message') as string;
    const isNewMessageEmpty = message.length === 0;

    const isChatToggleEvent = isToggleChatKey && isNewMessageEmpty;
    const isChatForceCloseEvent = !ChatUi.messageFormHidden && isEscapeKey;
    if (isChatToggleEvent || isChatForceCloseEvent) {
      event.preventDefault();
      ChatUi.toggleMessageInput();
      return;
    }
  }

  private static sendChatToggleEvent(): void {
    mp.events.call(LocalEvents.ChatCursorToggle, ChatUi.messageFormHidden);
  }

  private static onNewMessageFormSubmit(event: Event): void {
    event.preventDefault();

    const newMessageFormData = new FormData(ChatUi.messageForm);

    const message = newMessageFormData.get('message') as string;
    const channel = newMessageFormData.get('channel') as string;

    setTimeout(() => mp.events.call(LocalEvents.ChatSendMessage, message, channel), 250);

    ChatUi.toggleMessageInput();
  }
}

ChatUi.Start();