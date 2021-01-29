import { LocalEvents } from "../../Constants/local-events";
import { SectionType } from "./section-type";
import { CharacterSelectModel } from "./select-model";

class CharacterSelectUi {
  private ul = document.querySelector('section.container ul') as HTMLElement;
  private characterModel: CharacterSelectModel;

  public constructor() {
    this.characterModel = new CharacterSelectModel();
  }

  public ShowCharacters(characterSelectModelsJson: string): void {
    const characterSelectModels = JSON.parse(characterSelectModelsJson);

    // TODO: Realize buying form

    switch (characterSelectModels.length) {
      case 1:
        this.characterModel = characterSelectModels[0];
        this.CreateSection(SectionType.Character, this.characterModel);

        this.CreateSection(SectionType.Create);
        this.CreateSection(SectionType.Create);

        this.StartButtons();
        return;
      case 2:
        this.characterModel = characterSelectModels[0];
        this.CreateSection(SectionType.Character, this.characterModel);

        this.characterModel = characterSelectModels[1];
        this.CreateSection(SectionType.Character, this.characterModel);
        this.CreateSection(SectionType.Create);

        this.StartButtons();
        return;
      case 3:
        this.characterModel = characterSelectModels[0];
        this.CreateSection(SectionType.Character, this.characterModel);

        this.characterModel = characterSelectModels[1];
        this.CreateSection(SectionType.Character, this.characterModel);

        this.characterModel = characterSelectModels[2];
        this.CreateSection(SectionType.Character, this.characterModel);

        this.StartButtons();
        return;
      default:
        for (let i = 0; i < 3; i++)
          this.CreateSection(SectionType.Create);

        this.StartButtons();
        return;
    }
  }

  private CreateSection(type: SectionType, characterModel?: CharacterSelectModel) {
    switch (type) {
      case SectionType.Character:
        if (!characterModel) return;

        const characterLi = document.createElement('li') as HTMLElement;
        const characterSection = document.createElement('section') as HTMLElement;
        characterSection.classList.add('slot');
        characterSection.classList.add('active');

        const characterHeader = document.createElement('header') as HTMLElement;
        const characterMain = document.createElement('main') as HTMLElement;
        const fullName = document.createElement('h2') as HTMLElement;
        fullName.classList.add('text-gradient');
        fullName.innerText = `${characterModel.firstName} ${characterModel.lastName}`;

        const characterInfo = document.createElement('ul') as HTMLElement;
        const playedTimeLi = document.createElement('li') as HTMLElement;
        const playedTimeText = document.createElement('p') as HTMLElement;
        playedTimeText.innerText = 'Наиграно часов:';
        const playedTimeSpan = document.createElement('span') as HTMLElement;
        playedTimeSpan.innerText = characterModel.totalOnlineTime.hours;

        const factionLi = document.createElement('li') as HTMLElement;
        const factionText = document.createElement('p') as HTMLElement;
        factionText.innerText = 'Фракция:';
        const factionSpan = document.createElement('span') as HTMLElement;
        factionSpan.innerText = characterModel.faction !== undefined ? characterModel.faction : 'Отсутствует';

        const cashLi = document.createElement('li') as HTMLElement;
        const cashText = document.createElement('p') as HTMLElement;
        cashText.innerText = 'Наличные:';
        const cashSpan = document.createElement('span') as HTMLElement;
        cashSpan.innerText = characterModel.cash.toString();

        const bankCashLi = document.createElement('li') as HTMLElement;
        const bankCashText = document.createElement('p') as HTMLElement;
        bankCashText.innerText = 'Банк:';
        const bankCashSpan = document.createElement('span') as HTMLElement;
        bankCashSpan.innerText = characterModel.bankCash.toString();

        const buttonSelect = document.createElement('button') as HTMLButtonElement;
        buttonSelect.innerText = 'ВЫБРАТЬ';
        buttonSelect.classList.add('select');
        buttonSelect.value = characterModel.id.toString();

        const buttonDelete = document.createElement('button') as HTMLButtonElement;
        buttonDelete.innerText = 'Удалить персонажа';
        buttonDelete.classList.add('delete');
        buttonDelete.value = characterModel.id.toString();

        this.ul.appendChild(characterLi);
        characterLi.appendChild(characterSection);
        characterSection.appendChild(characterHeader);
        characterSection.appendChild(characterMain);
        characterMain.appendChild(fullName);
        characterMain.appendChild(characterInfo);

        characterInfo.appendChild(playedTimeLi);
        playedTimeLi.appendChild(playedTimeText);
        playedTimeText.appendChild(playedTimeSpan);

        characterInfo.appendChild(factionLi);
        factionLi.appendChild(factionText);
        factionText.appendChild(factionSpan);

        cashLi.appendChild(cashText);
        characterInfo.appendChild(cashLi);
        cashText.appendChild(cashSpan);

        characterInfo.appendChild(bankCashLi);
        bankCashLi.appendChild(bankCashText);
        bankCashText.appendChild(bankCashSpan);

        characterMain.appendChild(buttonSelect);
        characterMain.appendChild(buttonDelete);
        break;
      case SectionType.Create:
        const createLi = document.createElement('li') as HTMLElement;
        const createSection = document.createElement('section') as HTMLElement;
        createSection.classList.add('slot');
        createSection.classList.add('non-active');

        const createHeader = document.createElement('header') as HTMLElement;
        const createMain = document.createElement('main') as HTMLElement;

        const createSlotText = document.createElement('p') as HTMLElement;
        const countSlots = document.querySelectorAll('section.slot').length;
        createSlotText.innerText = `Слот №${countSlots + 1} \n свободен`;

        const createPrompt = document.createElement('div') as HTMLElement;
        createPrompt.classList.add('prompt');
        const createPromptText = document.createElement('p') as HTMLElement;
        createPromptText.innerText = 'Нажмите чтобы создать нового персонажа';

        const createButton = document.createElement('button') as HTMLButtonElement;
        createButton.classList.add('plus');
        createButton.classList.add('create');

        this.ul.appendChild(createLi);
        createLi.appendChild(createSection);
        createSection.appendChild(createHeader);
        createSection.appendChild(createMain);

        createMain.appendChild(createSlotText);
        createMain.appendChild(createPrompt);
        createPrompt.appendChild(createPromptText);
        createMain.appendChild(createButton);
        break;
    }
  }

  private StartButtons(): void {
    const section = document.querySelector('section.container ul') as HTMLFormElement;

    const createButtons = section.querySelectorAll('.create');
    const deleteButtons = section.querySelectorAll('.delete');
    const selectButtons = section.querySelectorAll('.select');

    selectButtons.forEach((sb, key) => {
      const selectButton = sb as HTMLButtonElement;

      const characterIdString = selectButton.value;
      const characterId = +characterIdString;
      sb.addEventListener('click', () => this.SelectCharacter(characterId));
      deleteButtons[key].addEventListener('click', () => this.DeleteCharacter(characterId));
    });

    createButtons.forEach((cb) => cb.addEventListener('click', () => this.CreateCharacter()));
  }

  private CreateCharacter(): void {
    mp.events.call(LocalEvents.CharacterSelectCreate);
  }

  private DeleteCharacter(characterId: number): void {
    mp.events.call(LocalEvents.CharacterDelete, characterId);
  }

  private SelectCharacter(characterId: number): void {
    mp.events.call(LocalEvents.CharacterSelect, characterId)
  }
}

const characterSelectUi = new CharacterSelectUi();
(window as any).characterSelectUi = characterSelectUi;