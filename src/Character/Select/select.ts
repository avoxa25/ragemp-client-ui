import { LocalEvents } from "../../Constants/local-events";
import { SectionType } from "./section-type";
import { CharacterSelectModel } from "./select-model";

class CharacterSelectUi {
  private ul = document.querySelector('section.container ul') as HTMLElement;

  public ShowCharacters(characterSelectModelsJson: string): void {
    const characterSelectModels = JSON.parse(characterSelectModelsJson);

    const copyForm = document.querySelector('#copyFrom') as HTMLFormElement;
    const mainForm = document.querySelector('#mainForm') as HTMLFormElement;

    const characterSlot = copyForm.querySelector('#characterSlot') as HTMLElement;
    const freeSlot = copyForm.querySelector('#freeSlot') as HTMLElement;

    // TODO: Realize buying form

    switch (characterSelectModels.length) {
      case 1:
        const fSlot = characterSlot.cloneNode(true) as HTMLElement;
        fSlot.classList.remove('hidden');
        mainForm.append(fSlot);
        this.ShowCharacterData(fSlot, characterSelectModels[0]);

        const sSlot = freeSlot.cloneNode(true) as HTMLElement;
        sSlot.classList.remove('hidden');
        sSlot.classList.add('block2');
        mainForm.append(sSlot);

        const tSlot = freeSlot.cloneNode(true) as HTMLElement;
        tSlot.classList.remove('hidden');
        tSlot.classList.add('block3');
        mainForm.append(tSlot);

        this.StartButtons();
        return;
      case 2:
        const firSlot = characterSlot.cloneNode(true) as HTMLElement;
        firSlot.classList.remove('hidden');
        mainForm.append(firSlot);
        this.ShowCharacterData(firSlot, characterSelectModels[0]);

        const secSlot = characterSlot.cloneNode(true) as HTMLElement;
        secSlot.classList.remove('hidden');
        secSlot.classList.add('block2');
        mainForm.append(secSlot);
        this.ShowCharacterData(secSlot, characterSelectModels[1]);

        const trdSlot = freeSlot.cloneNode(true) as HTMLElement;
        trdSlot.classList.remove('hidden');
        trdSlot.classList.add('block3');

        mainForm.append(trdSlot);

        this.StartButtons();
        return;
      case 3:
        const firstSlot = characterSlot.cloneNode(true) as HTMLElement;
        firstSlot.classList.remove('hidden');
        mainForm.append(firstSlot);
        this.ShowCharacterData(firstSlot, characterSelectModels[0]);

        const secondSlot = characterSlot.cloneNode(true) as HTMLElement;
        secondSlot.classList.remove('hidden');
        secondSlot.classList.add('block2');
        mainForm.append(secondSlot);
        this.ShowCharacterData(secondSlot, characterSelectModels[1]);

        const thirdSlot = characterSlot.cloneNode(true) as HTMLElement;
        thirdSlot.classList.remove('hidden');
        thirdSlot.classList.add('block3');
        mainForm.append(thirdSlot);
        this.ShowCharacterData(thirdSlot, characterSelectModels[2]);

        this.StartButtons();
        return;
      default:
        const slot1 = freeSlot.cloneNode(true) as HTMLElement;
        slot1.classList.remove('hidden');
        mainForm.append(slot1);

        const slot2 = freeSlot.cloneNode(true) as HTMLElement;
        slot2.classList.remove('hidden');
        slot2.classList.add('block2');
        mainForm.append(slot2);

        const slot3 = freeSlot.cloneNode(true) as HTMLElement;
        slot3.classList.remove('hidden');
        slot3.classList.add('block3');
        mainForm.append(slot3);

        this.StartButtons();
        return;
    }
  }

  private CreateSection(type: SectionType, characterModel?: CharacterSelectModel) {
    switch (type) {
      case SectionType.Character:
        if(!characterModel) return;

        const characterLi = document.createElement('li') as HTMLElement;
        const section = document.createElement('section') as HTMLElement;
        section.classList.add('slot');
        section.classList.add('active');
    
        const header = document.createElement('header') as HTMLElement;
        const main = document.createElement('main') as HTMLElement;
        const fullName = document.createElement('h2') as HTMLElement;
        fullName.classList.add('text-gradient');
        //fullName.innerText = `${characterModel.firstName} ${characterModel.lastName}`;
    
        const info = document.createElement('ul') as HTMLElement;
        const playedTimeLi = document.createElement('li') as HTMLElement;
        const playedTimeP = document.createElement('p') as HTMLElement;
        playedTimeP.innerText = 'Наиграно часов:';
        const playedTimeSpan = document.createElement('span') as HTMLElement;
        //playedTimeSpan.innerText = characterModel.totalOnlineTime;
    
        const factionLi = document.createElement('li') as HTMLElement;
        const factionP = document.createElement('p') as HTMLElement;
        factionP.innerText = 'Фракция:';
        const factionSpan = document.createElement('span') as HTMLElement;
        //factionSpan.innerText = characterModel.faction;
    
        const cashLi = document.createElement('li') as HTMLElement;
        const cashP = document.createElement('p') as HTMLElement;
        cashP.innerText = 'Наличные:';
        const cashSpan = document.createElement('span') as HTMLElement;
        //cashSpan.innerText = characterModel.cash;
    
        const bankCashLi = document.createElement('li') as HTMLElement;
        const bankCashP = document.createElement('p') as HTMLElement;
        bankCashP.innerText = 'Банк:';
        const bankCashSpan = document.createElement('span') as HTMLElement;
        //bankCashSpan.innerText = characterModel.bankCash;
    
        const buttonSelect = document.createElement('button') as HTMLButtonElement;
        buttonSelect.innerText = 'ВЫБРАТЬ';
        buttonSelect.classList.add('select');
        //buttonSelect.value = characterModel.id.toString();
        
        const buttonDelete = document.createElement('button') as HTMLButtonElement;
        buttonDelete.innerText = 'Удалить персонажа';
        buttonDelete.classList.add('delete');
        //buttonDelete.value = characterModel.id.toString();
    
        this.ul.appendChild(characterLi);
        characterLi.appendChild(section);
        section.appendChild(header);
        section.appendChild(main);
        main.appendChild(fullName);
        main.appendChild(info);
    
        info.appendChild(playedTimeLi);
        playedTimeLi.appendChild(playedTimeP);
        playedTimeP.appendChild(playedTimeSpan);
    
        info.appendChild(factionLi);
        factionLi.appendChild(factionP);
        factionP.appendChild(factionSpan);
    
        cashLi.appendChild(cashP);
        info.appendChild(cashLi);
        cashP.appendChild(cashSpan);
    
        info.appendChild(bankCashLi);
        bankCashLi.appendChild(bankCashP);
        bankCashP.appendChild(bankCashSpan);
    
        main.appendChild(buttonSelect);
        main.appendChild(buttonDelete);

        console.log(characterModel);
        break;
      case SectionType.Create:
        break;
    }
  }

  public StartButtons(): void {
    const section = document.querySelector('section.container') as HTMLFormElement;

    const createButtons = section.querySelectorAll('.create');
    const deleteButtons = section.querySelectorAll('.delete');
    const selectButtons = section.querySelectorAll('.select');
    console.log(selectButtons);

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
    console.log('Тест');
    mp.events.call(LocalEvents.CharacterSelectCreate);
  }

  private DeleteCharacter(characterId: number): void {
    console.log('Тест2');
    mp.events.call(LocalEvents.CharacterDelete, characterId);
  }

  private SelectCharacter(characterId: number): void {
    console.log('Тест3');
    mp.events.call(LocalEvents.CharacterSelect, characterId)
  }

  private ShowCharacterData(slot: HTMLElement, characterModel: any): void {
    const characterName = slot.querySelector('#characterName') as HTMLElement;
    const inGameTime = slot.querySelector('#inGameTime') as HTMLElement;
    const fraction = slot.querySelector('#fraction') as HTMLElement;
    const cash = slot.querySelector('#cash') as HTMLElement;
    const bankCash = slot.querySelector('#bankCash') as HTMLElement;
    const buttonValue = slot.querySelector('#characterSelect') as HTMLButtonElement;

    characterName.innerText = `${characterModel.FirstName} ${characterModel.LastName}`;
    inGameTime.innerText = characterModel.TotalOnlineTime;
    fraction.innerText = (characterModel.fraction !== null) ? characterModel.fraction : 'Отсутствует';
    cash.innerText = characterModel.Cash;
    bankCash.innerText = characterModel.BankCash;
    buttonValue.value = characterModel.Id;
  }
}

const characterSelectUi = new CharacterSelectUi();
characterSelectUi.StartButtons();
(window as any).characterSelectUi = characterSelectUi;