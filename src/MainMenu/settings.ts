export class Settings {
  public notificationsHidden: boolean;
  public textChatHidden: boolean;
  public voiceChatMuted: boolean;

  constructor() {
    this.notificationsHidden = true;
    this.textChatHidden = true;
    this.voiceChatMuted = true;
  }
}