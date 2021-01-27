import { LocalEvents } from "../../Constants/local-events";

class CharacterSelectUi {
  private StartButtons(): void {
    const form = document.querySelector('form#mainForm') as HTMLFormElement;

    const createButtons = form.querySelectorAll('.buttonCreate');
    const deleteButtons = form.querySelectorAll('.buttonDelete');
    const selectButtons = form.querySelectorAll('.buttonSelect');

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

  private ShowCharacterData(slot: HTMLElement, characterModel: any): void {
    const characterName = slot.querySelector('#characterName') as HTMLElement;
    const inGameTime = slot.querySelector('#inGameTime') as HTMLElement;
    const fraction = slot.querySelector('#fraction') as HTMLElement;
    const cash = slot.querySelector('#cash') as HTMLElement;
    //const buttonValue = slot.querySelector('#characterSelect') as Element;

    characterName.innerText = `${characterModel.FirstName} ${characterModel.LastName}`;
    inGameTime.innerText = characterModel.TotalOnlineTime;
    fraction.innerText = (characterModel.fraction !== null) ? characterModel.fraction : 'Отсутствует';
    cash.innerText = characterModel.Cash;
    //buttonValue.nodeValue = characterModel.Id;
  }

  public ShowCharacters(characterSelectModelsJson: string): void {
    mp.console.logError('Информация передана');
    mp.console.logError(`${characterSelectModelsJson}`);
    const characterSelectModels = JSON.parse(characterSelectModelsJson) as any[];
    mp.console.logError(characterSelectModels.length.toString());

    mp.console.logInfo(typeof (characterSelectModels));

    const copyForm = document.querySelector('#copyFrom') as HTMLFormElement;
    const mainForm = document.querySelector('#mainForm') as HTMLFormElement;

    const characterSlot = copyForm.querySelector('#characterSlot') as HTMLElement;
    const freeSlot = copyForm.querySelector('#freeSlot') as HTMLElement;
    //const closedSlot = copyForm.querySelector('#closedSlot') as HTMLElement;

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
}

const characterSelectUi = new CharacterSelectUi();
(window as any).characterSelectUi = characterSelectUi;