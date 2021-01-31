import { KeyboardKeys } from '../../../models/enums/keyboard-keys';
import { RemoteResponse } from '../../../models/enums/events/remote-response';
import { DummyEntitiesConstants } from '../../../constants/dummy-entities.constants';

class DateTimeMicrophone {
  private readonly browser: BrowserMp;
  private readonly worldTimeDummyEntity: DummyEntityMp;

  public constructor() {
    this.browser = mp.browsers.new('package://HUD/DateTimeMicrophone/date-time-microphone.html');
    this.worldTimeDummyEntity = mp.dummies.toArray().find(d => d.id === DummyEntitiesConstants.WorldTimeId) as DummyEntityMp;

    mp.keys.bind(KeyboardKeys.KeyN, true, () => this.EnableMicrophone());
    mp.keys.bind(KeyboardKeys.KeyN, false, () => this.DisableMicrophone());

    const multiplier = this.worldTimeDummyEntity.getVariable('Multiplier') as number;
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
    const rawDateTime = this.worldTimeDummyEntity.getVariable('DateTime') as string;
    this.browser.execute(`window.dateTimeMicrophoneUi.SetDateTime('${rawDateTime}');`);
  }
};

let dateTimeMicrophone: DateTimeMicrophone | undefined;
mp.events.add(RemoteResponse.CharacterSpawnSelected, () => dateTimeMicrophone = dateTimeMicrophone ? dateTimeMicrophone : new DateTimeMicrophone());