import { Observable, zip } from 'rxjs';
import { filter, map, mergeMap, tap, toArray } from 'rxjs/operators';
import { HouseType } from '../../models/houses/house-type';
import { House } from '../../models/houses/house';
import { GlobalBlipProvider } from './blip-provider';
import { GlobalColShapeProvider } from './colshape-provider';
import { GlobalMarkerProvider } from './marker-provider';

export class HouseProvider {
  public GetAll(): Observable<House[]> {
    return zip(
      GlobalBlipProvider.GetServerHouses(),
      GlobalColShapeProvider.GetServerHouses(),
      GlobalMarkerProvider.GetServerHouses())
      .pipe(
        map(z => ({ blips: z[0], colShapes: z[1], markers: z[2] })),
        map(z => this.CreateHouseTuples(z)),
        mergeMap(t => t),
        filter(t => t !== undefined),
        map(t => ({ blip: t!.blip, colShape: t!.colShape, marker: t!.marker, house: this.CreateEmpty() })),
        tap(t => {
          this.UpdateFromBlip(t.blip, t.house);
          this.UpdateFromColShape(t.colShape, t.house);
          this.UpdateFromMarker(t.marker, t.house);
        }),
        map(t => t.house),
        toArray());
  }

  public Get(id: number): Observable<House> {
    return zip(
      GlobalBlipProvider.GetServerHouse(id),
      GlobalColShapeProvider.GetServerHouse(id),
      GlobalMarkerProvider.GetServerHouse(id))
      .pipe(
        map(z => ({ blip: z[0], colShape: z[1], marker: z[2], house: this.CreateEmpty() })),
        tap(t => {
          this.UpdateFromBlip(t.blip, t.house);
          this.UpdateFromColShape(t.colShape, t.house);
          this.UpdateFromMarker(t.marker, t.house);
        }),
        map(t => t.house));
  }

  private CreateHouseTuples(zip: { blips: BlipMp[], colShapes: ColshapeMp[], markers: MarkerMp[] }): ({ blip: BlipMp, colShape: ColshapeMp, marker: MarkerMp, } | undefined)[] {
    return zip.blips
      .map(b => {
        const blipId = b.getVariable('Id') as number;
        const colShape = zip.colShapes
          .filter(cs => cs.dimension !== 0)
          .find(cs => cs.getVariable('Id') === blipId);
        const marker = zip.markers.find(m => m.getVariable('Id') === blipId);
        if (!colShape || !marker) return undefined;

        return { blip: b, colShape: colShape, marker: marker };
      });
  }

  private CreateEmpty(): House {
    return {
      id: undefined!,
      ownerId: undefined!,
      name: undefined!,
      type: undefined!,
      garageCapacity: undefined!,
      locked: undefined!,
      onSale: undefined!,
      originalPrice: undefined!,
      onSalePrice: undefined!,
      entrancePosition: undefined!,
      exitPosition: undefined!
    };
  }

  private UpdateFromBlip(blip: BlipMp, house: House): void {
    const id = blip.getVariable('Id') as number;
    house.id = id;

    const ownerId = blip.getVariable('OwnerId') as number | null;
    house.ownerId = ownerId;

    const onSale = blip.getVariable('OnSale') as boolean;
    house.onSale = onSale;

    const entrancePosition = blip.getCoords();
    house.entrancePosition = entrancePosition;
  }

  public UpdateFromColShape(colShape: ColshapeMp, house: House): void {
    const type = colShape.getVariable('Type') as HouseType;
    house.type = type;

    const locked = colShape.getVariable('Locked') as boolean;
    house.locked = locked;

    const garageCapacity = colShape.getVariable('GarageCapacity') as number;
    house.garageCapacity = garageCapacity;

    const originalPrice = colShape.getVariable('OriginalPrice') as number;
    house.originalPrice = originalPrice;

    const onSalePrice = colShape.getVariable('OnSalePrice') as number;
    house.onSalePrice = onSalePrice;
  }

  public UpdateFromMarker(marker: MarkerMp, house: House): void {   
    house.exitPosition = marker.position;
  }
}

export let GlobalHouseProvider: HouseProvider;
mp.events.add(RageEnums.EventKey.PLAYER_READY, () => GlobalHouseProvider = GlobalHouseProvider ? GlobalHouseProvider : new HouseProvider());