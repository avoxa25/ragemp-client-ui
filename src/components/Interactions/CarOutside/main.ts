import { VehicleDoors } from '../../../constants/enums/vehicle-doors';
import { KeyboardKeys } from '../../../constants/enums/keyboard-keys';
import { LocalEvent } from '../../../constants/events/local-event';
import { RemoteResponse } from '../../../constants/events/remote-response';
import { RemoteEvent } from '../../../constants/events/remote-event';
import { NotificationType } from '../../../constants/enums/notification-type';
import { InteractionHelper } from '../../../helpers/interaction-helper';

// TODO: Refactor this after realise

class InteractionCarOutside {
  private readonly range: number;
  private readonly resolution: { x: number, y: number };
  private vectorScreenWorld: Vector3Mp;
  private vehicle: VehicleMp;
  private locked: boolean;
  private browser: BrowserMp;
  private doors: boolean[];

  constructor() {
    this.vehicle = mp.players.local.vehicle;
    this.locked = false;
    this.doors = [false, false, false, false, false, false];

    this.range = 3.0;
    this.resolution = mp.game.graphics.getScreenActiveResolution(1, 1);
    this.vectorScreenWorld = new mp.Vector3(this.resolution.x / 2, this.resolution.y / 2, (2 | 4 | 8));
    this.browser = mp.browsers.new('package://components/Interactions/CarOutside/car-outside.html');

    mp.keys.bind(KeyboardKeys.KeyE, true, () => this.ToggleMenu(true));
    mp.keys.bind(KeyboardKeys.KeyE, false, () => this.ToggleMenu(false));

    mp.events.add(RageEnums.EventKey.PLAYER_ENTER_VEHICLE, (v: VehicleMp, s: number) => this.OnPlayerEnterVehicle(v, s));
    mp.events.add(RageEnums.EventKey.PLAYER_LEAVE_VEHICLE, () => this.OnPlayerExitVehicle());

    mp.events.add(LocalEvent.InteractionCarOutsideToggleLock, () => this.ToggleLock());
    mp.events.add(LocalEvent.InteractionCarOutsideToggleDoor, (d: VehicleDoors) => this.ToggleDoor(d));

    setInterval(() => {
      if (mp.players.local.vehicle && mp.gui.cursor.visible) return;
      const target = this.GetLookingAtEntity();
      if (!target) return;
      this.drawTarget3d(target.entity.position);
    }, 10)
  }

  private OnPlayerEnterVehicle(vehicle: VehicleMp, seatId: number): void {
    if (!vehicle) return;
    if (seatId !== -1) return;
    mp.keys.unbind(KeyboardKeys.KeyE, true);
    mp.keys.unbind(KeyboardKeys.KeyE, false);
  }

  private OnPlayerExitVehicle(): void {
    mp.keys.bind(KeyboardKeys.KeyE, true, () => this.ToggleMenu(true));
    mp.keys.bind(KeyboardKeys.KeyE, false, () => this.ToggleMenu(false));
  }

  private ToggleMenu(isActive: boolean): void {
    if (isActive && !mp.players.local.vehicle && !mp.gui.cursor.visible) {
      const target = this.GetLookingAtEntity();
      if (!target) return;
      (this.vehicle as any) = target.entity;
      if (this.vehicle.getHealth() <= 0) return;

      this.doors = this.vehicle.getVariable('DoorState') as boolean[];
      this.locked = this.vehicle.getDoorLockStatus() !== 2 ? true : false;

      mp.events.call(LocalEvent.CursorVisible, true, true);
      this.browser.execute(`window.interactionCarOutsideUi.Show('${this.locked}');`);
    } else {
      mp.events.call(LocalEvent.CursorVisible, false, false);
      this.browser.execute(`window.interactionCarOutsideUi.Hide();`);
    }
  }


  private GetLookingAtEntity(): RaycastResult | undefined {
    let headPosition = mp.players.local.getBoneCoords(12844, 0.5, 0, 0);
    const resolution = mp.game.graphics.getScreenActiveResolution(1, 1);
    const resolutionVector = new mp.Vector3(resolution.x / 2, resolution.y / 2, (2 | 4 | 8));
    const pointOfView = mp.game.graphics.screen2dToWorld3d(resolutionVector);
    if (!pointOfView) return;

    const result = mp.raycasting.testPointToPoint(headPosition, pointOfView, mp.players.local.handle, (2 | 4 | 8 | 16));

    if (result === undefined) return undefined;
    if (result.entity.type === undefined) return undefined;

    const entityPosition = result.entity.position;
    const playerPosition = mp.players.local.position;
    if (InteractionHelper.GetDistanceBetweenVectors(entityPosition, playerPosition, true) > this.range) return undefined;

    return result;
  }

  private ToggleLock(): void {
    if (!this.vehicle) return;
    if (!mp.gui.cursor.visible) return;

    mp.events.callRemote(RemoteEvent.VehicleToggleLocked, this.vehicle, this.locked);

    const notification = this.locked ? 'Транспортное средство закрыто' : 'Транспортное средство открыто';
    mp.events.call(RemoteResponse.NotificationSent, NotificationType.Info, notification);
  }

  private ToggleDoor(door: VehicleDoors): void {
    if (!this.vehicle) return;
    this.vehicle.getMaxNumberOfPassengers();
    this.doors[door] ? this.vehicle.setDoorShut(door, false) : this.vehicle.setDoorOpen(door, false, false);
    this.doors[door] = !this.doors[door];

    const doorStateJson = JSON.stringify(this.doors);

    mp.events.callRemote(RemoteEvent.VehicleSyncDoors, this.vehicle, doorStateJson);
  }

  private drawTarget3d(pos: Vector3Mp): void {
    const position = mp.game.graphics.world3dToScreen2d(pos.x, pos.y, pos.z);
    if (!position) return;
    mp.game.graphics.drawText("E", [pos.x, pos.y, pos.z], {
      font: 0,
      centre: true,
      color: [255, 255, 255, 185],
      scale: [0.4, 0.4],
      outline: true
    });
  }
};

let interactionCarOutside: InteractionCarOutside | undefined;
mp.events.add(RemoteResponse.CharacterSelected, () => interactionCarOutside = interactionCarOutside ? interactionCarOutside : new InteractionCarOutside());