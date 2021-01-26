import { LocalEvents } from "../Constants/local-events";
import { RemoteEvents } from "../Constants/remote-events";
import { RemoteResponse } from "../Constants/remote-response";

class CharacterSelect {
  private static browser: BrowserMp;
  private static camera: CameraMp;

  public static Start(): void {
    const camera = new mp.Vector3(347, -1007.5515, -99.15);
    const cameraLookAt = new mp.Vector3(-0.0, 0.0, -93.0);
    this.camera = mp.cameras.new('default', camera, cameraLookAt, 40);

    mp.events.add(RemoteResponse.LoginSuccess, (csm: any) => {
      mp.console.logInfo(csm);
      
      this.Open();
      this.ShowCharacters(csm);
    });
    mp.events.add(RemoteResponse.CharacterSelected, () => this.Close());

    mp.events.add(LocalEvents.CharacterSelect, (cId: number) => this.CharacterSelect(cId));
    mp.events.add(LocalEvents.CharacterDelete, (cId: number) => this.DeleteCharacter(cId));
    mp.events.add(LocalEvents.CharacterSelectCreate, () => this.CharacterSelectCreate());
  }

  private static Open(): void {
    this.browser = mp.browsers.new('package://CharacterSelect/character-select.html');
    mp.players.local.freezePosition(true);

    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);

    mp.gui.chat.activate(false);

    mp.gui.cursor.show(true, true);

    this.camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
  }

  private static Close(): void {
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

  private static ShowCharacters(characterSelectModels: any): void {
    this.browser.execute(`window.characterSelectUi.ShowCharacters("${characterSelectModels}");`);
  }

  private static CharacterSelectCreate(): void
  {
    mp.events.callRemote(RemoteEvents.CharacterCreatorCreate);
  }

  private static DeleteCharacter(characterId: number): void {
    mp.events.callRemote(RemoteEvents.CharacterDelete, characterId);
  }

  private static CharacterSelect(characterId: number): void {
    mp.events.callRemote(RemoteEvents.CharacterSelect, characterId);
  }

  // TODO: Redirect to purchase page or something similar
}

CharacterSelect.Start();