import { KeyboardKeys } from '../../Constants/keyboard-keys';
import { RemoteResponse } from '../../Constants/remote-response';

class DateTimeMicrophone {
  private browser: BrowserMp;
  public constructor() {
    this.browser = mp.browsers.new('package://HUD/DateTimeMicrophone/date-time-microphone.html');

    mp.keys.bind(KeyboardKeys.KeyN, true, this.EnableMicrophone);
    mp.keys.bind(KeyboardKeys.KeyN, false, this.DisableMicrophone);
  }

  // TODO: Realize voice chat

  private EnableMicrophone(): void {
    this.browser.execute(`window.dateTimeMicrophoneUi.ToggleMicrophone(${true});`);
  }

  private DisableMicrophone(): void {
    this.browser.execute(`window.dateTimeMicrophoneUi.ToggleMicrophone(${false});`);
  }
};

let dateTimeMicrophone: DateTimeMicrophone | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => dateTimeMicrophone = dateTimeMicrophone ? dateTimeMicrophone : new DateTimeMicrophone());