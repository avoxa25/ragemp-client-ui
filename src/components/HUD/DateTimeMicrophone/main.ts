import { RemoteResponse } from '../../../constants/events/remote-response';
import { KeyboardKeys } from '../../../constants/enums/keyboard-keys';
import { GlobalDateTimeService } from '../../../services/datetime-service';

class DateTimeMicrophone {
  private readonly browser: BrowserMp;

  public constructor() {
    this.browser = mp.browsers.new('package://components/HUD/DateTimeMicrophone/date-time-microphone.html');

    mp.keys.bind(KeyboardKeys.KeyN, true, () => this.EnableMicrophone());
    mp.keys.bind(KeyboardKeys.KeyN, false, () => this.DisableMicrophone());

    GlobalDateTimeService.GetInGame()
      .subscribe(d => this.UpdateDateTime(d));
  }

  private EnableMicrophone(): void {
    // TODO: Implement voice chat
    this.browser.execute(`window.dateTimeMicrophoneUi.ToggleMicrophone(${true});`);
  }

  private DisableMicrophone(): void {
    // TODO: Implement voice chat
    this.browser.execute(`window.dateTimeMicrophoneUi.ToggleMicrophone(${false});`);
  }

  private UpdateDateTime(dateTime: Date): void {
    const rawDateTime = dateTime.toISOString();
    this.browser.execute(`window.dateTimeMicrophoneUi.SetDateTime('${rawDateTime}');`);
  }
}

let dateTimeMicrophone: DateTimeMicrophone | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => dateTimeMicrophone = dateTimeMicrophone ? dateTimeMicrophone : new DateTimeMicrophone());