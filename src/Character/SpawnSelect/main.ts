import { CameraConstants } from '../../Constants/camera-constants';
import { LocalEvents } from '../../Constants/local-events';
import { RemoteEvents } from '../../Constants/remote-events';
import { RemoteResponse } from '../../Constants/remote-response';
import { SpawnType } from './spawn-types';

class CharacterSpawnSelect {
  private readonly browser: BrowserMp;
  private readonly camera: CameraMp;

  constructor() {
    this.browser = mp.browsers.new('package://CharacterSpawnSelect/character-spawn-select.html');
    mp.players.local.freezePosition(true);
    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);

    mp.gui.cursor.show(true, true);

    this.camera = mp.cameras.new('default', CameraConstants.StandardCameraPosition, CameraConstants.StandardCameraRotation, CameraConstants.StandardCameraFOV);

    this.camera.pointAtCoord(CameraConstants.StandardCameraPoint.x, CameraConstants.StandardCameraPoint.y, CameraConstants.StandardCameraPoint.z);
    this.camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    mp.events.add(RemoteResponse.CharacterSpawnSelected, () => this.Close());
    mp.events.add(LocalEvents.CharacterSpawnSelect, (st: SpawnType) => this.CharacterSpawnSelect(st));
  }

  private CharacterSpawnSelect(spawnType: SpawnType): void {
    mp.events.callRemote(RemoteEvents.CharacterSpawnSelect, spawnType);
  }

  private Close() {
    this.browser.destroy();
    mp.players.local.freezePosition(false);

    mp.gui.chat.activate(true);
    mp.gui.chat.show(true);
    mp.gui.cursor.show(false, false);

    mp.game.cam.renderScriptCams(false, false, 0, true, false);

    this.camera.setActive(false);
    this.camera.destroy();

    mp.game.ui.displayRadar(true);
  }
}

let characterSpawnSelect: CharacterSpawnSelect | undefined;
mp.events.add(RemoteResponse.CharacterSelected, () => characterSpawnSelect = characterSpawnSelect ? characterSpawnSelect : new CharacterSpawnSelect());