export class Settings {
  public notify: boolean;
  public textChat: boolean;
  public voiceChat: boolean;

  constructor() {
    this.notify = true;
    this.textChat = true;
    this.voiceChat = true;
  }
}