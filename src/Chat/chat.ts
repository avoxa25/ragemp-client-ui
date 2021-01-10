abstract class Chat {
  private static hidden: boolean;

  private static messages: string[];

  private static messagesDiv: HTMLElement;
  private static newMessageForm: HTMLFormElement;

  public static Start() {
    Chat.hidden = true;
    Chat.messages = [];

    // To prevent player control freeze/cursor visibility interruption from system menus
    setInterval(() => Chat.sendChatToggleEvent(), 250);

    //mp.events.add(ServerEvents.PlayerChat, (m: string) => Chat.onPlayerChat(m));

    Chat.messagesDiv = document.getElementById('messagesDiv') as HTMLElement;

    Chat.newMessageForm = document.querySelector('form') as HTMLFormElement;
    Chat.newMessageForm.hidden = Chat.hidden;
    Chat.newMessageForm.addEventListener('submit', () => Chat.onNewMessageFormSubmit());

    document.body.addEventListener('keydown', (e: KeyboardEvent) => Chat.onKeydown(e));
  }

  private static onPlayerChat(message: string): void {
    Chat.messages.push(message);
    //mp.events.callRemote('ChatMessage', message);

    let messageElement = document.createElement('p');
    messageElement.innerText = message;
    Chat.messagesDiv.appendChild(messageElement);
  }

  private static onKeydown(event: KeyboardEvent): void {
    let testNode = document.createElement('p');
    testNode.innerText = `${event.key} | ${event.which} | ${event.code}`;
    Chat.messagesDiv.appendChild(testNode);

    let isToggleChatKey = event.which === 84;
    let isEscapeKey = event.which === 27;

    let newMessageFormData = new FormData(Chat.newMessageForm);
    let message = newMessageFormData.get('message') as string;
    let isNewMessageEmpty = message.length === 0;

    let isChatToggleEvent = isToggleChatKey && isNewMessageEmpty;
    let isChatForceCloseEvent = !Chat.hidden && isEscapeKey;
    if (isChatToggleEvent || isChatForceCloseEvent) {
      Chat.toggleChat();
      return;
    }
  }

  private static toggleChat(): void {
    Chat.hidden = !Chat.hidden;

    Chat.newMessageForm.reset();
    Chat.newMessageForm.hidden = Chat.hidden;

    if (!Chat.newMessageForm.hidden) {
      const messageInput = document.querySelector('input[type=text]') as HTMLInputElement;
      messageInput.focus();
    }

    //mp.events.call(LocalEvents.ChatCursorToggle, Chat.hidden);
  }

  private static sendChatToggleEvent(): void {
    //mp.events.call(LocalEvents.ChatCursorToggle, Chat.hidden);
  }

  private static onNewMessageFormSubmit(): void {
    let newMessageFormData = new FormData(Chat.newMessageForm);

    let message = newMessageFormData.get('message') as string;
    let channel = newMessageFormData.get('channel') as string;
    message == channel;

    //mp.events.callRemote(RemoveEvents.ChatMessage, message, channel);

    Chat.newMessageForm.reset();

    Chat.toggleChat();
  }
}

Chat.Start();