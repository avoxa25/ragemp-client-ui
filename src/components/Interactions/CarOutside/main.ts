import { VehicleDoors } from '../../../constants/enums/vehicle-doors';
import { KeyboardKeys } from '../../../constants/enums/keyboard-keys';
import { LocalEvent } from '../../../constants/events/local-event';
import { RemoteResponse } from '../../../constants/events/remote-response';

class InteractionCarOutside {
  private readonly range: number;
  private readonly resolution: { x: number, y: number };
  private vectorScreenWorld: Vector3Mp;
  private vehicle: any;
  private browser: BrowserMp;

  constructor() {
    this.vehicle = mp.players.local.vehicle;
    this.range = 3.0;
    this.resolution = mp.game.graphics.getScreenActiveResolution(1, 1);
    this.vectorScreenWorld = new mp.Vector3(this.resolution.x / 2, this.resolution.y / 2, (2 | 4 | 8));
    this.browser = mp.browsers.new('package://components/Interactions/CarOutside/car-outside.html');

    mp.keys.bind(KeyboardKeys.KeyE, true, () => this.ToggleMenu(true));
    mp.keys.bind(KeyboardKeys.KeyE, false, () => this.ToggleMenu(false));

    mp.events.add(LocalEvent.InteractionCarOutsideToggleLock, () => this.ToggleLock());
    mp.events.add(LocalEvent.InteractionCarOutsideToggleDoor, (d: VehicleDoors) => this.ToggleDoor(d));

    setInterval(() => {
      //if(mp.players.local.vehicle && mp.gui.cursor.visible) return;
      let target = this.getLocalTarget();
      if (!target) return;
      this.drawTarget3d(target.position);
    }, 10)
  }

  private ToggleMenu(isActive: boolean): void {
    if (isActive && !mp.players.local.vehicle && !mp.gui.cursor.visible) {
      let target = this.getLocalTarget();
      if (!target) return;
      (this.vehicle as any) = target.entity;
      mp.gui.cursor.show(true, true);
      this.browser.execute(`window.interactionCarOutsideUi.Show();`);
    } else {
      mp.gui.cursor.show(false, false);
      this.browser.execute(`window.interactionCarOutsideUi.Hide();`);
    }
  }

  private getLocalTarget(): RaycastResult | undefined {
    let startPosition = mp.players.local.getBoneCoords(12844, 0.5, 0, 0);
    const secondPoint = mp.game.graphics.screen2dToWorld3d(this.vectorScreenWorld);
    if (!secondPoint) return;

    startPosition.z -= 0.3;
    const target = mp.raycasting.testPointToPoint(
      startPosition,
      secondPoint,
      mp.players.local.handle,
      (2 | 4 | 8 | 16));
    if (
      target
      && target.entity.type === 'vehicle'
      && mp.game.gameplay.getDistanceBetweenCoords(
        target.entity.position.x,
        target.entity.position.y,
        target.entity.position.z,

        mp.players.local.position.x,
        mp.players.local.position.y,
        mp.players.local.position.z,
        false) < this.range) return target;
    return;
  }

  private ToggleLock(): void {
    // TODO: toggle car lock
  }

  private ToggleDoor(door: VehicleDoors): void {
    if (!this.vehicle) return;
    mp.console.logInfo(this.vehicle.doors);
    if (this.vehicle.isDoorFullyOpen(door)) {
      this.vehicle.setDoorShut(door, false);
    }
    else {
      this.vehicle.setDoorOpen(door, false, false);
    }
  }

  private drawTarget3d(pos: Vector3Mp, textureDict = "mpmissmarkers256", textureName = "corona_shade", scaleX = 0.005, scaleY = 0.01): void {
    const position = mp.game.graphics.world3dToScreen2d(pos.x, pos.y, pos.z);
    if (!position) return;
    mp.game.graphics.drawSprite(textureDict, textureName, position.x, position.y, scaleX, scaleY, 0, 0, 0, 0, 200);
  }
};

let interactionCarOutside: InteractionCarOutside | undefined;
mp.events.add(RemoteResponse.CharacterSelected, () => interactionCarOutside = interactionCarOutside ? interactionCarOutside : new InteractionCarOutside());