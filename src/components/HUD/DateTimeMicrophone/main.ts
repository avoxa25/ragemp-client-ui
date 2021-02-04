import { KeyboardKeys } from '../../../constants/enums/keyboard-keys';
import { RemoteResponse } from '../../../constants/events/remote-response';
import { DateTimeService } from '../../../services/datetime-service';

class DateTimeMicrophone {
  private readonly browser: BrowserMp;
  private readonly dateTimeService: DateTimeService;

  public constructor() {
    this.browser = mp.browsers.new('package://components/HUD/DateTimeMicrophone/date-time-microphone.html');
    this.dateTimeService = new DateTimeService();

    mp.keys.bind(KeyboardKeys.KeyN, true, () => this.EnableMicrophone());
    mp.keys.bind(KeyboardKeys.KeyN, false, () => this.DisableMicrophone());

    this.dateTimeService.GetInGame()
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