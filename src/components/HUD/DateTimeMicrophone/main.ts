import { KeyboardKeys } from '../../../models/enums/keyboard-keys.enum';
import { RemoteResponse } from '../../../models/enums/events/remote-response.enum';
import { DateTimeService } from '../../../services/datetime-service';

class DateTimeMicrophone {
  private readonly browser: BrowserMp;
  private readonly inGameDateTime: Date;

  public constructor() {
    this.browser = mp.browsers.new('package://components/HUD/DateTimeMicrophone/date-time-microphone.html');

    mp.keys.bind(KeyboardKeys.KeyN, true, () => this.EnableMicrophone());
    mp.keys.bind(KeyboardKeys.KeyN, false, () => this.DisableMicrophone());

    this.inGameDateTime = DateTimeService.GetInGameDateTime();

    const multiplier = DateTimeService.GetMultiplier();
    const updateIntervalInMillis = (1 / multiplier) * 60 * 1000;
    setInterval(() => this.UpdateDateTime(), updateIntervalInMillis);
  }

  private EnableMicrophone(): void {
    // TODO: Implement voice chat
    this.browser.execute(`window.dateTimeMicrophoneUi.ToggleMicrophone(${true});`);
  }

  private DisableMicrophone(): void {
    // TODO: Implement voice chat
    this.browser.execute(`window.dateTimeMicrophoneUi.ToggleMicrophone(${false});`);
  }

  private UpdateDateTime(): void {
    const rawDateTime = this.inGameDateTime.toISOString();
    this.browser.execute(`window.dateTimeMicrophoneUi.SetDateTime('${rawDateTime}');`);
  }
}

let dateTimeMicrophone: DateTimeMicrophone | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => dateTimeMicrophone = dateTimeMicrophone ? dateTimeMicrophone : new DateTimeMicrophone());