import { RemoteResponse } from '../../constants/events/remote-response';
import { House } from '../../models/houses/house';
import { HouseProvider } from './house-provider';

export abstract class HouseService {
  private static houses: House[];

  public static Start(): void {
    HouseService.houses = HouseProvider.GetAllFromBlips();

    setInterval(() => HouseService.Update(), 1000);
    HouseService.Update();
  }

  public static GetAll(): House[] {
    return HouseService.houses;
  }

  public static GetById(id: number): House | undefined {
    return HouseService.houses.find(h => h.id === id);
  }

  private static Update(): void {
    HouseService.houses.forEach(h => HouseProvider.UpdateFromBlip(h));
    HouseService.houses.forEach(h => HouseProvider.UpdateFromMarkers(h));
    HouseService.houses.forEach(h => HouseProvider.UpdateFromColShape(h));
  }
}

mp.events.add(RemoteResponse.LoginAllowed, () => HouseService.Start());