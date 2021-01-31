import { RemoteResponse } from '../../constants/events/remote-response';
import { House } from '../../models/houses/house';
import { HouseProvider } from './house-provider';

export abstract class HouseService {
  private static houses: House[];

  public static Start(): void {
    HouseService.houses = HouseProvider.getAllFromBlips();

    setInterval(() => HouseService.Update(), 1000);
  }

  public static GetAll(): House[] {
    return HouseService.houses;
  }

  public static GetById(id: number): House | undefined {
    return HouseService.houses.find(h => h.id === id);
  }

  private static Update(): void {
    HouseService.houses.forEach(h => HouseProvider.updateFromBlip(h));
    HouseService.houses.forEach(h => HouseProvider.updateFromMarkers(h));
  }
}

mp.events.add(RemoteResponse.LoginAllowed, () => HouseService.Start());