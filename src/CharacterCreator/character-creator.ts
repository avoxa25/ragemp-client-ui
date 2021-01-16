//import { LocalEvents } from '../Constants/localEvents';
import { Character } from './character';
import { CharacterCreatorData } from './character-creator-data';

abstract class CharacterCreatorUi {
  private static character: Character;

  public static Start(): void {
    CharacterCreatorUi.character = new Character();

    CharacterCreatorUi.StartTabs();

    CharacterCreatorUi.StartMain();
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
    const randomButton = form.querySelector('button[type=random]');

    form.addEventListener('submit', () => CharacterCreatorUi.Create());
    form.addEventListener('reset', () => 
    {
      CharacterCreatorUi.ResetForm(form);
      CharacterCreatorUi.UpdateCharacterFromMain(form);
    });
    randomButton?.addEventListener('click', () => CharacterCreatorUi.RandomForm(form));

    const inputButtons = form.querySelectorAll('button[data-input-name]');
    inputButtons.forEach((ib) => ib.addEventListener('click', () => CharacterCreatorUi.StartInputButtons(form, ib)));

    const inputs = form.querySelectorAll('input:not([style*="display: none;"])');
    inputs.forEach((i) => i.addEventListener('change', () => CharacterCreatorUi.UpdateCharacterFromMain(form)));
  }

  private static StartInputButtons(form: HTMLFormElement, inputButton: Element): void {
    const inputName = inputButton.getAttribute('data-input-name') as string;
    const rawInputValueCycle = inputButton.getAttribute('data-input-value-cycle') as string;
    const inputValueCycle = Number.parseInt(rawInputValueCycle);

    const input = form.querySelector(`input[name=${inputName}]`) as HTMLInputElement;
    const inputText = form.querySelector(`input[name=${inputName}Text]`) as HTMLInputElement;

    const values = CharacterCreatorData.GetValuesByInputName(inputName);
    const textValues = CharacterCreatorData.GetTextsByInputName(inputName);

    const currentValueIndex = values.indexOf(input.value);
    let nextValueIndex = currentValueIndex + inputValueCycle;
    nextValueIndex = nextValueIndex === -1 ? values.length - 1 : nextValueIndex;
    nextValueIndex = nextValueIndex === values.length ? 0 : nextValueIndex;

    input.value = values[nextValueIndex];
    inputText.value = textValues[nextValueIndex];
  }

  private static ResetForm(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll('input');
    inputs.forEach((i) => i.value = i.defaultValue);
  }

  private static UpdateCharacterFromMain(form: HTMLFormElement): void {
    const formData = new FormData(form);

    CharacterCreatorUi.character.firstName = formData.get('firstName') as string;
    CharacterCreatorUi.character.lastName = formData.get('lastName') as string;

    CharacterCreatorUi.character.gender = formData.get('gender') === 'true';

    const rawFather = formData.get('father') as string;
    CharacterCreatorUi.character.father = Number.parseInt(rawFather);

    const rawMother = formData.get('mother') as string;
    CharacterCreatorUi.character.mother = Number.parseInt(rawMother);

    const rawShapeMix = formData.get('heredity') as string;
    CharacterCreatorUi.character.shapeMix = Number.parseFloat(rawShapeMix);

    const rawSkinMix = formData.get('skinTone') as string;
    CharacterCreatorUi.character.skinMix = Number.parseFloat(rawSkinMix);
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

      const values = CharacterCreatorData.GetValuesByInputName(inputName);
      const textValues = CharacterCreatorData.GetTextsByInputName(inputName);

      let nextValueIndex = Math.floor(Math.random() * ((values.length - 1) - 0 + 1) + 0);

      input.value = values[nextValueIndex];
      ti.value = textValues[nextValueIndex];
    });
    CharacterCreatorUi.UpdateCharacterFromMain(form);
  }

  private static Create(): void {
    console.log(CharacterCreatorUi.character);
    //mp.events.call(LocalEvents.CharacterCreatorCreateClose, CharacterCreatorUi.character);
  }
};

CharacterCreatorUi.Start();

/*
const blemishes = ['Measles', 'Pimples', 'Spots', 'Break Out', 'Blackheads', 'Build Up', 'Pustules', 'Zits', 'Full Acne', 'Acne', 'Cheek Rash', 'Face Rash', 'Picker', 'Puberty', 'Eyesore', 'Chin Rash', 'Two Face', 'T Zone', 'Greasy', 'Marked', 'Acne Scarring', 'Full Acne Scarring', 'Cold Sores', 'Impetigo'];
const facialHair = ['Light Stubble', 'Бальбо', 'Circle Beard', 'Goatee', 'Chin', 'Chin Fuzz', 'Pencil Chin Strap', 'Scruffy', 'Musketeer', 'Mustache', 'Trimmed Beard', 'Stubble', 'Thin Circle Beard', 'Horseshoe', 'Pencil and 'Chops', 'Chin Strap Beard', 'Balbo and Sideburns', 'Mutton Chops', 'Scruffy Beard', 'Curly', 'Curly & Deep Stranger', 'Handlebar', 'Faustic', 'Otto & Patch', 'Otto & Full Stranger', 'Light Franz', 'The Hampstead', 'The Ambrose', 'Lincoln Curtain'];
const eyeBrows = ['Balanced', 'Fashion', 'Cleopatra', 'Quizzical', 'Femme', 'Seductive', 'Pinched', 'Chola', 'Triomphe', 'Carefree', 'Curvaceous', 'Rodent', 'Double Tram', 'Thin', 'Penciled', 'Mother Plucker', 'Straight and Narrow', 'Natural', 'Fuzzy', 'Unkempt', 'Caterpillar', 'Regular', 'Mediterranean', 'Groomed', 'Bushels', 'Feathered', 'Prickly', 'Monobrow', 'Winged', 'Triple Tram', 'Arched Tram', 'Cutouts', 'Fade Away', 'Solo Tram'];
const ageing = ['Crow's Feet', 'First Signs', 'Middle Aged', 'Worry Lines', 'Depression', 'Distinguished', 'Aged', 'Weathered', 'Wrinkled', 'Sagging', 'Tough Life', 'Vintage', 'Retired', 'Junkie', 'Geriatric'];
const complexion = ['Rosy Cheeks', 'Stubble Rash', 'Hot Flush', 'Sunburn', 'Bruised', 'Alchoholic', 'Patchy', 'Totem', 'Blood Vessels', 'Damaged', 'Pale', 'Ghostly'];
const sunDamage = ['Uneven', 'Sandpaper', 'Patchy', 'Rough', 'Leathery', 'Textured', 'Coarse', 'Rugged', 'Creased', 'Cracked', 'Gritty'];
const freckles = ['Cherub', 'All Over', 'Irregular', 'Dot Dash', 'Over the Bridge', 'Baby Doll', 'Pixie', 'Sun Kissed', 'Beauty Marks', 'Line Up', 'Modelesque', 'Occasional', 'Speckled', 'Rain Drops', 'Double Dip', 'One Sided', 'Pairs', 'Growth'];
const chestHair = ['Natural', 'The Strip', 'The Tree', 'Hairy', 'Grisly', 'Ape', 'Groomed Ape', 'Bikini', 'Lightning Bolt', 'Reverse Lightning', 'Love Heart', 'Chestache', 'Happy Face', 'Skull', 'Snail Trail', 'Slug and Nips', 'Hairy Arms'];

//Пятна, шрамы, возраст, цвет, веснушки, родинки //цвета сделать

const tops = [
  //female
  [{ ID: 45, Name: 'Кофта' }, { ID: 49, Name: 'Футболка' }, { ID: 26, Name: 'Блузка' }],
  //male
  [{ ID: 111, Name: 'Водолазка' }, { ID: 146, Name: 'Футболка' }, { ID: 241, Name: 'Рубашка Поло' }]
];
const legs = [
  //female
  [{ ID: 4, Name: 'Джинсы' }, { ID: 8, Name: 'Юбка' }, { ID: 25, Name: 'Шорты' }],
  //male
  [{ ID: 1, Name: 'Джинсы' }, { ID: 9, Name: 'Джоггеры' }, { ID: 6, Name: 'Шорты' }]
];
const shoes = [
  //female
  [{ ID: 3, Name: 'Кеды' }, { ID: 33, Name: 'Сникеры' }, { ID: 101, Name: 'Ботинки' }],
  //male
  [{ ID: 1, Name: 'Кеды' }, { ID: 26, Name: 'Сникеры' }, { ID: 97, Name: 'Ботинки' }]
];

const hairList = [
  // female
  [
    { ID: 0, Name: 'Close Shave', Collection: 'mpbeach_overlays', Overlay: 'FM_Hair_Fuzz' },
    { ID: 1, Name: 'Short', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_001' },
    { ID: 2, Name: 'Layered Bob', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_002' },
    { ID: 3, Name: 'Pigtails', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_003' },
    { ID: 4, Name: 'Ponytail', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_004' },
    { ID: 5, Name: 'Braided Mohawk', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_005' },
    { ID: 6, Name: 'Braids', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_006' },
    { ID: 7, Name: 'Bob', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_007' },
    { ID: 8, Name: 'Faux Hawk', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_008' },
    { ID: 9, Name: 'French Twist', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_009' },
    { ID: 10, Name: 'Long Bob', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_010' },
    { ID: 11, Name: 'Loose Tied', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_011' },
    { ID: 12, Name: 'Pixie', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_012' },
    { ID: 13, Name: 'Shaved Bangs', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_013' },
    { ID: 14, Name: 'Top Knot', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_014' },
    { ID: 15, Name: 'Wavy Bob', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_015' },
    { ID: 16, Name: 'Messy Bun', Collection: 'multiplayer_overlays', Overlay: 'NGBea_F_Hair_000' },
    { ID: 17, Name: 'Pin Up Girl', Collection: 'multiplayer_overlays', Overlay: 'NGBea_F_Hair_001' },
    { ID: 18, Name: 'Tight Bun', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_007' },
    { ID: 19, Name: 'Twisted Bob', Collection: 'multiplayer_overlays', Overlay: 'NGBus_F_Hair_000' },
    { ID: 20, Name: 'Flapper Bob', Collection: 'multiplayer_overlays', Overlay: 'NGBus_F_Hair_001' },
    { ID: 21, Name: 'Big Bangs', Collection: 'multiplayer_overlays', Overlay: 'NGBea_F_Hair_001' },
    { ID: 22, Name: 'Braided Top Knot', Collection: 'multiplayer_overlays', Overlay: 'NGHip_F_Hair_000' },
    { ID: 23, Name: 'Mullet', Collection: 'multiplayer_overlays', Overlay: 'NGInd_F_Hair_000' },
    { ID: 25, Name: 'Pinched Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_F_Hair_000' },
    { ID: 26, Name: 'Leaf Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_F_Hair_001' },
    { ID: 27, Name: 'Zig Zag Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_F_Hair_002' },
    { ID: 28, Name: 'Pigtail Bangs', Collection: 'mplowrider2_overlays', Overlay: 'LR_F_Hair_003' },
    { ID: 29, Name: 'Wave Braids', Collection: 'mplowrider2_overlays', Overlay: 'LR_F_Hair_003' },
    { ID: 30, Name: 'Coil Braids', Collection: 'mplowrider2_overlays', Overlay: 'LR_F_Hair_004' },
    { ID: 31, Name: 'Rolled Quiff', Collection: 'mplowrider2_overlays', Overlay: 'LR_F_Hair_006' },
    { ID: 32, Name: 'Loose Swept Back', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_000_F' },
    { ID: 33, Name: 'Undercut Swept Back', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_001_F' },
    { ID: 34, Name: 'Undercut Swept Side', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_002_F' },
    { ID: 35, Name: 'Spiked Mohawk', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_003_F' },
    { ID: 36, Name: 'Bandana and Braid', Collection: 'multiplayer_overlays', Overlay: 'NG_F_Hair_003' },
    { ID: 37, Name: 'Layered Mod', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_006_F' },
    { ID: 38, Name: 'Skinbyrd', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_004_F' },
    { ID: 76, Name: 'Neat Bun', Collection: 'mpgunrunning_overlays', Overlay: 'MP_Gunrunning_Hair_F_000_F' },
    { ID: 77, Name: 'Short Bob', Collection: 'mpgunrunning_overlays', Overlay: 'MP_Gunrunning_Hair_F_001_F' }
  ],
  // male
  [
    { ID: 0, Name: 'Close Shave', Collection: 'mpbeach_overlays', Overlay: 'FM_Hair_Fuzz' },
    { ID: 1, Name: 'Buzzcut', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_001' },
    { ID: 2, Name: 'Faux Hawk', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_002' },
    { ID: 3, Name: 'Hipster', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_003' },
    { ID: 4, Name: 'Side Parting', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_004' },
    { ID: 5, Name: 'Shorter Cut', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_005' },
    { ID: 6, Name: 'Biker', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_006' },
    { ID: 7, Name: 'Ponytail', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_007' },
    { ID: 8, Name: 'Cornrows', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_008' },
    { ID: 9, Name: 'Slicked', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_009' },
    { ID: 10, Name: 'Short Brushed', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_013' },
    { ID: 11, Name: 'Spikey', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_002' },
    { ID: 12, Name: 'Caesar', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_011' },
    { ID: 13, Name: 'Chopped', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_012' },
    { ID: 14, Name: 'Dreads', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_014' },
    { ID: 15, Name: 'Long Hair', Collection: 'multiplayer_overlays', Overlay: 'NG_M_Hair_015' },
    { ID: 16, Name: 'Shaggy Curls', Collection: 'multiplayer_overlays', Overlay: 'NGBea_M_Hair_000' },
    { ID: 17, Name: 'Surfer Dude', Collection: 'multiplayer_overlays', Overlay: 'NGBea_M_Hair_001' },
    { ID: 18, Name: 'Short Side Part', Collection: 'multiplayer_overlays', Overlay: 'NGBus_M_Hair_000' },
    { ID: 19, Name: 'High Slicked Sides', Collection: 'multiplayer_overlays', Overlay: 'NGBus_M_Hair_001' },
    { ID: 20, Name: 'Long Slicked', Collection: 'multiplayer_overlays', Overlay: 'NGHip_M_Hair_000' },
    { ID: 21, Name: 'Hipster Youth', Collection: 'multiplayer_overlays', Overlay: 'NGHip_M_Hair_001' },
    { ID: 22, Name: 'Mullet', Collection: 'multiplayer_overlays', Overlay: 'NGInd_M_Hair_000' },
    { ID: 24, Name: 'Classic Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_M_Hair_000' },
    { ID: 25, Name: 'Palm Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_M_Hair_001' },
    { ID: 26, Name: 'Lightning Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_M_Hair_002' },
    { ID: 27, Name: 'Whipped Cornrows', Collection: 'mplowrider_overlays', Overlay: 'LR_M_Hair_003' },
    { ID: 28, Name: 'Zig Zag Cornrows', Collection: 'mplowrider2_overlays', Overlay: 'LR_M_Hair_004' },
    { ID: 29, Name: 'Snail Cornrows', Collection: 'mplowrider2_overlays', Overlay: 'LR_M_Hair_005' },
    { ID: 30, Name: 'Hightop', Collection: 'mplowrider2_overlays', Overlay: 'LR_M_Hair_006' },
    { ID: 31, Name: 'Loose Swept Back', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_000_M' },
    { ID: 32, Name: 'Undercut Swept Back', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_001_M' },
    { ID: 33, Name: 'Undercut Swept Side', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_002_M' },
    { ID: 34, Name: 'Spiked Mohawk', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_003_M' },
    { ID: 35, Name: 'Mod', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_004_M' },
    { ID: 36, Name: 'Layered Mod', Collection: 'mpbiker_overlays', Overlay: 'MP_Biker_Hair_005_M' },
    { ID: 72, Name: 'Flattop', Collection: 'mpgunrunning_overlays', Overlay: 'MP_Gunrunning_Hair_M_000_M' },
    { ID: 73, Name: 'Military Buzzcut', Collection: 'mpgunrunning_overlays', Overlay: 'MP_Gunrunning_Hair_M_001_M' }
  ]
];

const eyeColors = ['Green', 'Emerald', 'Light Blue', 'Ocean Blue', 'Light Brown', 'Dark Brown', 'Hazel', 'Dark Gray', 'Light Gray', 'Pink', 'Yellow', 'Purple', 'Blackout', 'Shades of Gray', 'Tequila Sunrise', 'Atomic', 'Warp', 'ECola', 'Space Ranger', 'Ying Yang', 'Bullseye', 'Lizard', 'Dragon', 'Extra Terrestrial', 'Goat', 'Smiley', 'Possessed', 'Demon', 'Infected', 'Alien', 'Undead', 'Zombie'];

///////////////////////////////

//CREATOR MAIN
function changeGender() {
  switch (character.gender) {
    case 1:
      $('#char_gender').val('Женский');
      character.gender = 0;
      break;
    case 0:
      character.gender = 1;
      $('#char_gender').val('Мужской');
      break;
  }
  mp.trigger('changeGender', character.gender);
}

function changeFather(arrow) {
  let father = $('#char_father').val();
  character.father = fatherNames.indexOf(father);
  let length = fatherNames.length;

  switch (arrow) {
    case '-':
      if (character.father < 0) character.father = length--;
      character.father--;
      $('#char_father').val(fatherNames[character.father]);
      break;
    case '+':
      character.father++;
      if (character.father >= length--) character.father = 0;
      $('#char_father').val(fatherNames[character.father]);
      break;
  }


  mp.trigger('parentsSimilarity', character);
}

function changeMother(arrow) {
  let mother = $('#char_mother').val();
  character.mother = motherNames.indexOf(mother);
  let length = motherNames.length;

  switch (arrow) {
    case '-':
      if (character.mother < 0) character.mother = length--;
      character.mother--;
      $('#char_mother').val(motherNames[character.mother]);
      break;
    case '+':
      character.mother++;
      if (character.mother >= length--) character.mother = 0;
      $('#char_mother').val(motherNames[character.mother]);
      break;
  }

  mp.trigger('parentsSimilarity', character);
}

function changeParentsSimilarity(type) {
  switch (type) {
    case 'Heredity':
      character.shapeMix = $('#char_heredity').val();
      break;
    case 'Tone':
      character.skinMix = $('#char_skinTone').val();
      break;
  }

  mp.trigger('parentsSimilarity', character);
}

function changeEyesColor(arrow) {
  let eyesColor = $('#eyes_Color').val();
  character.eyesColor = eyeColors.indexOf(eyesColor);
  let length = eyeColors.length;

  switch (arrow) {
    case '-':
      if (character.eyesColor < 0) character.eyesColor = length--;
      character.eyesColor--;
      $('#eyes_Color').val(eyeColors[character.eyesColor]);
      break;
    case '+':
      character.eyesColor++;
      if (character.eyesColor >= length--) character.eyesColor = 0;
      $('#eyes_Color').val(eyeColors[character.eyesColor]);
      break;
  }

  mp.trigger('changeEyeColor', character.eyesColor);
}
//CREATOR MAIN

//CREATOR FACE FEATURES
function changeFace(type, input) {
  character.faceFeature[type] = $(input).val();

  mp.trigger('changeFace', type, character.faceFeatures[type]);
}
//CREATOR FACE FEATURES

// CREATOR HAIR & COLORS
function changeHairStyle(arrow) {
  let hairStyle = $('#hairStyleValue').val();
  character.hairStyle = hairList[character.gender].findIndex(h => h.Name == hairStyle);
  let length = hairList[character.gender].length;

  switch (arrow) {
    case '-':
      character.hairStyle--;
      if (character.hairStyle < 0) character.hairStyle = length - 1;
      $('#hairStyleValue').val(hairList[character.gender][character.hairStyle].Name);
      break;
    case '+':
      character.hairStyle++;
      if (character.hairStyle >= length - 1) character.hairStyle = 0;
      $('#hairStyleValue').val(hairList[character.gender][character.hairStyle].Name);
      break;
  }

  mp.trigger('changeComponent', 2, hairList[character.gender][character.hairStyle].ID);
}

function changeHairColor(arrow) {
  switch (arrow) {
    case '-':
      character.hairColor--;
      if (character.hairColor < 0) {
        character.hairColor = 63;
      }
      $('#hairColorInput').val(character.hairColor + 1);
      break;
    case '+':
      if (character.hairColor >= 63) {
        character.hairColor = -1;
      }
      character.hairColor++;
      $('#hairColorInput').val(character.hairColor + 1);
      break;
  }

  mp.trigger('changeHairColor', character.hairColor, character.hairHighlight);
}

function changeHairHighlight(arrow) {
  switch (arrow) {
    case '-':
      character.hairHighlight--;
      if (character.hairHighlight < 0) {
        character.hairHighlight = 63;
      }
      $('#hairHighlightInput').val(character.hairHighlight + 1);
      break;
    case '+':
      if (character.hairHighlight >= 63) {
        character.hairHighlight = -1;
      }
      character.hairHighlight++;
      $('#hairHighlightInput').val(character.hairHighlight + 1);
      break;
  }

  mp.trigger('changeHairColor', character.hairColor, character.hairHighlight);
}

function changeEyeBrowsStyle(arrow) {
  let eyeBrowsStyle = $('#eyeBrowsStyleValue').val();
  character.eyeBrows = eyeBrows.indexOf(eyeBrowsStyle);
  let length = eyeBrows.length;

  switch (arrow) {
    case '-':
      character.eyeBrows--;
      if (character.eyeBrows < 0) character.eyeBrows = length - 1;
      $('#eyeBrowsStyleValue').val(eyeBrows[character.eyeBrows]);
      break;
    case '+':
      character.eyeBrows++;
      if (character.eyeBrows >= length--) character.eyeBrows = 0;
      $('#eyeBrowsStyleValue').val(eyeBrows[character.eyeBrows]);
      break;
  }

  mp.trigger('changeHeadOverlay', 2, character.eyeBrows);
}

function changeEyeBrowsColor(arrow) {
  switch (arrow) {
    case '-':
      character.eyeBrowsColor--;
      if (character.eyeBrowsColor < 0) {
        character.eyeBrowsColor = 63;
      }
      $('#eyeBrowsColorInput').val(character.eyeBrowsColor + 1);
      break;
    case '+':
      if (character.eyeBrowsColor >= 63) {
        character.eyeBrowsColor = -1;
      }
      character.eyeBrowsColor++;
      $('#eyeBrowsColorInput').val(character.eyeBrowsColor + 1);
      break;
  }

  mp.trigger('changeColors', character);
}

function changeEyeBrowsHighlight(arrow) {
  switch (arrow) {
    case '-':
      character.eyeBrowsHighLight--;
      if (character.eyeBrowsHighLight < 0) {
        character.eyeBrowsHighLight = 63;
      }
      $('#eyeBrowsHighLightInput').val(character.eyeBrowsHighLight + 1);
      break;
    case '+':
      if (character.eyeBrowsHighLight >= 63) {
        character.eyeBrowsHighLight = -1;
      }
      character.eyeBrowsHighLight++;
      $('#eyeBrowsHighLightInput').val(character.eyeBrowsHighLight + 1);
      break;
  }

  mp.trigger('changeColors', character);
}

function changeBeardStyle(arrow) {
  let beardStyle = $('#beardStyleValue').val();
  character.beard = facialHair.indexOf(beardStyle);
  let length = facialHair.length;

  switch (arrow) {
    case '-':
      character.beard--;
      if (character.beard < 0) character.beard = length - 1;
      $('#beardStyleValue').val(facialHair[character.beard]);
      break;
    case '+':
      character.beard++;
      if (character.beard >= length--) character.beard = 0;
      $('#beardStyleValue').val(facialHair[character.beard]);
      break;
  }

  mp.trigger('changeHeadOverlay', 1, character.beard);
}

function changeBeardColor(arrow) {
  switch (arrow) {
    case '-':
      character.beardColor--;
      if (character.beardColor < 0) {
        character.beardColor = 63;
      }
      $('#beardColorInput').val(character.beardColor + 1);
      break;
    case '+':
      if (character.beardColor >= 63) {
        character.beardColor = -1;
      }
      character.beardColor++;
      $('#beardColorInput').val(character.beardColor + 1);
      break;
  }

  mp.trigger('changeColors', character);
}

function changeBeardHighlight(arrow) {
  switch (arrow) {
    case '-':
      character.beardHighLight--;
      if (character.beardHighLight < 0) {
        character.beardHighLight = 63;
      }
      $('#beardHighlightInput').val(character.beardHighLight + 1);
      break;
    case '+':
      if (character.beardHighLight >= 63) {
        character.beardHighLight = -1;
      }
      character.beardHighLight++;
      $('#beardHighlightInput').val(character.beardHighLight + 1);
      break;
  }

  mp.trigger('changeColors', character);
}

function changeChestHair(arrow) {
  let chestHairInput = $('#chestHairInput').val();
  character.chestHair = chestHair.indexOf(chestHairInput);
  let length = chestHair.length;

  switch (arrow) {
    case '-':
      if (character.chestHair < 0) character.chestHair = length--;
      character.chestHair--;
      $('#chestHairInput').val(chestHair[character.chestHair]);
      break;
    case '+':
      character.chestHair++;
      if (character.chestHair >= length--) character.chestHair = 0;
      $('#chestHairInput').val(chestHair[character.chestHair]);
      break;
  }

  mp.trigger('changeComponent', 10, character.chestHair)
}

function changeChestColor(arrow) {
  switch (arrow) {
    case '-':
      character.chestColor--;
      if (character.chestColor < 0) {
        character.chestColor = 63;
      }
      $('#chestHairColorInput').val(character.chestColor + 1);
      break;
    case '+':
      if (character.chestColor >= 63) {
        character.chestColor = -1;
      }
      character.chestColor++;
      $('#chestHairColorInput').val(character.chestColor + 1);
      break;
  }

  mp.trigger('changeColors', character);
}

function changeChestHighlight(arrow) {
  switch (arrow) {
    case '-':
      character.chestHighLight--;
      if (character.chestHighLight < 0) {
        character.chestHighLight = 63;
      }
      $('#chestHairHighlightInput').val(character.chestHighLight + 1);
      break;
    case '+':
      if (character.chestHighLight >= 63) {
        character.chestHighLight = -1;
      }
      character.chestHighLight++;
      $('#chestHairHighlightInput').val(character.chestHighLight + 1);
      break;
  }

  mp.trigger('changeColors', character);
}
// CREATOR HAIR & COLORS

// CREATOR OUTFIT
function createTopsOutfit(arrow) {
  let topStyle = $('#topStyleValue').val();
  character.topStyle = tops[character.gender].findIndex(h => h.Name == topStyle);
  let length = tops[character.gender].length;

  switch (arrow) {
    case '-':
      if (character.topStyle < 0) character.topStyle = length--;
      character.topStyle--;
      $('#topStyleValue').val(tops[character.gender][character.topStyle].Name);
      break;
    case '+':
      character.topStyle++;
      if (character.topStyle >= length--) character.topStyle = 0;
      $('#topStyleValue').val(tops[character.gender][character.topStyle].Name);
      break;
  }
}

function createLegsOutfit(arrow) {
  let legStyle = $('#legStyleValue').val();
  character.legStyle = legs[character.gender].findIndex(h => h.Name == legStyle);
  let length = legs[character.gender].length;

  switch (arrow) {
    case '-':
      if (character.legStyle < 0) character.legStyle = length--;
      character.legStyle--;
      $('#legStyleValue').val(legs[character.gender][character.legStyle].Name);
      break;
    case '+':
      character.legStyle++;
      if (character.legStyle >= length--) character.legStyle = 0;
      $('#legStyleValue').val(legs[character.gender][character.legStyle].Name);
      break;
  }
}

function createShoesOutfit(arrow) {
  let shoesStyle = $('#shoesStyleValue').val();
  character.shoesStyle = shoes[character.gender].findIndex(h => h.Name == shoesStyle);
  let length = shoes[character.gender].length;

  switch (arrow) {
    case '-':
      if (character.shoesStyle < 0) character.shoesStyle = length--;
      character.shoesStyle--;
      $('#shoesStyleValue').val(shoes[character.gender][character.shoesStyle].Name);
      break;
    case '+':
      character.shoesStyle++;
      if (character.shoesStyle >= length--) character.shoesStyle = 0;
      $('#shoesStyleValue').val(shoes[character.gender][character.shoesStyle].Name);
      break;
  }
}
// CREATOR OUTFIT

// Buttons on Foot
function createChar() {
  character.firstName = $('#char_name').val();
  character.secondName = $('#char_lastname').val();

  mp.trigger('createCharacter', character);
}

function randomCharParam(type) {
  switch (type) {
    case 'Main':
      character.gender = getRandomInt(0, 1);
      character.father = getRandomInt(0, fathers.length - 1);
      character.mother = getRandomInt(0, mothers.length - 1);
      character.shapeMix = getRandomInt(-100, 100) * 0.01;
      character.skinMix = getRandomInt(-100, 100) * 0.01;
      break;
    case 'Clothes':
      character.topStyle = getRandomInt(0, tops[character.gender].length - 1);
      character.legStyle = getRandomInt(0, legs[character.gender].length - 1);
      character.shoesStyle = getRandomInt(0, shoes[character.gender].length - 1);
      break;
    case 'Face':
      for (let i = 0; i < character.faceFeature.length; i++) {
        character.faceFeature[i] = getRandomInt(-100, 100) * 0.01;
      }
      character.eyesColor = getRandomInt(0, eyeColors.length - 1);
      break;
    case 'Hair':
      character.hairStyle = getRandomInt(0, hairList[character.gender].length - 1);
      character.hairColor = getRandomInt(0, 64);
      character.hairHighlight = getRandomInt(0, 64);
      character.beard = getRandomInt(0, facialHair.length - 1);
      character.beardColor = getRandomInt(0, 64);
      character.beardHighLight = getRandomInt(0, 64);
      character.eyeBrows = getRandomInt(0, eyeBrows.length - 1);
      character.eyeBrowsColor = getRandomInt(0, 64);
      character.eyeBrowsHighLight = getRandomInt(0, 64);
      character.chestHair = getRandomInt(0, chestHair.length - 1);
      character.chestColor = getRandomInt(0, 64);
      character.chestHighLight = getRandomInt(0, 64);
      break;
  }
  setPage(type, character);
  mp.trigger('randomCharParams', type, character);
}

function resetCharParam(type) {
  switch (type) {
    case 'Main':
      character.gender = 1;
      character.father = 0;
      character.mother = 0;
      character.shapeMix = 0;
      character.skinMix = 0;
      break;
    case 'Clothes':
      character.topStyle = 1;
      character.legStyle = 0;
      character.shoesStyle = 0;
      break;
    case 'Face':
      for (let i = 0; i < character.faceFeature.length; i++) {
        character.faceFeature[i] = 0;
      }
      character.eyesColor = 0;
      break;
    case 'Hair':
      character.hairStyle = 0;
      character.hairColor = 0;
      character.hairHighlight = 0;
      character.beard = 0;
      character.beardColor = 0;
      character.beardHighLight = 0;
      character.eyeBrows = 0;
      character.eyeBrowsColor = 0;
      character.eyeBrowsHighLight = 0;
      character.chestHair = 0;
      character.chestColor = 0;
      character.chestHighLight = 0;
      break;
  }
  setPage(type, character);

  mp.trigger('resetCharParams', type, character);
}

//UTILS
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setPage(type, character) {
  switch (type) {
    case 'Main':
      let gender = character.gender == 0 ? 'Женский' : 'Мужской';
      $('#char_gender').val(gender);

      $('#char_father').val(fatherNames[character.father]);
      $('#char_mother').val(motherNames[character.mother]);

      $('#char_heredity').val(character.shapeMix);
      $('#char_skinTone').val(character.skinMix);
      break;
    case 'Clothes':
      $('#topStyleValue').val(tops[character.gender][character.topStyle].Name);

      $('#legStyleValue').val(legs[character.gender][character.legStyle].Name);

      $('#shoesStyleValue').val(shoes[character.gender][character.shoesStyle].Name);
      break;
    case 'Face':
      $('#noseHeightValue').val(character.faceFeature[1]);
      $('#noseWidthValue').val(character.faceFeature[0]);
      $('#noseLengthValue').val(character.faceFeature[2]);
      $('#noseBridgeValue').val(character.faceFeature[3]);
      $('#noseTipValue').val(character.faceFeature[4]);
      $('#noseBridgeShiftValue').val(character.faceFeature[5]);

      $('#eyeBrowsHeightValue').val(character.faceFeature[6]);
      $('#eyeBrowsWidthValue').val(character.faceFeature[7]);

      $('#cheekBoneHeightValue').val(character.faceFeature[8]);
      $('#cheekBoneWidthValue').val(character.faceFeature[9]);
      $('#cheeksWidthValue').val(character.faceFeature[10]);

      $('#eyes_Color').val(eyeColors[character.eyesColor]);
      $('#eyesSizeValue').val(character.faceFeature[11]);

      $('#lipsSizeValue').val(character.faceFeature[12]);

      $('#jawHeightValue').val(character.faceFeature[14]);
      $('#jawWidthValue').val(character.faceFeature[13]);

      $('#chinPosValue').val(character.faceFeature[16]);
      $('#chinWidthValue').val(character.faceFeature[17]);
      $('#chinLengthValue').val(character.faceFeature[15]);
      $('#chinShapeValue').val(character.faceFeature[18]);

      $('#neckWidthValue').val(character.faceFeature[19]);
      break;
    case 'Hair':
      $('#hairStyleValue').val(hairList[character.gender][character.hairStyle].Name);
      $('#hairColorInput').val(character.hairColor + 1);
      $('#hairHighlightInput').val(character.hairHighlight + 1);

      $('#eyeBrowsStyleValue').val(eyeBrows[character.eyeBrows]);
      $('#eyeBrowsColorInput').val(character.eyeBrowsColor + 1);
      $('#eyeBrowsHighLightInput').val(character.eyeBrowsHighLight + 1);

      $('#beardStyleValue').val(facialHair[character.beard]);
      $('#beardColorInput').val(character.beardColor + 1);
      $('#beardHighLightInput').val(character.beardHighLight + 1);

      $('#chestHairInput').val(chestHair[character.chestHair]);
      $('#chestHairColorInput').val(character.chestColor + 1);
      $('#chestHairHighlightInput').val(character.chestHighLight + 1);
      break;
  }
}*/