import { RemoteResponse } from '../../models/enums/events/remote-response';
import { House } from '../../models/view-models/houses/house';
import { HouseProvider } from './house-provider';

export abstract class HouseService {
  private static houses: House[];

  public static Start(): void {
    HouseService.houses = HouseProvider.getAllFromBlips();

    setInterval(() => HouseService.updateHousesFromBlips(), 1000);
  }

  public static getAll(): House[] {
    return HouseService.houses;
  }

  public static getById(id: number): House | undefined {
    return HouseService.houses.find(h => h.id === id);
  }

  private static updateHousesFromBlips(): void {
    HouseService.houses.forEach(h => HouseProvider.updateFromBlip(h));
  }
}

mp.events.add(RemoteResponse.LoginAllowed, () => HouseService.Start());