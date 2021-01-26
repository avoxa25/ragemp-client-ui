import { LocalEvents } from "../Constants/local-events";

class CharacterSelectUi {
  public Start(): void {
    this.StartButtons();
  }

  private StartButtons(): void {
    const form = document.querySelector('form#mainForm') as HTMLFormElement;
    const createButton = form.querySelector('#characterCreate') as HTMLElement;
    const deleteButton = form.querySelector('#characterDelete') as HTMLElement;
    const selectButton = form.querySelector('#characterSelect') as HTMLButtonElement;
    const characterIdString = selectButton.value;
    const characterId = +characterIdString;

    selectButton.addEventListener('click', () => this.SelectCharacter(characterId));
    createButton.addEventListener('click', () => this.CreateCharacter());
    deleteButton.addEventListener('click', () => this.DeleteCharacter(characterId));
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
    const buttonValue = slot.querySelector('#characterSelect') as Element;

    characterName.innerHTML = `${characterModel.FirstName}_${characterModel.LastName}`;
    inGameTime.innerHTML = characterModel.TotalOnlineTime;
    fraction.innerHTML = (characterModel.fraction !== null) ? characterModel.fraction : 'Отсутствует';
    cash.innerHTML = characterModel.Cash;
    buttonValue.nodeValue = characterModel.Id;
  }

  public ShowCharacters(characterSelectModels: any): void {
    const copyForm = document.querySelector('#copyFrom') as HTMLFormElement;
    const mainForm = document.querySelector('#mainForm') as HTMLFormElement;

    const characterSlot = copyForm.querySelector('#characterSlot') as HTMLElement;
    const freeSlot = copyForm.querySelector('#freeSlot') as HTMLElement;
    const closedSlot = copyForm.querySelector('#closedSlot') as HTMLElement;

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
        return;
    }
  }
}

const characterSelectUi = new CharacterSelectUi();
characterSelectUi.Start();

(window as any).characterSelectUi = characterSelectUi;