import { Observable, of } from 'rxjs';
import { filter, mergeMap, toArray } from 'rxjs/operators';

class BlipProvider {
  public GetAll(): Observable<BlipMp[]> {
    return of(mp.blips.toArray());
  }

  public GetServerHouses(): Observable<BlipMp[]> {
    return this.GetAll()
      .pipe(
        mergeMap(b => b),
        filter(b => b.hasVariable('DummyEntity') && b.getVariable('DummyEntity') === 'House'),
        toArray());
  }

  public GetServerHouse(id: number): Observable<BlipMp> {
    return this.GetAll()
      .pipe(
        mergeMap(b => b),
        filter(b => b.hasVariable('DummyEntity') && b.getVariable('DummyEntity') === 'House'),
        filter(b => b.hasVariable('Id') && b.getVariable('Id') === id));
  }

  public GetServerGasStations(): Observable<BlipMp[]> {
    return this.GetAll()
      .pipe(
        mergeMap(b => b),
        filter(b => b.hasVariable('DummyEntity') && b.getVariable('DummyEntity') === 'GasStation'),
        toArray());
  }
}

export let GlobalBlipProvider: BlipProvider;
mp.events.add(RageEnums.EventKey.PLAYER_READY, () => GlobalBlipProvider = GlobalBlipProvider ? GlobalBlipProvider : new BlipProvider());