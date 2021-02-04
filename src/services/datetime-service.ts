import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { DummyEntityConstants } from '../constants/dummy-entity';

class DateTimeService {
  private readonly worldTimeDummyEntity: DummyEntityMp;
  private readonly multiplier: number;
  private readonly serverBaseUtcOffsetInMinutes: number;

  constructor() {
    this.worldTimeDummyEntity = mp.dummies.toArray().find(d => d.id === DummyEntityConstants.WorldTimeId) as DummyEntityMp;
    this.multiplier = this.worldTimeDummyEntity.getVariable('Multiplier') as number;
    this.serverBaseUtcOffsetInMinutes = this.worldTimeDummyEntity.getVariable('BaseUtcOffset') as number;
  }

  public GetMultiplier(): number {
    return this.multiplier;
  }

  public GetInGame(): Observable<Date> {
    const oneInGameMinuteInMillis = (1 / this.multiplier) * 60 * 1000;
    return interval(oneInGameMinuteInMillis)
      .pipe(
        map(() => this.worldTimeDummyEntity.getVariable('DateTime') as string),
        map(s => new Date(s)));
  }

  public GetServer(): Observable<Date> {
    const oneMinuteInMillis = 60 * 1000;
    return interval(oneMinuteInMillis)
      .pipe(
        map(() => {
          const clientDateTime = new Date();
          const clientUnixTime = clientDateTime.getTime();
          const utcOffsetInMinutes = clientDateTime.getTimezoneOffset();
          const serverOffsetInMinutes = this.serverBaseUtcOffsetInMinutes - utcOffsetInMinutes;
          const utcUnixTime = clientUnixTime - serverOffsetInMinutes * 60 * 1000;
          clientDateTime.setTime(utcUnixTime);

          return clientDateTime;
        }));
  }
}

export let GlobalDateTimeService: DateTimeService;
mp.events.add(RageEnums.EventKey.PLAYER_READY, () => GlobalDateTimeService = GlobalDateTimeService ? GlobalDateTimeService : new DateTimeService());