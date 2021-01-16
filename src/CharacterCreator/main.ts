import { LocalEvents } from '../Constants/localEvents';
import { RemoteEvents } from '../Constants/remoteEvents';
import { Character } from './character';

abstract class CharacterCreator {
  private static _browser: BrowserMp;
  private static _camera: CameraMp;

  public static Start(): void {
    const camera = new mp.Vector3(347, -1007.5515, -99.0);
    const cameraLookAt = new mp.Vector3(-0.0, 0.0, -93.0);
    CharacterCreator._camera = mp.cameras.new('default', camera, cameraLookAt, 40);

    mp.events.add(RemoteEvents.CharacterCreatorOpen, () => CharacterCreator.Open());
    mp.events.add(LocalEvents.CharacterCreatorCreateClose, (c: Character) => CharacterCreator.Close(c));

    mp.events.add(LocalEvents.CharacterCreatorChangeGender, (c: Character) => CharacterCreator.ChangeGender(c));
    mp.events.add(LocalEvents.CharacterCreatorUpdateMain, (c: Character) => CharacterCreator.UpdateMain(c));
    mp.events.add(LocalEvents.CharacterCreatorUpdateClothes, (c: Character) => CharacterCreator.UpdateClothes(c));
    mp.events.add(LocalEvents.CharacterCreatorUpdateFace, (c: Character) => CharacterCreator.UpdateFace(c));
    mp.events.add(LocalEvents.CharacterCreatorUpdateHair, (c: Character) => CharacterCreator.UpdateHair(c));
  }

  private static Open(): void {
    CharacterCreator._browser = mp.browsers.new('package://CharacterCreator/character-creator.html');

    mp.players.local.freezePosition(true);

    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);

    mp.gui.chat.activate(false);
    mp.gui.chat.show(false);

    mp.gui.cursor.show(true, true);

    CharacterCreator._camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
  }

  private static Close(character : Character): void {
    mp.events.callRemote(RemoteEvents.CharacterCreatorCreateClose, character);

    CharacterCreator._browser.destroy();

    mp.gui.cursor.show(false, false);
    mp.players.local.freezePosition(false);

    mp.gui.chat.activate(true);
    mp.gui.chat.show(true);

    mp.game.cam.renderScriptCams(false, false, 0, true, false);

    CharacterCreator._camera.setActive(false);
    CharacterCreator._camera.destroy();

    mp.game.ui.displayRadar(true);
  }

  private static ChangeGender(character : Character): void {
    mp.events.callRemote(RemoteEvents.CharacterCreatorChangeGender, character.gender);
  }

  private static UpdateMain(character: Character): void {
    mp.players.local.setHeadBlendData(
      character.father,
      character.mother,
      0,
      character.father,
      character.mother,
      0,
      character.shapeMix,
      character.skinMix,
      0.0,
      false);
  }

  private static UpdateClothes(character: Character): void {
    mp.players.local.setComponentVariation(3, 15, 0, 2);
    mp.players.local.setComponentVariation(4, character.legs, 0, 2);
    mp.players.local.setComponentVariation(6, character.shoes, 0, 2);
    mp.players.local.setComponentVariation(11, character.top, 0, 2);
  }

  private static UpdateFace(character: Character): void {
    character.faceFeatures.forEach((ff, i) => mp.players.local.setFaceFeature(i, ff));
    mp.players.local.setEyeColor(character.eyesColor);
  }

  private static UpdateHair(character: Character): void {
    mp.players.local.setHairColor(character.hairColor, character.hairHighLight);

    character.beard = character.beard === -1 ? 255 : character.beard;
    mp.players.local.setHeadOverlay(1, character.beard, 1, character.beardColor, character.beardSecondaryColor);

    character.eyeBrows = character.eyeBrows === -1 ? 255 : character.eyeBrows;
    mp.players.local.setHeadOverlay(2, character.eyeBrows, 1, character.eyeBrowsColor, character.eyeBrowsSecondaryColor);

    character.chestHair = character.chestHair === -1 ? 255 : character.chestHair;
    mp.players.local.setHeadOverlay(10, character.chestHair, 1, character.chestHairColor, character.chestHairSecondaryColor);
  }
};

CharacterCreator.Start();