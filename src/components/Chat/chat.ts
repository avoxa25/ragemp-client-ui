import { LocalEvent } from '../../constants/events/local-event';
import { SpecificLocalEvent } from '../../constants/events/specific-local-event';

class ChatUi {
  private readonly messagesDiv: HTMLElement;
  private readonly messageForm: HTMLFormElement;
  private readonly sendedMessages: string[];
  private readonly newMessageInput: HTMLInputElement;

  private messages: string[];
  private selectedSendedMessage: number | undefined;
  private cursorSetIntervalId: number | undefined;

  constructor() {
    this.messagesDiv = document.querySelector('#messagesDiv') as HTMLElement;
    this.messageForm = document.querySelector('form') as HTMLFormElement;

    this.messages = [];
    this.sendedMessages = [];

    this.newMessageInput = document.querySelector('input[type=text]') as HTMLInputElement;

    mp.events.add(SpecificLocalEvent.ChatPush, (m: string) => this.DisplayMessage(m));
    mp.events.add(SpecificLocalEvent.ChatClear, () => this.ClearChat());
    mp.events.add(SpecificLocalEvent.ChatActivate, (v: boolean) => this.ToggleChat(v));
    mp.events.add(SpecificLocalEvent.ChatShow, (v: boolean) => this.ToggleMessageInput(v));

    document.body.addEventListener('keydown', (e) => this.OnDocumentBodyKeydown(e));
    this.messageForm.addEventListener('submit', () => this.OnNewMessageFormSubmit());
    this.newMessageInput.addEventListener('keydown', (e) => this.OnNewMessageInputKeydown(e));
  }

  private DisplayMessage(message: string): void {
    this.messages.push(message);

    const messageElement = document.createElement('p');
    messageElement.innerHTML = message;
    this.messagesDiv.appendChild(messageElement);
    this.messagesDiv.scrollTo(0, Number.MAX_SAFE_INTEGER);
  }

  private ClearChat(): void {
    this.messages = [];
    this.messagesDiv.innerHTML = '';
  }

  private ToggleChat(visible: boolean): void {
    document.body.hidden = visible;
  }

  private ToggleMessageInput(visible: boolean): void {
    if (this.messageForm.hidden === !visible) return;

    this.messageForm.hidden = !visible;
    this.messageForm.reset();

    if (visible) {
      this.newMessageInput.focus();
      this.cursorSetIntervalId = setInterval(() => mp.events.call(LocalEvent.ChatCursorToggle, visible, visible), 250);
    } else {
      clearInterval(this.cursorSetIntervalId);
      mp.events.call(LocalEvent.ChatCursorToggle, visible, visible);
    }
  }

  private OnNewMessageFormSubmit(): void {
    const newMessageFormData = new FormData(this.messageForm);
    const message = newMessageFormData.get('message') as string;

    if (message.length > 0) {
      const isCommand = message.charAt(0) === '/';
      if (isCommand) {
        const commandMessage = message.substr(1);
        (mp as any).invoke('command', commandMessage);
      } else {
        (mp as any).invoke('chatMessage', message);
      }

      this.sendedMessages.push(message);
      this.selectedSendedMessage = undefined;
    }

    this.ToggleMessageInput(false);
  }

  private OnDocumentBodyKeydown(event: KeyboardEvent): void {
    const isChatClosed = this.messageForm.hidden;
    const isChatOpenKey = event.which === 84;
    if (isChatClosed && isChatOpenKey) {
      event.preventDefault();
      this.ToggleMessageInput(true);
    }
  }

  private OnNewMessageInputKeydown(event: KeyboardEvent): void {
    // TODO: Implement message cycling
    const isArrowUpKey = event.which === 38;
    const isArrowDownKey = event.which === 40;

    if (isArrowUpKey || isArrowDownKey) {
      this.CyclePreviousSendedMessages(isArrowDownKey);
    }
  }

  private CyclePreviousSendedMessages(backward: boolean = true): void {
    if (this.selectedSendedMessage === undefined) {
      this.selectedSendedMessage = this.sendedMessages.length;
    }

    const noSendedMessages = this.selectedSendedMessage === 0;
    if (noSendedMessages) return;

    if (backward) {
      const isLastMessage = this.selectedSendedMessage === 0;
      if (isLastMessage) return;
      this.selectedSendedMessage--;
    } else {
      this.selectedSendedMessage++;
    }

    const message = this.sendedMessages[this.selectedSendedMessage];
    const newMessageFormData = new FormData(this.messageForm);
    newMessageFormData.set('message', message);
  }
}

(window as any).chatUi = new ChatUi();