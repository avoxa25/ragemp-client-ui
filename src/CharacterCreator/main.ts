import { LocalEvents } from '../Constants/localEvents';
import { RemoteEvents } from '../Constants/remoteEvents';
import { Character } from './character';

abstract class CharacterCreator {
  private static browser: BrowserMp;
  private static camera: CameraMp;
  private static character: Character;

  public static Start(): void {
    const camera = new mp.Vector3(347, -1007.5515, -99.15);
    const cameraLookAt = new mp.Vector3(-0.0, 0.0, -93.0);
    CharacterCreator.camera = mp.cameras.new('default', camera, cameraLookAt, 40);

    mp.gui.chat.show(false);

    mp.gui.cursor.show(true, true);

    mp.events.add(RemoteEvents.CharacterCreatorOpen, () => CharacterCreator.Open());
    mp.events.add(RemoteEvents.CharacterCreatorClose, () => CharacterCreator.Close());
    mp.events.add(RemoteEvents.CharacterCreatorChangeGenderComplete, () => CharacterCreator.ChangeGenderComplete());

    mp.events.add(LocalEvents.CharacterCreatorTabHair, (is: boolean, c: string) => {
      CharacterCreator.UpdateCharacterJson(c);
      CharacterCreator.TabHair(is);
    });

    mp.events.add(LocalEvents.CharacterCreatorCreate, (c: string) => {
      CharacterCreator.UpdateCharacterJson(c);
      CharacterCreator.Create();
    });

    mp.events.add(LocalEvents.CharacterCreatorChangeGender, (c: string) => {
      CharacterCreator.UpdateCharacterJson(c);
      CharacterCreator.ChangeGender();
    });

    mp.events.add(LocalEvents.CharacterCreatorUpdateMain, (c: string) => {
      CharacterCreator.UpdateCharacterJson(c);
      CharacterCreator.UpdateMain();
    });

    mp.events.add(LocalEvents.CharacterCreatorUpdateClothes, (c: string) => {
      CharacterCreator.UpdateCharacterJson(c);
      CharacterCreator.UpdateClothes();
    });

    mp.events.add(LocalEvents.CharacterCreatorUpdateFace, (c: string) => {
      CharacterCreator.UpdateCharacterJson(c);
      CharacterCreator.UpdateFace();
    });

    mp.events.add(LocalEvents.CharacterCreatorUpdateHair, (c: string) => {
      CharacterCreator.UpdateCharacterJson(c);
      CharacterCreator.UpdateHair();
    });
  }

  private static Open(): void {
    CharacterCreator.browser = mp.browsers.new('package://CharacterCreator/character-creator.html');

    mp.players.local.freezePosition(true);

    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);

    mp.gui.chat.activate(false);
    mp.gui.chat.show(false);

    mp.gui.cursor.show(true, true);

    mp.events.call(LocalEvents.DiscordSetStatus, "Создаёт персонажа");

    CharacterCreator.camera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
  }

  private static Close(): void {
    CharacterCreator.browser.destroy();

    mp.gui.cursor.show(false, false);
    mp.players.local.freezePosition(false);

    mp.gui.chat.activate(true);
    mp.gui.chat.show(true);

    mp.game.cam.renderScriptCams(false, false, 0, true, false);

    CharacterCreator.camera.setActive(false);
    CharacterCreator.camera.destroy();

    mp.game.ui.displayRadar(true);
  }

  private static UpdateCharacterJson(characterJson: string): void {
    CharacterCreator.character = JSON.parse(characterJson);
  }

  private static TabHair(isSelected: boolean): void {
    if (isSelected) {
      mp.players.local.setComponentVariation(3, 15, 0, 2);
      mp.players.local.setComponentVariation(11, 15, 0, 2);
    }
    else {
      mp.players.local.setComponentVariation(3, CharacterCreator.character.torso, 0, 2);
      mp.players.local.setComponentVariation(11, CharacterCreator.character.top, 0, 2);
    }
  }

  private static ChangeGender(): void {
    mp.events.callRemote(RemoteEvents.CharacterCreatorChangeGender, CharacterCreator.character.gender);
  }

  private static ChangeGenderComplete() {
    CharacterCreator.UpdateClothes();
    CharacterCreator.UpdateMain();
    CharacterCreator.UpdateFace();
    CharacterCreator.UpdateHair();
  }

  private static Create(): void {
    const characterJson = JSON.stringify(CharacterCreator.character);
    mp.events.callRemote(RemoteEvents.CharacterCreatorCreate, characterJson);
  }

  private static UpdateMain(): void {
    mp.players.local.setHeadBlendData(
      CharacterCreator.character.father,
      CharacterCreator.character.mother,
      0,
      CharacterCreator.character.father,
      CharacterCreator.character.mother,
      0,
      CharacterCreator.character.shapeMix,
      CharacterCreator.character.skinMix,
      0.0,
      false);
  }

  private static UpdateClothes(): void {
    switch (CharacterCreator.character.top) {
      case 111:
        CharacterCreator.character.torso = 4;
        mp.players.local.setComponentVariation(3, CharacterCreator.character.torso, 0, 2);
        break;
      case 49:
      case 146:
      case 241:
        CharacterCreator.character.torso = 0;
        mp.players.local.setComponentVariation(3, CharacterCreator.character.torso, 0, 2);
        break;
      case 26:
        CharacterCreator.character.torso = 15;
        mp.players.local.setComponentVariation(3, CharacterCreator.character.torso, 0, 2);
        break;
      case 45:
        CharacterCreator.character.torso = 7;
        mp.players.local.setComponentVariation(3, CharacterCreator.character.torso, 0, 2);
        break;
    }

    mp.players.local.setComponentVariation(4, CharacterCreator.character.legs, 0, 2);
    mp.players.local.setComponentVariation(8, 15, 0, 2);
    mp.players.local.setComponentVariation(6, CharacterCreator.character.shoes, 0, 2);
    mp.players.local.setComponentVariation(11, CharacterCreator.character.top, 0, 2);
  }

  private static UpdateFace(): void {
    CharacterCreator.character.blemishes = CharacterCreator.character.blemishes === -1 ? 255 : CharacterCreator.character.blemishes;
    mp.players.local.setHeadOverlay(0, CharacterCreator.character.blemishes, 1, 0, 0);

    CharacterCreator.character.ageing = CharacterCreator.character.ageing === -1 ? 255 : CharacterCreator.character.ageing;
    mp.players.local.setHeadOverlay(3, CharacterCreator.character.ageing, 1, 0, 0);

    CharacterCreator.character.complexion = CharacterCreator.character.complexion === -1 ? 255 : CharacterCreator.character.complexion;
    mp.players.local.setHeadOverlay(6, CharacterCreator.character.complexion, 1, 0, 0);

    CharacterCreator.character.sunDamage = CharacterCreator.character.sunDamage === -1 ? 255 : CharacterCreator.character.sunDamage;
    mp.players.local.setHeadOverlay(7, CharacterCreator.character.sunDamage, 1, 0, 0);

    CharacterCreator.character.freckles = CharacterCreator.character.freckles === -1 ? 255 : CharacterCreator.character.freckles;
    mp.players.local.setHeadOverlay(9, CharacterCreator.character.freckles, 1, 0, 0);

    CharacterCreator.character.faceFeatures.forEach((ff, i) => mp.players.local.setFaceFeature(i, ff));
    mp.players.local.setEyeColor(CharacterCreator.character.eyesColor);
  }

  private static UpdateHair(): void {
    mp.players.local.setComponentVariation(2, CharacterCreator.character.hair, 0, 2);
    mp.players.local.setHairColor(CharacterCreator.character.hairColor, CharacterCreator.character.hairHighLight);

    CharacterCreator.character.beard = CharacterCreator.character.beard === -1 ? 255 : CharacterCreator.character.beard;
    mp.players.local.setHeadOverlay(1, CharacterCreator.character.beard, 1, CharacterCreator.character.beardColor, CharacterCreator.character.beardSecondaryColor);

    CharacterCreator.character.eyeBrows = CharacterCreator.character.eyeBrows === -1 ? 255 : CharacterCreator.character.eyeBrows;
    mp.players.local.setHeadOverlay(2, CharacterCreator.character.eyeBrows, 1, CharacterCreator.character.eyeBrowsColor, CharacterCreator.character.eyeBrowsSecondaryColor);

    CharacterCreator.character.chestHair = CharacterCreator.character.chestHair === -1 ? 255 : CharacterCreator.character.chestHair;
    mp.players.local.setHeadOverlay(10, CharacterCreator.character.chestHair, 1, CharacterCreator.character.chestHairColor, CharacterCreator.character.chestHairSecondaryColor);
  }
};

CharacterCreator.Start();  