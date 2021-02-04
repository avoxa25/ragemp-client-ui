import { merge, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { GasStation } from 'src/models/gas-station';
import { ColShapeProvider } from './colshape-provider';

export class GasStationProvider {
  private readonly colShapeProvider: ColShapeProvider;

  constructor() {
    this.colShapeProvider = new ColShapeProvider();
  }

  public GetAll(): Observable<GasStation[]> {
    return this.colShapeProvider.GetServerGasStations()
      .pipe(
        mergeMap(cs => cs),
        map(cs => this.ParseFromColShape(cs)),
        toArray());
  }

  public Get(id: number): Observable<GasStation> {
    return this.colShapeProvider.GetServerGasStation(id)
      .pipe(map(cs => this.ParseFromColShape(cs)));
  }

  private ParseFromColShape(colShape: ColshapeMp): GasStation {
    const id = colShape.getVariable('Id') as number;
    const ownerId = colShape.getVariable('OwnerId') as number | null;

    const name = colShape.getVariable('Name') as string;

    const onSale = colShape.getVariable('OnSale') as boolean;
    const originalPrice = colShape.getVariable('OriginalPrice') as number;
    const onSalePrice = colShape.getVariable('OnSalePrice') as number;

    const gasCount = colShape.getVariable('GasCount') as number;
    const gasPrice = colShape.getVariable('GasPrice') as number;

    const gasCanisterCount = colShape.getVariable('GasCanisterCount') as number;
    const gasCanisterPrice = colShape.getVariable('GasCanisterPrice') as number;

    const repairKitCount = colShape.getVariable('RepairKitCount') as number;
    const repairKitPrice = colShape.getVariable('RepairKitPrice') as number;

    const electricityPrice = colShape.getVariable('ElectricityPrice') as number;

    return {
      id: id,
      ownerId: ownerId,
      name: name,
      position: colShape.position,
      onSale: onSale,
      originalPrice: originalPrice,
      onSalePrice: onSalePrice,
      gasCount: gasCount,
      gasPrice: gasPrice,
      gasCanisterCount: gasCanisterCount,
      gasCanisterPrice: gasCanisterPrice,
      repairKitCount: repairKitCount,
      repairKitPrice: repairKitPrice,
      electricityPrice: electricityPrice
    };
  }
}