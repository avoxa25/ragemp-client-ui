import { LocalEvents } from 'src/Constants/local-events';
import { KeyboardKeys } from '../../Constants/keyboard-keys';
import { RemoteResponse } from '../../Constants/remote-response';

class InteractionCarOutside {
  private readonly range: number;
  private readonly resolution: { x: number, y: number };
  private vectorScreenWorld: Vector3Mp;
  private static vehicle: any;
  private browser: BrowserMp;

  constructor() {
    this.range = 5.0;
    this.resolution = mp.game.graphics.getScreenActiveResolution(1, 1);
    this.vectorScreenWorld = new mp.Vector3(this.resolution.x / 2, this.resolution.y / 2, (2 | 4 | 8));
    this.browser = mp.browsers.new('package://Interactions/CarOutside/car-outside.html');

    mp.keys.bind(KeyboardKeys.KeyE, true, () => this.ToggleMenu(true));
    mp.keys.bind(KeyboardKeys.KeyE, false, () => this.ToggleMenu(false));

    mp.events.add(LocalEvents.InteractionCarOutsideToggleLock, () => this.ToggleLock());
    mp.events.add(LocalEvents.InteractionCarOutsideToggleDoor, (d: number) => this.ToggleDoor(d));
  }

  private ToggleMenu(isActive: boolean): void {
    if (isActive && !mp.players.local.vehicle && !mp.gui.cursor.visible) {
      let target = this.getLocalTarget();
      if(!target) return;
      InteractionCarOutside.vehicle = target.entity;
      this.browser.execute(`window.interactionCarOutsideUi.Show();`);
    } else {
      this.browser.execute(`window.interactionCarOutsideUi.Hide();`);
    }
  }

  private getLocalTarget(): RaycastResult | undefined {
    let startPosition = mp.players.local.getBoneCoords(12844, 0.5, 0, 0);
    const secondPoint = mp.game.graphics.screen2dToWorld3d(this.vectorScreenWorld);
    if (!secondPoint) return;

    startPosition.z -= 0.3;
    const target = mp.raycasting.testPointToPoint(startPosition, secondPoint, mp.players.local.handle, (2 | 4 | 8 | 16));
    if (target && target.entity.type == 'vehicle' && mp.game.gameplay.getDistanceBetweenCoords(target.entity.position.x, target.entity.position.y, target.entity.position.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, false) < this.range) return target;
  }

  private ToggleLock(): void {
    // TODO toggle car lock
  }

  private ToggleDoor(door: number): void {
    if(!InteractionCarOutside.vehicle) return;

    if(InteractionCarOutside.vehicle.isDoorFullyOpen(door)){
      InteractionCarOutside.vehicle.setDoorShut(door);
    }
    else{
      InteractionCarOutside.vehicle.setDoorOpen(door);
    }
  }
};

let interactionCarOutside: InteractionCarOutside;
mp.events.add(RemoteResponse.CharacterSelected, () => interactionCarOutside = interactionCarOutside ? interactionCarOutside : new InteractionCarOutside());