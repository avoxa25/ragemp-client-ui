abstract class Chat {
  private static hidden: boolean;
  private static messages: string[];

  private static messagesDiv: HTMLElement;
  private static newMessageForm: HTMLFormElement;

  public static Start() {
    Chat.hidden = true;
    Chat.messages = [];

    mp.events.add('playerChat', (m: string) => Chat.onPlayerChat(m));

    Chat.messagesDiv = document.getElementById('messagesDiv') as HTMLElement;

    Chat.newMessageForm = document.querySelector('form') as HTMLFormElement;
    Chat.newMessageForm.hidden = Chat.hidden;
    Chat.newMessageForm.addEventListener('submit', (e: Event) => Chat.onNewMessageFormSubmit(e));

    document.body.addEventListener('keydown', (e: KeyboardEvent) => Chat.onKeydown(e));

    // To prevent player control freeze/cursor visibility interruption from system menus
    setTimeout(() => mp.events.call('ToggleChat', Chat.hidden), 1000);
  }

  private static onPlayerChat(message: string): void {
    Chat.messages.push(message);

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
      Chat.newMessageForm.focus();
    }
  }

  private static onNewMessageFormSubmit(event: Event): void {
    let newMessageFormData = new FormData(Chat.newMessageForm);

    let message = newMessageFormData.get('message') as string;
    let channel = newMessageFormData.get('channel') as string;

    mp.game.invoke('ChatMessage', message, channel);

    Chat.newMessageForm.reset();

    Chat.toggleChat();
    event.preventDefault();
  }
}

Chat.Start();