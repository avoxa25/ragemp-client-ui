import { LocalEvents } from '../Constants/localEvents';

abstract class Chat {
  private static hidden: boolean;

  private static messages: string[];
  private static messagesDiv: HTMLElement;

  private static messageForm: HTMLFormElement;
  private static messageFormHidden: boolean;

  public static Start() {
    Chat.hidden = false;
    Chat.messages = [];
    Chat.messageFormHidden = true;

    // To prevent player control freeze/cursor visibility interruption from system menus
    setInterval(() => Chat.sendChatToggleEvent(), 250);

    mp.events.add('chat:push', (message: string) => Chat.displayMessage(message));
    mp.events.add('chat:activate', (visible: boolean) => Chat.toggleChat(visible));
    mp.events.add('chat:show', () => Chat.toggleMessageInput());

    Chat.messagesDiv = document.getElementById('messagesDiv') as HTMLElement;

    Chat.messageForm = document.querySelector('form') as HTMLFormElement;
    Chat.messageForm.hidden = Chat.messageFormHidden;
    Chat.messageForm.addEventListener('submit', (e) => Chat.onNewMessageFormSubmit(e));

    document.body.addEventListener('keydown', (e) => Chat.onKeydown(e));
  }

  private static displayMessage(message: string): void {
    Chat.messages.push(message);

    const messageElement = document.createElement('p');
    messageElement.innerHTML = message;
    Chat.messagesDiv.appendChild(messageElement);
  }

  private static toggleChat(visible: boolean): void {
    Chat.hidden = !visible;
    document.body.hidden = Chat.hidden;
  }

  private static toggleMessageInput(): void {
    Chat.messageFormHidden = !Chat.messageFormHidden;

    Chat.messageForm.reset();
    Chat.messageForm.hidden = Chat.messageFormHidden;

    if (!Chat.messageForm.hidden) {
      const messageInput = document.querySelector('input[type=text]') as HTMLInputElement;
      messageInput.focus();
    }

    setTimeout(() => mp.events.call(LocalEvents.ChatCursorToggle, Chat.messageFormHidden), 250);
  }

  private static onKeydown(event: KeyboardEvent): void {
    const isToggleChatKey = event.which === 84;
    const isEscapeKey = event.which === 27;

    const newMessageFormData = new FormData(Chat.messageForm);
    const message = newMessageFormData.get('message') as string;
    const isNewMessageEmpty = message.length === 0;

    const isChatToggleEvent = isToggleChatKey && isNewMessageEmpty;
    const isChatForceCloseEvent = !Chat.messageFormHidden && isEscapeKey;
    if (isChatToggleEvent || isChatForceCloseEvent) {
      event.preventDefault();
      Chat.toggleMessageInput();
      return;
    }
  }

  private static sendChatToggleEvent(): void {
    mp.events.call(LocalEvents.ChatCursorToggle, Chat.messageFormHidden);
  }

  private static onNewMessageFormSubmit(event: Event): void {
    event.preventDefault();

    const newMessageFormData = new FormData(Chat.messageForm);

    const message = newMessageFormData.get('message') as string;
    const channel = newMessageFormData.get('channel') as string;

    setTimeout(() => mp.events.call(LocalEvents.ChatMessageSend, message, channel), 250);

    Chat.toggleMessageInput();
  }
}

Chat.Start();