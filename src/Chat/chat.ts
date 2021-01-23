import { KeyboardKeys } from '../Constants/keyboard-keys';
import { LocalEvents } from '../Constants/local-events';
import { SpecificLocalEvents } from '../Constants/specific-local-events';

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

    mp.events.add(SpecificLocalEvents.ChatPush, (message: string) => this.DisplayMessage(message));
    mp.events.add(SpecificLocalEvents.ChatClear, () => this.ClearChat());
    mp.events.add(SpecificLocalEvents.ChatActivate, (visible: boolean) => this.ToggleChat(visible));
    mp.events.add(SpecificLocalEvents.ChatShow, () => this.ToggleMessageInput());

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

  private ToggleMessageInput(): void {
    this.messageForm.hidden = !this.messageForm.hidden;

    this.messageForm.reset();

    if (this.messageForm.hidden) {
      clearInterval(this.cursorSetIntervalId);
    } else {
      this.newMessageInput.focus();
      this.cursorSetIntervalId = setInterval(() => mp.events.call(LocalEvents.ChatCursorToggle, true, true), 250);
    }

    mp.events.call(LocalEvents.ChatCursorToggle, !this.messageForm.hidden, !this.messageForm.hidden);
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

    this.ToggleMessageInput();
  }

  private OnDocumentBodyKeydown(event: KeyboardEvent): void {
    const isChatClosed = this.messageForm.hidden;
    const isChatOpenKey = event.which === KeyboardKeys.T;
    if (isChatClosed && isChatOpenKey) {
      event.preventDefault();
      this.ToggleMessageInput();
    }
  }

  private OnNewMessageInputKeydown(event: KeyboardEvent): void {
    // TODO: Implement message cycling
    mp.console.logInfo(`onNewMessageInputKeydown: ${event.which}`);

    const isArrowUpKey = event.which === KeyboardKeys.ArrowUp;
    const isArrowDownKey = event.which === KeyboardKeys.ArrowDown;

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