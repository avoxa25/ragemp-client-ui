import { Observable, of } from 'rxjs';
import { filter, mergeMap, toArray } from 'rxjs/operators';

export class ColShapeProvider {
  public GetAll(): Observable<ColshapeMp[]> {
    return of(mp.colshapes.toArray());
  }

  public GetServerHouses(): Observable<ColshapeMp[]> {
    return this.GetAll()
      .pipe(
        mergeMap(cs => cs),
        filter(cs => (cs as any).hasVariable('DummyEntity') && cs.getVariable('DummyEntity') === 'House'),
        toArray());
  }

  public GetServerHouse(id: number): Observable<ColshapeMp> {
    return this.GetServerHouses()
      .pipe(
        mergeMap(cs => cs),
        filter(cs => (cs as any).hasVariable('Id') && cs.getVariable('Id') === id));
  }

  public GetServerGasStations(): Observable<ColshapeMp[]> {
    return this.GetAll()
      .pipe(
        mergeMap(cs => cs),
        filter(cs => (cs as any).hasVariable('DummyEntity') && cs.getVariable('DummyEntity') === 'GasStation'),
        toArray());
  }

  public GetServerGasStation(id: number): Observable<ColshapeMp> {
    return this.GetServerGasStations()
      .pipe(
        mergeMap(cs => cs),
        filter(cs => (cs as any).hasVariable('Id') && cs.getVariable('Id') === id));
  }

  public GetServerGasPumps(): Observable<ColshapeMp[]> {
    return this.GetAll()
      .pipe(
        mergeMap(cs => cs),
        filter(cs => (cs as any).hasVariable('DummyEntity') && cs.getVariable('DummyEntity') === 'GasPump'),
        toArray());
  }
}