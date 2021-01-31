import { RemoteResponse } from '../models/enums/events/remote-response.enum';
import { DummyEntityConstants } from '../constants/dummy-entity';

export abstract class DateTimeService {
  private static worldTimeDummyEntity: DummyEntityMp;

  private static multiplier: number;
  private static serverBaseUtcOffsetInMinutes: number;

  private static inGameDateTime: Date;
  private static serverDateTime: Date;

  public static Start(): void {
    DateTimeService.worldTimeDummyEntity = mp.dummies.toArray().find(d => d.id === DummyEntityConstants.WorldTimeId) as DummyEntityMp;

    const multiplier = DateTimeService.worldTimeDummyEntity.getVariable('Multiplier') as number;
    DateTimeService.multiplier = multiplier;

    DateTimeService.inGameDateTime = new Date();
    DateTimeService.serverDateTime = new Date();

    const updateInGameDateTimeIntervalInMillis = (1 / DateTimeService.multiplier) * 60 * 1000;
    setInterval(() => this.UpdateInGameDateTime(), updateInGameDateTimeIntervalInMillis);

    const serverBaseUtcOffsetInMinutes = DateTimeService.worldTimeDummyEntity.getVariable('BaseUtcOffset') as number;
    DateTimeService.serverBaseUtcOffsetInMinutes = serverBaseUtcOffsetInMinutes;

    setTimeout(() => this.UpdateServerDateTime(), 60 * 1000);
  }

  public static GetMultiplier(): number {
    return DateTimeService.multiplier;
  }

  public static GetInGameDateTime(): Date {
    return DateTimeService.inGameDateTime;
  }

  public static GetServerDateTime(): Date {
    return DateTimeService.serverDateTime;
  }

  private static UpdateInGameDateTime(): void {
    const rawInGameDateTime = DateTimeService.worldTimeDummyEntity.getVariable('DateTime') as string;
    const inGameDateTime = new Date(rawInGameDateTime);
    const inGameUnixTime = inGameDateTime.getTime();

    DateTimeService.inGameDateTime.setTime(inGameUnixTime);
  }

  private static UpdateServerDateTime(): void {
    const clientDateTime = new Date();
    const clientUnixTime = clientDateTime.getTime();

    const utcOffsetInMinutes = clientDateTime.getTimezoneOffset();
    const utcUnixTime = clientUnixTime - utcOffsetInMinutes * 60 * 1000;

    const serverUnixTime = utcUnixTime + DateTimeService.serverBaseUtcOffsetInMinutes * 60 * 1000;
    DateTimeService.serverDateTime.setTime(serverUnixTime);
  }
}

mp.events.add(RemoteResponse.LoginAllowed, () => DateTimeService.Start());