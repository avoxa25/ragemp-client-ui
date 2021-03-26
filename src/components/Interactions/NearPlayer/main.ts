import { KeyboardKeys } from '../../../constants/enums/keyboard-keys';
import { RemoteResponse } from '../../../constants/events/remote-response';

class InteractionNearPlayer {
  private readonly range: number;
  private readonly resolution: { x: number, y: number };
  private vectorScreenWorld: Vector3Mp;
  private static targetPlayer: any;
  private browser: BrowserMp;

  constructor() {
    this.range = 5.0;
    this.resolution = mp.game.graphics.getScreenActiveResolution(1, 1);
    this.vectorScreenWorld = new mp.Vector3(this.resolution.x / 2, this.resolution.y / 2, (2 | 4 | 8));
    this.browser = mp.browsers.new('package://components/Interactions/NearPlayer/near-player.html');

    mp.keys.bind(KeyboardKeys.KeyE, true, () => this.ToggleMenu(true));
    mp.keys.bind(KeyboardKeys.KeyE, false, () => this.ToggleMenu(false));
  }

  private ToggleMenu(isActive: boolean): void {
    if (isActive && !mp.gui.cursor.visible) {
      let target = this.getLocalTarget();
      if(!target) return;
      InteractionNearPlayer.targetPlayer = target.entity;

      // TODO add sending player & functions with it
      this.browser.execute(`window.interactionNearPlayerUi.Show();`);
    } else {
      this.browser.execute(`window.interactionNearPlayerUi.Hide();`);
    }
  }

  private getLocalTarget(): RaycastResult | undefined {
    let startPosition = mp.players.local.getBoneCoords(12844, 0.5, 0, 0);
    const secondPoint = mp.game.graphics.screen2dToWorld3d(this.vectorScreenWorld);
    if (!secondPoint) return;

    startPosition.z -= 0.3;
    const target = mp.raycasting.testPointToPoint(startPosition, secondPoint, mp.players.local.handle, (2 | 4 | 8 | 16));
    if (target && target.entity.type == 'player' && mp.game.gameplay.getDistanceBetweenCoords(target.entity.position.x, target.entity.position.y, target.entity.position.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, false) < this.range) return target;
  }
};

let interactionNearPlayer: InteractionNearPlayer;
mp.events.add(RemoteResponse.CharacterSelected, () => interactionNearPlayer = interactionNearPlayer ? interactionNearPlayer : new InteractionNearPlayer());