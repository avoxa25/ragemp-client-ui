import { CameraConstants } from '../../Constants/camera-constants';
import { LocalEvents } from '../../Constants/local-events';
import { RemoteEvents } from '../../Constants/remote-events';
import { RemoteResponse } from '../../Constants/remote-response';
import { CharacterCreatorModel } from './creator-model';

class CharacterCreator {
  private readonly camera: CameraMp;
  private readonly browser: BrowserMp;

  private character: CharacterCreatorModel;

  constructor() {
    this.browser = mp.browsers.new('package://CharacterCreator/creator.html');

    this.camera = mp.cameras.new('default', CameraConstants.CreatorCameraPosition, CameraConstants.CreatorCameraRotation, CameraConstants.StandardCameraFOV);
    this.camera.setActive(true);

    this.character = new CharacterCreatorModel();

    mp.gui.cursor.show(true, true);
    mp.players.local.freezePosition(true);

    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);

    mp.gui.chat.activate(false);
    mp.gui.chat.show(false);
        
    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    mp.events.add(RemoteResponse.CharacterCreatorCreated, () => this.Close());
    mp.events.add(RemoteResponse.CharacterCreatorGenderChangeCompleted, () => this.ChangeGenderComplete());

    mp.events.add(LocalEvents.CharacterCreatorTabHair, (is: boolean, c: string) => {
      this.UpdateCharacterJson(c);
      this.TabHair(is);
    });

    mp.events.add(LocalEvents.CharacterCreatorCreate, (c: string) => {
      this.UpdateCharacterJson(c);
      this.Create();
    });

    mp.events.add(LocalEvents.CharacterCreatorChangeGender, (c: string) => {
      this.UpdateCharacterJson(c);
      this.ChangeGender();
    });

    mp.events.add(LocalEvents.CharacterCreatorUpdateMain, (c: string) => {
      this.UpdateCharacterJson(c);
      this.UpdateMain();
    });

    mp.events.add(LocalEvents.CharacterCreatorUpdateClothes, (c: string) => {
      this.UpdateCharacterJson(c);
      this.UpdateClothes();
    });

    mp.events.add(LocalEvents.CharacterCreatorUpdateFace, (c: string) => {
      this.UpdateCharacterJson(c);
      this.UpdateFace();
    });

    mp.events.add(LocalEvents.CharacterCreatorUpdateHair, (c: string) => {
      this.UpdateCharacterJson(c);
      this.UpdateHair();
    });
  }

  private Close(): void {
    this.browser.destroy();

    this.camera.setActive(false);
    this.camera.destroy();

    mp.gui.cursor.show(false, false);
    mp.players.local.freezePosition(false);

    mp.gui.chat.activate(true);
    mp.gui.chat.show(true);

    mp.game.cam.renderScriptCams(false, false, 0, true, false);    

    mp.game.ui.displayRadar(true);
  }

  private UpdateCharacterJson(characterJson: string): void {
    this.character = JSON.parse(characterJson);
  }

  private TabHair(isSelected: boolean): void {
    if (isSelected) {
      mp.players.local.setComponentVariation(3, 15, 0, 2);
      mp.players.local.setComponentVariation(11, 15, 0, 2);
    }
    else {
      mp.players.local.setComponentVariation(3, this.character.torso, 0, 2);
      mp.players.local.setComponentVariation(11, this.character.top, 0, 2);
    }
  }

  private ChangeGender(): void {
    mp.events.callRemote(RemoteEvents.CharacterCreatorChangeGender, this.character.gender);
  }

  private ChangeGenderComplete() {
    this.UpdateClothes();
    this.UpdateMain();
    this.UpdateFace();
    this.UpdateHair();
  }

  private Create(): void {
    const characterJson = JSON.stringify(this.character);
    mp.events.callRemote(RemoteEvents.CharacterCreatorCreate, characterJson);
  }

  private UpdateMain(): void {
    mp.players.local.setHeadBlendData(
      this.character.father,
      this.character.mother,
      0,
      this.character.father,
      this.character.mother,
      0,
      this.character.shapeMix,
      this.character.skinMix,
      0.0,
      false);
  }

  private UpdateClothes(): void {
    switch (this.character.top) {
      case 111:
        this.character.torso = 4;
        mp.players.local.setComponentVariation(3, this.character.torso, 0, 2);
        break;
      case 49:
      case 146:
      case 241:
        this.character.torso = 0;
        mp.players.local.setComponentVariation(3, this.character.torso, 0, 2);
        break;
      case 26:
        this.character.torso = 15;
        mp.players.local.setComponentVariation(3, this.character.torso, 0, 2);
        break;
      case 45:
        this.character.torso = 7;
        mp.players.local.setComponentVariation(3, this.character.torso, 0, 2);
        break;
    }

    mp.players.local.setComponentVariation(4, this.character.legs, 0, 2);
    mp.players.local.setComponentVariation(8, 15, 0, 2);
    mp.players.local.setComponentVariation(6, this.character.shoes, 0, 2);
    mp.players.local.setComponentVariation(11, this.character.top, 0, 2);
  }

  private UpdateFace(): void {
    this.character.blemishes = this.character.blemishes === -1 ? 255 : this.character.blemishes;
    mp.players.local.setHeadOverlay(0, this.character.blemishes, 1, 0, 0);

    this.character.ageing = this.character.ageing === -1 ? 255 : this.character.ageing;
    mp.players.local.setHeadOverlay(3, this.character.ageing, 1, 0, 0);

    this.character.complexion = this.character.complexion === -1 ? 255 : this.character.complexion;
    mp.players.local.setHeadOverlay(6, this.character.complexion, 1, 0, 0);

    this.character.sunDamage = this.character.sunDamage === -1 ? 255 : this.character.sunDamage;
    mp.players.local.setHeadOverlay(7, this.character.sunDamage, 1, 0, 0);

    this.character.freckles = this.character.freckles === -1 ? 255 : this.character.freckles;
    mp.players.local.setHeadOverlay(9, this.character.freckles, 1, 0, 0);

    this.character.faceFeatures.forEach((ff, i) => mp.players.local.setFaceFeature(i, ff));
    mp.players.local.setEyeColor(this.character.eyesColor);
  }

  private UpdateHair(): void {
    mp.players.local.setComponentVariation(2, this.character.hair, 0, 2);
    mp.players.local.setHairColor(this.character.hairColor, this.character.hairHighLight);

    this.character.beard = this.character.beard === -1 ? 255 : this.character.beard;
    mp.players.local.setHeadOverlay(1, this.character.beard, 1, this.character.beardColor, this.character.beardSecondaryColor);

    this.character.eyeBrows = this.character.eyeBrows === -1 ? 255 : this.character.eyeBrows;
    mp.players.local.setHeadOverlay(2, this.character.eyeBrows, 1, this.character.eyeBrowsColor, this.character.eyeBrowsSecondaryColor);

    this.character.chestHair = this.character.chestHair === -1 ? 255 : this.character.chestHair;
    mp.players.local.setHeadOverlay(10, this.character.chestHair, 1, this.character.chestHairColor, this.character.chestHairSecondaryColor);
  }
}

let characterCreator: CharacterCreator;
mp.events.add(LocalEvents.CharacterCreatorOpen, () => characterCreator = characterCreator ? characterCreator : new CharacterCreator());