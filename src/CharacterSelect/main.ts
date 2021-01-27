import { LocalEvents } from "../Constants/local-events";
import { RemoteEvents } from "../Constants/remote-events";
import { RemoteResponse } from "../Constants/remote-response";

class CharacterSelect {
  private readonly browser: BrowserMp;
  private readonly camera: CameraMp;

  constructor(csm: string) {
    const camera = new mp.Vector3(347, -1007.5515, -99.15);
    const cameraLookAt = new mp.Vector3(-0.0, 0.0, -93.0);
    this.camera = mp.cameras.new('default', camera, cameraLookAt, 40);

    this.browser = mp.browsers.new('package://CharacterSelect/character-select.html');
    mp.players.local.freezePosition(true);

    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);

    mp.gui.chat.activate(false);

    mp.gui.cursor.show(true, true);

    this.camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    this.ShowCharacters(csm);

    mp.events.add(RemoteResponse.CharacterSelected, () => this.Close());

    mp.events.add(LocalEvents.CharacterSelect, (cId: number) => this.CharacterSelect(cId));
    mp.events.add(LocalEvents.CharacterDelete, (cId: number) => this.DeleteCharacter(cId));
    mp.events.add(LocalEvents.CharacterSelectCreate, () => this.CharacterSelectCreate());
  }

  private Close(): void {
    this.browser.destroy();

    mp.gui.cursor.show(false, false);
    mp.players.local.freezePosition(false);

    mp.gui.chat.activate(true);
    mp.gui.chat.show(true);

    mp.game.cam.renderScriptCams(false, false, 0, true, false);

    this.camera.setActive(false);
    this.camera.destroy();

    mp.game.ui.displayRadar(true);
  }

  private ShowCharacters(characterSelectModelsJson: string): void {
    this.browser.execute(`window.characterSelectUi.ShowCharacters('${characterSelectModelsJson}');`);
  }

  private CharacterSelectCreate(): void {
    mp.events.callRemote(RemoteEvents.CharacterCreatorCreate);
  }

  private DeleteCharacter(characterId: number): void {
    mp.events.callRemote(RemoteEvents.CharacterDelete, characterId);
  }

  private CharacterSelect(characterId: number): void {
    mp.events.callRemote(RemoteEvents.CharacterSelect, characterId);
  }

  // TODO: Redirect to purchase page or something similar
}

let characterSelect: CharacterSelect | undefined;
mp.events.add(RemoteResponse.LoginSuccess, (csm: string) => characterSelect = characterSelect ? characterSelect : new CharacterSelect(csm));
