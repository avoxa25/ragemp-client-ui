import { LocalEvent } from '../../../models/enums/events/local-event.enum';
import { SpawnLocation } from './spawn-location';

class CharacterSpawnSelectUi {
  private readonly section: HTMLElement;

  public constructor(haveOrganization: boolean, haveHomes: boolean) {
    this.section = document.querySelector('section.container ul') as HTMLElement;

    this.CreateSpawnItem(SpawnLocation.LastLocation);
    if (haveOrganization) this.CreateSpawnItem(SpawnLocation.Organization);
    if (haveHomes) this.CreateSpawnItem(SpawnLocation.House);
  }

  private CreateSpawnItem(location: SpawnLocation): void {
    const itemLi = document.createElement('li') as HTMLElement;
    const button = document.createElement('button') as HTMLButtonElement;
    button.classList.add('spawn-item');
    const image = document.createElement('img') as HTMLElement;
    const text = document.createElement('p') as HTMLElement;

    switch (location) {
      case SpawnLocation.LastLocation:
        button.classList.add('last-location');
        image.setAttribute('src', './assets/last-location.svg');
        text.innerText = 'Персонаж появится в месте последнего выхода из игры';
        break;
      case SpawnLocation.Organization:
        button.classList.add('organization');
        image.setAttribute('src', './assets/organization.svg');
        text.innerText = 'Персонаж появится на территории организации';
        break;
      case SpawnLocation.House:
        button.classList.add('home');
        image.setAttribute('src', './assets/home.svg');
        text.innerText = 'Персонаж появится дома. Дом, милый дом!';
        break;
    }

    this.section.appendChild(itemLi);
    itemLi.appendChild(button);
    button.appendChild(image);
    button.appendChild(text);

    button.addEventListener('click', () => {
      mp.events.call(LocalEvent.CharacterSpawnSelect, location);
    })
  }
}

// TODO: Create Event for display of figures according to the character's belonging to the faction and the presence of houses
const characterSpawnSelectUi = new CharacterSpawnSelectUi(false, false);
(window as any).characterSpawnSelectUi = characterSpawnSelectUi;