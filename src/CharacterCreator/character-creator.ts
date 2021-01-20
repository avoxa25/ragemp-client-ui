import { LocalEvents } from '../Constants/localEvents';
import { Character } from './character';
import { CharacterCreatorData } from './character-creator-data';

abstract class CharacterCreatorUi {
  private static character: Character;
  private static characterJSON: string;

  public static Start(): void {
    CharacterCreatorUi.character = new Character();

    CharacterCreatorUi.StartTabs();

    CharacterCreatorUi.StartMain();
    CharacterCreatorUi.StartClothes();
    CharacterCreatorUi.StartFace();
    CharacterCreatorUi.StartHair();
  }

  private static StartTabs(): void {
    const tabLinks = document.querySelectorAll('button.tabLinks');
    tabLinks.forEach((tl) => {
      const tabId = tl.getAttribute('data-tab') as string;
      tl.addEventListener('click', () => CharacterCreatorUi.OpenTab(tabId, tl.id));
    });
  }

  private static OpenTab(selectedTabId: string, selectedTabLinkId: string): void {
    const tabs = document.getElementsByClassName('parameters') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabs.length; i++) {
      const isSelectedTab = tabs[i].id === selectedTabId;
      tabs[i].style.display = isSelectedTab ? 'block' : 'none';
    }

    if (selectedTabId === 'tabHair') mp.events.call(LocalEvents.CharacterCreatorTabHair);

    console.log(selectedTabId);

    const tabLinks = document.getElementsByClassName('tabLinks') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabLinks.length; i++) {
      const isSelectedTabLink = tabLinks[i].id === selectedTabLinkId;
      if (isSelectedTabLink) {
        tabLinks[i].classList.add('active');
      } else {
        tabLinks[i].classList.remove('active');
      }
    }
  }

  private static StartMain(): void {
    const form = document.querySelector('form#formMain') as HTMLFormElement;
    const randomButton = form.querySelector('button[id=random]');

    form.addEventListener('submit', () => CharacterCreatorUi.Create());
    form.addEventListener('reset', () => {
      CharacterCreatorUi.ResetForm(form);
      CharacterCreatorUi.UpdateCharacterFromMain(form);
    });
    randomButton?.addEventListener('click', () => {
      CharacterCreatorUi.RandomForm(form);
      CharacterCreatorUi.UpdateCharacterFromMain(form);
    });

    const inputButtons = form.querySelectorAll('button[data-input-name]');
    inputButtons.forEach((ib) => ib.addEventListener('click', () => CharacterCreatorUi.StartInputButtons(form, ib)));

    const inputs = form.querySelectorAll('input:not([style*="display: none;"])');
    inputs.forEach((i) => i.addEventListener('change', () => CharacterCreatorUi.UpdateCharacterFromMain(form)));
  }

  private static StartClothes(): void {
    const form = document.querySelector('form#formClothes') as HTMLFormElement;
    const randomButton = form.querySelector('button[id=random]');

    form.addEventListener('submit', () => CharacterCreatorUi.Create());
    form.addEventListener('reset', () => {
      CharacterCreatorUi.ResetForm(form);
      CharacterCreatorUi.UpdateCharacterFromClothes(form);
    });
    randomButton?.addEventListener('click', () => {
      CharacterCreatorUi.RandomForm(form);
      CharacterCreatorUi.UpdateCharacterFromClothes(form);
    });

    const inputButtons = form.querySelectorAll('button[data-input-name]');
    inputButtons.forEach((ib) => ib.addEventListener('click', () => CharacterCreatorUi.StartInputButtons(form, ib)));

    const inputs = form.querySelectorAll('input:not([style*="display: none;"])');
    inputs.forEach((i) => i.addEventListener('change', () => CharacterCreatorUi.UpdateCharacterFromClothes(form)));
  }

  private static StartFace(): void {
    const form = document.querySelector('form#formFace') as HTMLFormElement;
    const randomButton = form.querySelector('button[id=random]');

    form.addEventListener('submit', () => CharacterCreatorUi.Create());
    form.addEventListener('reset', () => {
      CharacterCreatorUi.ResetForm(form);
      CharacterCreatorUi.UpdateCharacterFromFace(form);
    });
    randomButton?.addEventListener('click', () => {
      CharacterCreatorUi.RandomForm(form);
      CharacterCreatorUi.UpdateCharacterFromFace(form);
    });

    const inputButtons = form.querySelectorAll('button[data-input-name]');
    inputButtons.forEach((ib) => ib.addEventListener('click', () => CharacterCreatorUi.StartInputButtons(form, ib)));

    const inputs = form.querySelectorAll('input:not([style*="display: none;"])');
    inputs.forEach((i) => i.addEventListener('change', () => CharacterCreatorUi.UpdateCharacterFromFace(form)));
  }

  private static StartHair(): void {
    const form = document.querySelector('form#formHair') as HTMLFormElement;
    const randomButton = form.querySelector('button[id=random]');

    form.addEventListener('submit', () => CharacterCreatorUi.Create());
    form.addEventListener('reset', () => {
      CharacterCreatorUi.ResetForm(form);
      CharacterCreatorUi.UpdateCharacterFromHair(form);
    });
    randomButton?.addEventListener('click', () => {
      CharacterCreatorUi.RandomForm(form);
      CharacterCreatorUi.UpdateCharacterFromHair(form);
    });

    const inputButtons = form.querySelectorAll('button[data-input-name]');
    inputButtons.forEach((ib) => ib.addEventListener('click', () => {
      CharacterCreatorUi.StartInputButtons(form, ib);
    }));

    const inputs = form.querySelectorAll('input:not([style*="display: none;"])');
    inputs.forEach((i) => i.addEventListener('change', () => CharacterCreatorUi.UpdateCharacterFromHair(form)));
  }

  private static StartInputButtons(form: HTMLFormElement, inputButton: Element): void {
    const inputName = inputButton.getAttribute('data-input-name') as string;
    const rawInputValueCycle = inputButton.getAttribute('data-input-value-cycle') as string;
    const inputValueCycle = Number.parseInt(rawInputValueCycle);
    let genderNumber = CharacterCreatorUi.character.gender ? 1 : 0;

    const input = form.querySelector(`input[name=${inputName}]`) as HTMLInputElement;
    const inputText = form.querySelector(`input[name=${inputName}Text]`) as HTMLInputElement;

    let values;
    let textValues;
    if (inputName === 'hair' || form.id === 'formClothes') {
      values = CharacterCreatorData.GetValuesByInputName(inputName, genderNumber);
      textValues = CharacterCreatorData.GetTextsByInputName(inputName, genderNumber);
    }
    else {
      values = CharacterCreatorData.GetValuesByInputName(inputName);
      textValues = CharacterCreatorData.GetTextsByInputName(inputName);
    }

    const currentValueIndex = values.indexOf(input.value);
    let nextValueIndex = currentValueIndex + inputValueCycle;
    if (form.id === 'formHair' && inputName !== 'hair' || form.id === 'formFace' && inputName !== 'eyesColor') {
      nextValueIndex = nextValueIndex <= -2 ? values.length - 1 : nextValueIndex;
      nextValueIndex = nextValueIndex === values.length + 1 ? 0 : nextValueIndex;
      nextValueIndex = nextValueIndex === values.length ? -1 : nextValueIndex;

      input.value = values[nextValueIndex];
      inputText.value = textValues[nextValueIndex];

      if (nextValueIndex === -1) {
        input.value = nextValueIndex.toString();
        inputText.value = 'Нет';
      }

      CharacterCreatorUi.UpdateCharacter(form);
      return;
    }
    nextValueIndex = nextValueIndex <= -1 ? values.length - 1 : nextValueIndex;
    nextValueIndex = nextValueIndex === values.length ? 0 : nextValueIndex;

    input.value = values[nextValueIndex];
    inputText.value = textValues[nextValueIndex];

    if (inputName === 'gender') {
      CharacterCreatorUi.character.gender = !CharacterCreatorUi.character.gender;
      CharacterCreatorUi.ChangeGender();
    }

    CharacterCreatorUi.UpdateCharacter(form);
  }


  private static ChangeGender() {
    const formHair = document.querySelector('form#formHair') as HTMLFormElement;
    const formClothes = document.querySelector('form#formClothes') as HTMLFormElement;

    CharacterCreatorUi.ResetForm(formHair);

    const genderNumber = CharacterCreatorUi.character.gender ? 1 : 0;
    const inputs = formClothes.querySelectorAll('input[style*="display: none;"]');

    inputs.forEach((i) => {
      const inputName = i.getAttribute('name') as string;
      const values = CharacterCreatorData.GetValuesByInputName(inputName, genderNumber);
      (i as HTMLInputElement).defaultValue = values[0];
    });

    CharacterCreatorUi.ResetForm(formClothes);

    CharacterCreatorUi.characterJSON = JSON.stringify(CharacterCreatorUi.character);
    mp.events.call(LocalEvents.CharacterCreatorChangeGender, CharacterCreatorUi.characterJSON);
  }

  private static UpdateCharacterFromMain(form: HTMLFormElement): void {
    const formData = new FormData(form);

    CharacterCreatorUi.character.firstName = formData.get('firstName') as string;
    CharacterCreatorUi.character.lastName = formData.get('lastName') as string;

    CharacterCreatorUi.character.gender = formData.get('gender') === 'true' as string;

    const rawFather = formData.get('father') as string;
    CharacterCreatorUi.character.father = Number.parseInt(rawFather);

    const rawMother = formData.get('mother') as string;
    CharacterCreatorUi.character.mother = Number.parseInt(rawMother);

    const rawShapeMix = formData.get('heredity') as string;
    CharacterCreatorUi.character.shapeMix = Number.parseFloat(rawShapeMix);

    const rawSkinMix = formData.get('skinTone') as string;
    CharacterCreatorUi.character.skinMix = Number.parseFloat(rawSkinMix);

    CharacterCreatorUi.characterJSON = JSON.stringify(CharacterCreatorUi.character);
    mp.events.call(LocalEvents.CharacterCreatorUpdateMain, CharacterCreatorUi.characterJSON);
  }

  private static UpdateCharacterFromClothes(form: HTMLFormElement): void {
    const formData = new FormData(form);

    const rawTop = formData.get('top') as string;
    CharacterCreatorUi.character.top = Number.parseInt(rawTop);

    const rawLegs = formData.get('legs') as string;
    CharacterCreatorUi.character.legs = Number.parseInt(rawLegs);

    const rawShoes = formData.get('shoes') as string;
    CharacterCreatorUi.character.shoes = Number.parseInt(rawShoes);

    CharacterCreatorUi.characterJSON = JSON.stringify(CharacterCreatorUi.character);
    mp.events.call(LocalEvents.CharacterCreatorUpdateClothes, CharacterCreatorUi.characterJSON);
  }

  private static UpdateCharacterFromFace(form: HTMLFormElement): void {
    const formData = new FormData(form);

    const rawBlemishes = formData.get('blemishes') as string;
    CharacterCreatorUi.character.blemishes = Number.parseInt(rawBlemishes);

    const rawAgeing = formData.get('ageing') as string;
    CharacterCreatorUi.character.ageing = Number.parseInt(rawAgeing);

    const rawComplexion = formData.get('complexion') as string;
    CharacterCreatorUi.character.complexion = Number.parseInt(rawComplexion);

    const rawSunDamage = formData.get('sunDamage') as string;
    CharacterCreatorUi.character.sunDamage = Number.parseInt(rawSunDamage);

    const rawFreckles = formData.get('freckles') as string;
    CharacterCreatorUi.character.freckles = Number.parseInt(rawFreckles);

    const rawEyesColor = formData.get('eyesColor') as string;
    CharacterCreatorUi.character.eyesColor = Number.parseInt(rawEyesColor);

    const rawNoseWidth = formData.get('noseWidth') as string;
    CharacterCreatorUi.character.faceFeatures[0] = Number.parseFloat(rawNoseWidth);

    const rawNoseHeight = formData.get('noseHeight') as string;
    CharacterCreatorUi.character.faceFeatures[1] = Number.parseFloat(rawNoseHeight);

    const noseLength = formData.get('noseLength') as string;
    CharacterCreatorUi.character.faceFeatures[2] = Number.parseFloat(noseLength);

    const noseBridge = formData.get('noseBridge') as string;
    CharacterCreatorUi.character.faceFeatures[3] = Number.parseFloat(noseBridge);

    const noseTip = formData.get('noseTip') as string;
    CharacterCreatorUi.character.faceFeatures[4] = Number.parseFloat(noseTip);

    const noseBridgeShift = formData.get('noseBridgeShift') as string;
    CharacterCreatorUi.character.faceFeatures[5] = Number.parseFloat(noseBridgeShift);

    const rawEyeBrowsHeight = formData.get('eyeBrowsHeight') as string;
    CharacterCreatorUi.character.faceFeatures[6] = Number.parseFloat(rawEyeBrowsHeight);

    const rawEyeBrowsWidth = formData.get('eyeBrowsWidth') as string;
    CharacterCreatorUi.character.faceFeatures[7] = Number.parseFloat(rawEyeBrowsWidth);

    const rawCheekBoneHeight = formData.get('cheekBoneHeight') as string;
    CharacterCreatorUi.character.faceFeatures[8] = Number.parseFloat(rawCheekBoneHeight);

    const rawCheekBoneWidth = formData.get('cheekBoneWidth') as string;
    CharacterCreatorUi.character.faceFeatures[9] = Number.parseFloat(rawCheekBoneWidth);

    const rawCheeksWidth = formData.get('cheeksWidth') as string;
    CharacterCreatorUi.character.faceFeatures[10] = Number.parseFloat(rawCheeksWidth);

    const rawEyesSize = formData.get('eyesSize') as string;
    CharacterCreatorUi.character.faceFeatures[11] = Number.parseFloat(rawEyesSize);

    const rawLipsSize = formData.get('lipsSize') as string;
    CharacterCreatorUi.character.faceFeatures[12] = Number.parseFloat(rawLipsSize);

    const rawJawHeight = formData.get('jawHeight') as string;
    CharacterCreatorUi.character.faceFeatures[13] = Number.parseFloat(rawJawHeight);

    const rawJawWidth = formData.get('jawWidth') as string;
    CharacterCreatorUi.character.faceFeatures[14] = Number.parseFloat(rawJawWidth);

    const rawChinLength = formData.get('chinLength') as string;
    CharacterCreatorUi.character.faceFeatures[15] = Number.parseFloat(rawChinLength);

    const rawChinPos = formData.get('chinPos') as string;
    CharacterCreatorUi.character.faceFeatures[16] = Number.parseFloat(rawChinPos);

    const rawChinWidth = formData.get('chinWidth') as string;
    CharacterCreatorUi.character.faceFeatures[17] = Number.parseFloat(rawChinWidth);

    const rawChinShape = formData.get('chinShape') as string;
    CharacterCreatorUi.character.faceFeatures[18] = Number.parseFloat(rawChinShape);

    const rawNeckWidth = formData.get('neckWidth') as string;
    CharacterCreatorUi.character.faceFeatures[19] = Number.parseFloat(rawNeckWidth);

    CharacterCreatorUi.characterJSON = JSON.stringify(CharacterCreatorUi.character);
    mp.events.call(LocalEvents.CharacterCreatorUpdateFace, CharacterCreatorUi.characterJSON);
  }

  private static UpdateCharacterFromHair(form: HTMLFormElement): void {
    const formData = new FormData(form);

    const rawHair = formData.get('hair') as string;
    CharacterCreatorUi.character.hair = Number.parseInt(rawHair);

    const rawHairColor = formData.get('hairColor') as string;
    CharacterCreatorUi.character.hairColor = Number.parseInt(rawHairColor);

    const rawHairHighLight = formData.get('hairHighLight') as string;
    CharacterCreatorUi.character.hairHighLight = Number.parseInt(rawHairHighLight);

    const rawEyeBrows = formData.get('eyeBrows') as string;
    CharacterCreatorUi.character.eyeBrows = Number.parseInt(rawEyeBrows);

    const rawEyeBrowsColor = formData.get('eyeBrowsColor') as string;
    CharacterCreatorUi.character.eyeBrowsColor = Number.parseInt(rawEyeBrowsColor);

    const rawEyeBrowsSecondaryColor = formData.get('eyeBrowsSecondaryColor') as string;
    CharacterCreatorUi.character.eyeBrowsSecondaryColor = Number.parseInt(rawEyeBrowsSecondaryColor);

    const rawBeard = formData.get('beard') as string;
    CharacterCreatorUi.character.beard = Number.parseInt(rawBeard);

    const rawBeardColor = formData.get('beardColor') as string;
    CharacterCreatorUi.character.beardColor = Number.parseInt(rawBeardColor);

    const rawBeardSecondaryColor = formData.get('beardSecondaryColor') as string;
    CharacterCreatorUi.character.beardSecondaryColor = Number.parseInt(rawBeardSecondaryColor);

    const rawChestHair = formData.get('chestHair') as string;
    CharacterCreatorUi.character.chestHair = Number.parseInt(rawChestHair);

    const rawChestHairColor = formData.get('chestHairColor') as string;
    CharacterCreatorUi.character.chestHairColor = Number.parseInt(rawChestHairColor);

    const rawChestHairSecondaryColor = formData.get('chestHairSecondaryColor') as string;
    CharacterCreatorUi.character.chestHairSecondaryColor = Number.parseInt(rawChestHairSecondaryColor);

    CharacterCreatorUi.characterJSON = JSON.stringify(CharacterCreatorUi.character);
    mp.events.call(LocalEvents.CharacterCreatorUpdateHair, CharacterCreatorUi.characterJSON);
  }

  public static UpdateCharacter(form: HTMLFormElement): void {
    switch (form.id) {
      case 'formMain':
        CharacterCreatorUi.UpdateCharacterFromMain(form);
        break;
      case 'formClothes':
        CharacterCreatorUi.UpdateCharacterFromClothes(form);
        break;
      case 'formFace':
        CharacterCreatorUi.UpdateCharacterFromFace(form);
        break;
      case 'formHair':
        CharacterCreatorUi.UpdateCharacterFromHair(form);
        break;
    }
  }

  private static RandomForm(form: HTMLFormElement): void {
    const rangeInputs = form.querySelectorAll('input[type=range]') as NodeListOf<HTMLInputElement>;
    rangeInputs.forEach((ri) => {
      const rawMin = ri.getAttribute('min') as string;
      const rawMax = ri.getAttribute('max') as string;

      const min = Number.parseFloat(rawMin);
      const max = Number.parseFloat(rawMax);
      const fraction = 2;

      const rawValue = Math.random() * (max - min + 1) + min;
      const value = rawValue.toFixed(fraction);

      ri.value = value;
    });

    const textInputs = form.querySelectorAll('input[type=text]:disabled') as NodeListOf<HTMLInputElement>;
    textInputs.forEach((ti) => {
      const inputName = ti.name.replace('Text', '');

      const input = form.querySelector(`input[name=${inputName}]`) as HTMLInputElement;
      let genderNumber = CharacterCreatorUi.character.gender ? 1 : 0;

      let values;
      let textValues;
      if (inputName === 'hair' || form.id === 'formClothes') {
        values = CharacterCreatorData.GetValuesByInputName(inputName, genderNumber);
        textValues = CharacterCreatorData.GetTextsByInputName(inputName, genderNumber);
      }
      else {
        values = CharacterCreatorData.GetValuesByInputName(inputName);
        textValues = CharacterCreatorData.GetTextsByInputName(inputName);
      }

      let nextValueIndex = Math.floor(Math.random() * ((values.length - 1) - 0 + 1) + 0);

      input.value = values[nextValueIndex];
      ti.value = textValues[nextValueIndex];

      if (input.name === 'gender') {
        if (input.value === 'false') {
          CharacterCreatorUi.character.gender = false;
          console.log(CharacterCreatorUi.character.gender);
          CharacterCreatorUi.ChangeGender();
          return;
        }
        CharacterCreatorUi.character.gender = true;
        console.log(CharacterCreatorUi.character.gender);
        CharacterCreatorUi.ChangeGender();
      }
    });
  }

  private static ResetForm(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll('input');
    inputs.forEach((i) => i.value = i.defaultValue);

    CharacterCreatorUi.UpdateCharacter(form);
  }

  private static Create(): void {
    console.log("Не работает");
    const forms = document.querySelectorAll('form') as NodeListOf<HTMLFormElement>;
    forms.forEach((f) => CharacterCreatorUi.UpdateCharacter(f));

    CharacterCreatorUi.characterJSON = JSON.stringify(CharacterCreatorUi.character);
    mp.events.call(LocalEvents.CharacterCreatorCreate, CharacterCreatorUi.characterJSON);
  }
};

CharacterCreatorUi.Start();