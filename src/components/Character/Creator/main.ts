import { KeyboardKeys } from '../../../constants/enums/keyboard-keys';
import { CameraConstants } from '../../../constants/camera';
import { LocalEvent } from '../../../constants/events/local-event';
import { RemoteEvent } from '../../../constants/events/remote-event';
import { RemoteResponse } from '../../../constants/events/remote-response';
import { CharacterCreatorModel } from '../../../models/characters/character-creator';

class CharacterCreator {
  private readonly browser: BrowserMp;
  private readonly camera: CameraMp;
  private readonly headCamera: CameraMp;

  private character: CharacterCreatorModel;

  constructor() {
    this.SetDefaultClothes();

    this.browser = mp.browsers.new('package://components/Character/Creator/creator.html');

    this.headCamera = mp.cameras.new('default', CameraConstants.CreatorCameraHeadPosition, CameraConstants.CreatorCameraStandardRotation, CameraConstants.StandardCameraFOV);
    this.headCamera.setActive(false);

    this.camera = mp.cameras.new('default', CameraConstants.CreatorCameraStandardPosition, CameraConstants.CreatorCameraStandardRotation, CameraConstants.StandardCameraFOV);
    this.camera.setActive(true);

    this.character = new CharacterCreatorModel();

    mp.events.call(LocalEvent.CursorVisible, true, true);
    mp.players.local.freezePosition(true);

    mp.game.ui.displayRadar(false);
    mp.game.ui.displayHud(false);

    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    mp.events.add(RemoteResponse.CharacterCreatorCreated, () => this.Close());
    mp.events.add(RemoteResponse.CharacterCreatorGenderChangeCompleted, () => this.UpdateCharacter());
    mp.events.add(RemoteResponse.CharacterCreatorFailed, (m: string) => this.ErrorMessage(m));

    mp.events.add(LocalEvent.CharacterCreatorTabHair, (s: boolean) => this.TabHair(s));
    mp.events.add(LocalEvent.CharacterCreatorTabFace, (s: boolean) => this.TabFace(s));

    mp.events.add(LocalEvent.CharacterCreatorCreate, (c: string) => {
      this.UpdateCharacterJson(c);
      this.Create();
    });

    mp.events.add(LocalEvent.CharacterCreatorChangeGender, (c: string) => {
      this.UpdateCharacterJson(c);
      this.ChangeGender();
    });

    mp.events.add(LocalEvent.CharacterCreatorUpdateMain, (c: string) => {
      this.UpdateCharacterJson(c);
      this.UpdateMain();
    });

    mp.events.add(LocalEvent.CharacterCreatorUpdateClothes, (c: string) => {
      this.UpdateCharacterJson(c);
      this.UpdateClothes();
    });

    mp.events.add(LocalEvent.CharacterCreatorUpdateFace, (c: string) => {
      this.UpdateCharacterJson(c);
      this.UpdateFace();
    });

    mp.events.add(LocalEvent.CharacterCreatorUpdateHair, (c: string) => {
      this.UpdateCharacterJson(c);
      this.UpdateHair();
    });
  }

  private Close(): void {
    this.browser.destroy();

    this.camera.setActive(false);
    this.camera.destroy();

    mp.events.call(LocalEvent.CursorVisible, false, false);
    mp.players.local.freezePosition(false);

    mp.game.cam.renderScriptCams(false, false, 0, true, false);

    mp.game.ui.displayRadar(true);
    mp.game.ui.displayHud(true);
  }

  private UpdateCharacterJson(characterJson: string): void {
    this.character = JSON.parse(characterJson);
  }

  private TabHair(selected: boolean): void {
    if (selected) {
      mp.players.local.setComponentVariation(3, 15, 0, 2);
      mp.players.local.setComponentVariation(11, 15, 0, 2);
    }
    else {
      mp.players.local.setComponentVariation(3, this.character.torso, 0, 2);
      mp.players.local.setComponentVariation(11, this.character.top, 0, 2);
    }
  }

  private TabFace(selected: boolean): void {
    if (selected && this.camera.isActive()) {
      this.headCamera.setActiveWithInterp(this.camera.handle, 500, 0, 0);
      this.camera.setActive(false);
    }

    if (!selected && this.headCamera.isActive()) {
      this.camera.setActiveWithInterp(this.headCamera.handle, 500, 0, 0);
      this.headCamera.setActive(false);
    }
  }

  private ChangeGender(): void {
    mp.events.callRemote(RemoteEvent.CharacterCreatorChangeGender, this.character.gender);
  }

  private UpdateCharacter(): void {
    this.UpdateClothes();
    this.UpdateMain();
    this.UpdateFace();
    this.UpdateHair();
  }

  private SetDefaultClothes(): void {
    mp.players.local.setComponentVariation(3, 0, 0, 2);
    mp.players.local.setComponentVariation(4, 1, 0, 2);
    mp.players.local.setComponentVariation(8, 15, 0, 2);
    mp.players.local.setComponentVariation(6, 1, 0, 2);
    mp.players.local.setComponentVariation(11, 146, 0, 2);
  }

  private Create(): void {
    this.UpdateCharacter();
    const characterJson = JSON.stringify(this.character);
    mp.events.callRemote(RemoteEvent.CharacterCreatorCreate, characterJson);
  }

  private ErrorMessage(message: string): void {
    this.browser.execute(`window.characterCreatorUi.ShowErrorMessage('${message}');`);
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
      case 49:
      case 14:
      case 146:
      case 241:
        this.character.torso = 0;
        mp.players.local.setComponentVariation(3, this.character.torso, 0, 2);
        break;
      case 45:
        this.character.torso = 7;
        mp.players.local.setComponentVariation(3, this.character.torso, 0, 2);
        break;
      case 111:
        this.character.torso = 4;
        mp.players.local.setComponentVariation(3, this.character.torso, 0, 2);
        break;
      default:
        this.character.torso = 15;
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

    this.character.facialHair = this.character.facialHair === -1 ? 255 : this.character.facialHair;
    mp.players.local.setHeadOverlay(1, this.character.facialHair, 1, this.character.facialHairColor, this.character.facialHairSecondaryColor);

    this.character.eyeBrows = this.character.eyeBrows === -1 ? 255 : this.character.eyeBrows;
    mp.players.local.setHeadOverlay(2, this.character.eyeBrows, 1, this.character.eyeBrowsColor, this.character.eyeBrowsSecondaryColor);

    this.character.chestHair = this.character.chestHair === -1 ? 255 : this.character.chestHair;
    mp.players.local.setHeadOverlay(10, this.character.chestHair, 1, this.character.chestHairColor, this.character.chestHairSecondaryColor);
  }
}

let characterCreator: CharacterCreator;
mp.events.add(LocalEvent.CharacterCreatorOpen, () => characterCreator = characterCreator ? characterCreator : new CharacterCreator());