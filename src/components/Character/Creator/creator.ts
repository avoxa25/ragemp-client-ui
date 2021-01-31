import { LocalEvent } from '../../../models/enums/events/local-event';
import { CharacterCreatorModel } from '../../../models/view-models/character-creator-model';
import { CharacterCreatorData } from '../../../models/static/character-creator-data';

class CharacterCreatorUi {
  private character: CharacterCreatorModel;
  private readonly errorTextElement: HTMLElement;

  constructor() {
    this.character = new CharacterCreatorModel();
    this.errorTextElement = document.getElementById('creatorError') as HTMLElement;

    this.StartTabs();

    this.StartMain();
    this.StartClothes();
    this.StartFace();
    this.StartHair();
  }

  public ShowErrorMessage(message: string): void {
    this.errorTextElement.innerHTML += `${message}<br>`;
    this.errorTextElement.hidden = false;
  }

  private StartTabs(): void {
    const tabLinks = document.querySelectorAll('button.tabLinks');
    const subTabLinks = document.querySelectorAll('button.subTabLinks');
    tabLinks.forEach((tl) => {
      const tabId = tl.getAttribute('data-tab') as string;
      tl.addEventListener('click', () => this.OpenTab(tabId, tl.id));
    });
    subTabLinks.forEach((stl) => {
      const tabId = stl.getAttribute('data-tab') as string;
      stl.addEventListener('click', () => this.OpenSubTab(tabId, stl.id));
    });
  }

  private OpenTab(selectedTabId: string, selectedTabLinkId: string): void {
    const tabs = document.getElementsByClassName('parameters') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabs.length; i++) {
      const isSelectedTab = tabs[i].id === selectedTabId;
      if (isSelectedTab) {
        tabs[i].classList.add('active')
      } else {
        tabs[i].classList.remove('active');
      };
    }

    const tabLinks = document.getElementsByClassName('tabLinks') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < tabLinks.length; i++) {
      const isSelectedTabLink = tabLinks[i].id === selectedTabLinkId;
      if (isSelectedTabLink) {
        tabLinks[i].classList.add('active');
      } else {
        tabLinks[i].classList.remove('active');
      }
    }

    const characterJson = JSON.stringify(this.character);
    if (selectedTabId === 'tabHair') mp.events.call(LocalEvent.CharacterCreatorTabHair, true, characterJson);
    else mp.events.call(LocalEvent.CharacterCreatorTabHair, false, characterJson);
  }

  private OpenSubTab(selectedTabId: string, selectedTabLinkId: string): void {
    const subTabs = document.getElementsByClassName('subTab') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < subTabs.length; i++) {
      const isSelectedTab = subTabs[i].id === selectedTabId;
      if (isSelectedTab) {
        subTabs[i].classList.add('active')
      } else {
        subTabs[i].classList.remove('active');
      };
    }

    const subTabLinks = document.getElementsByClassName('subTabLinks') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < subTabLinks.length; i++) {
      const isSelectedTabLink = subTabLinks[i].id === selectedTabLinkId;
      if (isSelectedTabLink) {
        subTabLinks[i].classList.add('active');
      } else {
        subTabLinks[i].classList.remove('active');
      }
    }
  }

  private StartMain(): void {
    const form = document.querySelector('form#formMain') as HTMLFormElement;
    const randomButton = form.querySelector('button[name=random]') as HTMLButtonElement;

    form.addEventListener('submit', () => this.Create());
    form.addEventListener('reset', () => {
      this.ResetForm(form);
      this.UpdateCharacterFromMain(form);
    });
    randomButton.addEventListener('click', () => {
      this.RandomForm(form);
      this.UpdateCharacterFromMain(form);
    });

    const inputButtons = form.querySelectorAll('button[data-input-name]');
    inputButtons.forEach((ib) => ib.addEventListener('click', () => this.StartInputButtons(form, ib)));

    const inputs = form.querySelectorAll('input:not([style*="display: none;"])');
    inputs.forEach((i) => i.addEventListener('change', () => this.UpdateCharacterFromMain(form)));
  }

  private StartClothes(): void {
    const form = document.querySelector('form#formClothes') as HTMLFormElement;
    const randomButton = form.querySelector('button[name=random]') as HTMLButtonElement;

    form.addEventListener('submit', () => this.Create());
    form.addEventListener('reset', () => {
      this.ResetForm(form);
      this.UpdateCharacterFromClothes(form);
    });
    randomButton.addEventListener('click', () => {
      this.RandomForm(form);
      this.UpdateCharacterFromClothes(form);
    });

    const inputButtons = form.querySelectorAll('button[data-input-name]');
    inputButtons.forEach((ib) => ib.addEventListener('click', () => this.StartInputButtons(form, ib)));

    const inputs = form.querySelectorAll('input:not([style*="display: none;"])');
    inputs.forEach((i) => i.addEventListener('change', () => this.UpdateCharacterFromClothes(form)));
  }

  private StartFace(): void {
    const form = document.querySelector('form#formFace') as HTMLFormElement;
    const randomButton = form.querySelector('button[name=random]') as HTMLButtonElement;

    form.addEventListener('submit', () => this.Create());
    form.addEventListener('reset', () => {
      this.ResetForm(form);
      this.UpdateCharacterFromFace(form);
    });
    randomButton.addEventListener('click', () => {
      this.RandomForm(form);
      this.UpdateCharacterFromFace(form);
    });

    const inputButtons = form.querySelectorAll('button[data-input-name]');
    inputButtons.forEach((ib) => ib.addEventListener('click', () => this.StartInputButtons(form, ib)));

    const inputs = form.querySelectorAll('input:not([style*="display: none;"])');
    inputs.forEach((i) => i.addEventListener('change', () => this.UpdateCharacterFromFace(form)));
  }

  private StartHair(): void {
    const form = document.querySelector('form#formHair') as HTMLFormElement;
    const randomButton = form.querySelector('button[name=random]') as HTMLButtonElement;

    form.addEventListener('submit', () => this.Create());
    form.addEventListener('reset', () => {
      this.ResetForm(form);
      this.UpdateCharacterFromHair(form);
    });
    randomButton.addEventListener('click', () => {
      this.RandomForm(form);
      this.UpdateCharacterFromHair(form);
    });

    const inputButtons = form.querySelectorAll('button[data-input-name]');
    inputButtons.forEach((ib) => ib.addEventListener('click', () => {
      this.StartInputButtons(form, ib);
    }));

    const inputs = form.querySelectorAll('input:not([style*="display: none;"])');
    inputs.forEach((i) => i.addEventListener('change', () => this.UpdateCharacterFromHair(form)));
  }

  private StartInputButtons(form: HTMLFormElement, inputButton: Element): void {
    const inputName = inputButton.getAttribute('data-input-name') as string;
    const rawInputValueCycle = inputButton.getAttribute('data-input-value-cycle') as string;
    const inputValueCycle = Number.parseInt(rawInputValueCycle);
    const genderNumber = this.character.gender ? 1 : 0;

    const input = form.querySelector(`input[name=${inputName}]`) as HTMLInputElement;
    const inputText = form.querySelector(`input[name=${inputName}Text]`) as HTMLInputElement;

    const values = CharacterCreatorData.GetValuesByInputName(inputName, genderNumber);
    const textValues = CharacterCreatorData.GetTextsByInputName(inputName, genderNumber);

    const currentValueIndex = values.indexOf(input.value);
    let nextValueIndex = currentValueIndex + inputValueCycle;
    if (form.id === 'formHair' && inputName !== 'hair' || form.id === 'formFace' && inputName !== 'eyesColor') {
      nextValueIndex = nextValueIndex <= -2 ? values.length - 1 : nextValueIndex;
      nextValueIndex = nextValueIndex === values.length + 1 ? 0 : nextValueIndex;
      nextValueIndex = nextValueIndex === values.length ? -1 : nextValueIndex;
    } else {
      nextValueIndex = nextValueIndex <= -1 ? values.length - 1 : nextValueIndex;
      nextValueIndex = nextValueIndex === values.length ? 0 : nextValueIndex;
    }

    input.value = values[nextValueIndex];
    inputText.value = textValues[nextValueIndex];

    if (nextValueIndex === -1) {
      input.value = nextValueIndex.toString();
      inputText.value = 'Нет';
    }

    if (inputName === 'gender') {
      this.character.gender = !this.character.gender;
      this.ChangeGender();
    }

    this.UpdateCharacter(form);
  }


  private ChangeGender(): void {
    const formHair = document.querySelector('form#formHair') as HTMLFormElement;
    const formClothes = document.querySelector('form#formClothes') as HTMLFormElement;

    this.ResetForm(formHair);

    const genderNumber = this.character.gender ? 1 : 0;
    const inputs = formClothes.querySelectorAll('input[style*="display: none;"]');

    inputs.forEach((i) => {
      const inputName = i.getAttribute('name') as string;
      const values = CharacterCreatorData.GetValuesByInputName(inputName, genderNumber);
      (i as HTMLInputElement).defaultValue = values[0];
    });

    this.ResetForm(formClothes);

    const characterJson = JSON.stringify(this.character);
    mp.events.call(LocalEvent.CharacterCreatorChangeGender, characterJson);
  }

  private UpdateCharacterFromMain(form: HTMLFormElement): void {
    const formData = new FormData(form);

    this.character.firstName = formData.get('firstName') as string;
    this.character.lastName = formData.get('lastName') as string;

    this.character.gender = formData.get('gender') === 'true' as string;

    const rawFather = formData.get('father') as string;
    this.character.father = Number.parseInt(rawFather);

    const rawMother = formData.get('mother') as string;
    this.character.mother = Number.parseInt(rawMother);

    const rawShapeMix = formData.get('heredity') as string;
    this.character.shapeMix = Number.parseFloat(rawShapeMix);

    const rawSkinMix = formData.get('skinTone') as string;
    this.character.skinMix = Number.parseFloat(rawSkinMix);

    const characterJson = JSON.stringify(this.character);
    mp.events.call(LocalEvent.CharacterCreatorUpdateMain, characterJson);
  }

  private UpdateCharacterFromClothes(form: HTMLFormElement): void {
    const formData = new FormData(form);

    const rawTop = formData.get('top') as string;
    this.character.top = Number.parseInt(rawTop);

    const rawLegs = formData.get('legs') as string;
    this.character.legs = Number.parseInt(rawLegs);

    const rawShoes = formData.get('shoes') as string;
    this.character.shoes = Number.parseInt(rawShoes);

    const characterJson = JSON.stringify(this.character);
    mp.events.call(LocalEvent.CharacterCreatorUpdateClothes, characterJson);
  }

  private UpdateCharacterFromFace(form: HTMLFormElement): void {
    const formData = new FormData(form);

    const rawBlemishes = formData.get('blemishes') as string;
    this.character.blemishes = Number.parseInt(rawBlemishes);

    const rawAgeing = formData.get('ageing') as string;
    this.character.ageing = Number.parseInt(rawAgeing);

    const rawComplexion = formData.get('complexion') as string;
    this.character.complexion = Number.parseInt(rawComplexion);

    const rawSunDamage = formData.get('sunDamage') as string;
    this.character.sunDamage = Number.parseInt(rawSunDamage);

    const rawFreckles = formData.get('freckles') as string;
    this.character.freckles = Number.parseInt(rawFreckles);

    const rawEyesColor = formData.get('eyesColor') as string;
    this.character.eyesColor = Number.parseInt(rawEyesColor);

    const rawNoseWidth = formData.get('noseWidth') as string;
    this.character.faceFeatures[0] = Number.parseFloat(rawNoseWidth);

    const rawNoseHeight = formData.get('noseHeight') as string;
    this.character.faceFeatures[1] = Number.parseFloat(rawNoseHeight);

    const noseLength = formData.get('noseLength') as string;
    this.character.faceFeatures[2] = Number.parseFloat(noseLength);

    const noseBridge = formData.get('noseBridge') as string;
    this.character.faceFeatures[3] = Number.parseFloat(noseBridge);

    const noseTip = formData.get('noseTip') as string;
    this.character.faceFeatures[4] = Number.parseFloat(noseTip);

    const noseBridgeShift = formData.get('noseBridgeShift') as string;
    this.character.faceFeatures[5] = Number.parseFloat(noseBridgeShift);

    const rawEyeBrowsHeight = formData.get('eyeBrowsHeight') as string;
    this.character.faceFeatures[6] = Number.parseFloat(rawEyeBrowsHeight);

    const rawEyeBrowsWidth = formData.get('eyeBrowsWidth') as string;
    this.character.faceFeatures[7] = Number.parseFloat(rawEyeBrowsWidth);

    const rawCheekBoneHeight = formData.get('cheekBoneHeight') as string;
    this.character.faceFeatures[8] = Number.parseFloat(rawCheekBoneHeight);

    const rawCheekBoneWidth = formData.get('cheekBoneWidth') as string;
    this.character.faceFeatures[9] = Number.parseFloat(rawCheekBoneWidth);

    const rawCheeksWidth = formData.get('cheeksWidth') as string;
    this.character.faceFeatures[10] = Number.parseFloat(rawCheeksWidth);

    const rawEyesSize = formData.get('eyesSize') as string;
    this.character.faceFeatures[11] = Number.parseFloat(rawEyesSize);

    const rawLipsSize = formData.get('lipsSize') as string;
    this.character.faceFeatures[12] = Number.parseFloat(rawLipsSize);

    const rawJawHeight = formData.get('jawHeight') as string;
    this.character.faceFeatures[13] = Number.parseFloat(rawJawHeight);

    const rawJawWidth = formData.get('jawWidth') as string;
    this.character.faceFeatures[14] = Number.parseFloat(rawJawWidth);

    const rawChinLength = formData.get('chinLength') as string;
    this.character.faceFeatures[15] = Number.parseFloat(rawChinLength);

    const rawChinPos = formData.get('chinPos') as string;
    this.character.faceFeatures[16] = Number.parseFloat(rawChinPos);

    const rawChinWidth = formData.get('chinWidth') as string;
    this.character.faceFeatures[17] = Number.parseFloat(rawChinWidth);

    const rawChinShape = formData.get('chinShape') as string;
    this.character.faceFeatures[18] = Number.parseFloat(rawChinShape);

    const rawNeckWidth = formData.get('neckWidth') as string;
    this.character.faceFeatures[19] = Number.parseFloat(rawNeckWidth);

    const characterJson = JSON.stringify(this.character);
    mp.events.call(LocalEvent.CharacterCreatorUpdateFace, characterJson);
  }

  private UpdateCharacterFromHair(form: HTMLFormElement): void {
    const formData = new FormData(form);

    const rawHair = formData.get('hair') as string;
    this.character.hair = Number.parseInt(rawHair);

    const rawHairColor = formData.get('hairColor') as string;
    this.character.hairColor = Number.parseInt(rawHairColor);

    const rawHairHighLight = formData.get('hairHighLight') as string;
    this.character.hairHighLight = Number.parseInt(rawHairHighLight);

    const rawEyeBrows = formData.get('eyeBrows') as string;
    this.character.eyeBrows = Number.parseInt(rawEyeBrows);

    const rawEyeBrowsColor = formData.get('eyeBrowsColor') as string;
    this.character.eyeBrowsColor = Number.parseInt(rawEyeBrowsColor);

    const rawEyeBrowsSecondaryColor = formData.get('eyeBrowsSecondaryColor') as string;
    this.character.eyeBrowsSecondaryColor = Number.parseInt(rawEyeBrowsSecondaryColor);

    const rawBeard = formData.get('beard') as string;
    this.character.facialHair = Number.parseInt(rawBeard);

    const rawBeardColor = formData.get('beardColor') as string;
    this.character.facialHairColor = Number.parseInt(rawBeardColor);

    const rawBeardSecondaryColor = formData.get('beardSecondaryColor') as string;
    this.character.facialHairSecondaryColor = Number.parseInt(rawBeardSecondaryColor);

    const rawChestHair = formData.get('chestHair') as string;
    this.character.chestHair = Number.parseInt(rawChestHair);

    const rawChestHairColor = formData.get('chestHairColor') as string;
    this.character.chestHairColor = Number.parseInt(rawChestHairColor);

    const rawChestHairSecondaryColor = formData.get('chestHairSecondaryColor') as string;
    this.character.chestHairSecondaryColor = Number.parseInt(rawChestHairSecondaryColor);

    const characterJson = JSON.stringify(this.character);
    mp.events.call(LocalEvent.CharacterCreatorUpdateHair, characterJson);
  }

  public UpdateCharacter(form: HTMLFormElement): void {
    switch (form.id) {
      case 'formMain':
        this.UpdateCharacterFromMain(form);
        break;
      case 'formClothes':
        this.UpdateCharacterFromClothes(form);
        break;
      case 'formFace':
        this.UpdateCharacterFromFace(form);
        break;
      case 'formHair':
        this.UpdateCharacterFromHair(form);
        break;
    }
  }

  private RandomForm(form: HTMLFormElement): void {
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
      const genderNumber = this.character.gender ? 1 : 0;

      const values = CharacterCreatorData.GetValuesByInputName(inputName, genderNumber);
      const textValues = CharacterCreatorData.GetTextsByInputName(inputName, genderNumber);

      let nextValueIndex = Math.floor(Math.random() * ((values.length - 1) - 0 + 1) + 0);

      input.value = values[nextValueIndex];
      ti.value = textValues[nextValueIndex];

      if (input.name === 'gender') {
        if (input.value === 'false') {
          this.character.gender = false;
          this.ChangeGender();
        } else {
          this.character.gender = true;
          this.ChangeGender();
        }
      }
    });
  }

  private ResetForm(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll('input');
    inputs.forEach((i) => i.value = i.defaultValue);

    this.UpdateCharacter(form);
  }

  private Create(): void {
    this.errorTextElement.innerHTML = '';
    const forms = document.querySelectorAll('form') as NodeListOf<HTMLFormElement>;
    forms.forEach((f) => this.UpdateCharacter(f));

    const characterJson = JSON.stringify(this.character);
    mp.events.call(LocalEvent.CharacterCreatorCreate, characterJson);
  }
}

const characterCreatorUi = new CharacterCreatorUi();
(window as any).characterCreatorUi = characterCreatorUi;