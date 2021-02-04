import { Observable, of } from 'rxjs';
import { filter, mergeMap, toArray } from 'rxjs/operators';

export class MarkerProvider {
  public GetAll(): Observable<MarkerMp[]> {
    return of(mp.markers.toArray());
  }

  public GetServerHouses(): Observable<MarkerMp[]> {
    return this.GetAll()
      .pipe(
        mergeMap(m => m),
        filter(m => (m as any).hasVariable('DummyEntity') && m.getVariable('DummyEntity') === 'House'),
        toArray());
  }

  public GetServerHouse(id: number): Observable<MarkerMp> {
    return this.GetAll()
      .pipe(
        mergeMap(m => m),
        filter(m => (m as any).hasVariable('DummyEntity') && m.getVariable('DummyEntity') === 'House'),
        filter(m => (m as any).hasVariable('Id') && m.getVariable('Id') === id));
  }

  public GetServerGasStations(): Observable<MarkerMp[]> {
    return this.GetAll()
      .pipe(
        mergeMap(m => m),
        filter(m => (m as any).hasVariable('DummyEntity') && m.getVariable('DummyEntity') === 'GasStation'),
        toArray());
  }

  public GetServerGasPumps(): Observable<MarkerMp[]> {
    return this.GetAll()
      .pipe(
        mergeMap(m => m),
        filter(m => (m as any).hasVariable('DummyEntity') && m.getVariable('DummyEntity') === 'GasPump'),
        toArray());
  }
}

export let GlobalMarkerProvider: MarkerProvider;
mp.events.add(RageEnums.EventKey.PLAYER_READY, () => GlobalMarkerProvider = GlobalMarkerProvider ? GlobalMarkerProvider : new MarkerProvider());