import { LocalEvents } from '../../Constants/local-events';

class CharacterSpawnSelectUi {
  public constructor(haveOrganization: boolean, haveHomes: boolean) {
    const lastPosition = document.querySelector('#anim1') as HTMLElement;
    const lastPositionFront = document.querySelector('#anim1f') as HTMLElement;

    const organizationSpawn = document.querySelector('#anim2') as HTMLElement;
    const organizationSpawnFront = document.querySelector('#anim2f') as HTMLElement;

    const houseSpawn = document.querySelector('#anim3') as HTMLElement;
    const houseSpawnFront = document.querySelector('#anim3f') as HTMLElement;

    const lastPositionFigure = document.querySelector('#lastPosition') as HTMLElement;
    const organizationSpawnFigure = document.querySelector('#organizationSpawn') as HTMLElement;
    const houseSpawnFigure = document.querySelector('#houseSpawn') as HTMLElement;

    lastPositionFigure.style.marginLeft = '400px';

    if (haveOrganization) {
      organizationSpawnFigure.classList.remove('hidden');

      lastPositionFigure.style.marginLeft = '50px';
      organizationSpawnFigure.style.marginLeft = '650px';

      organizationSpawn.addEventListener('mouseover', () => {
        organizationSpawn.classList.add('anim');
        organizationSpawnFront.classList.add('hide');
      });
      organizationSpawn.addEventListener('mouseout', () => {
        organizationSpawn.classList.remove('anim');
        organizationSpawnFront.classList.remove('hide');
      });

      organizationSpawnFigure.addEventListener('click', () => mp.events.call(LocalEvents.CharacterSpawnSelect, 'OrganizationSpawn'));
    }

    if (haveHomes) {
      houseSpawnFigure.classList.remove('hidden');

      lastPositionFigure.style.marginLeft = '100px';
      houseSpawnFigure.style.marginLeft = '700px';

      houseSpawn.addEventListener('mouseover', () => {
        houseSpawn.classList.add('anim');
        houseSpawnFront.classList.add('hide');
      });
      houseSpawn.addEventListener('mouseout', () => {
        houseSpawn.classList.remove('anim');
        houseSpawnFront.classList.remove('hide');
      });

      houseSpawnFigure.addEventListener('click', () => mp.events.call(LocalEvents.CharacterSpawnSelect, 'HouseSpawn'));
    }

    if (haveOrganization && haveHomes) {
      lastPositionFigure.style.marginLeft = '0';
      organizationSpawnFigure.style.marginLeft = '400px';
      houseSpawnFigure.style.marginLeft = '800px';
    }

    lastPosition.addEventListener('mouseover', () => {
      lastPosition.classList.add('anim');
      lastPositionFront.classList.add('hide');
    });
    lastPosition.addEventListener('mouseout', () => {
      lastPosition.classList.remove('anim');
      lastPositionFront.classList.remove('hide');
    });

    lastPositionFigure.addEventListener('click', () => mp.events.call(LocalEvents.CharacterSpawnSelect, 'LastPosition'));
  }
}

const characterSpawnSelectUi = new CharacterSpawnSelectUi(false, false);

// TODO: Create Event for display of figures according to the character's belonging to the faction and the presence of houses

(window as any).characterSpawnSelectUi = characterSpawnSelectUi;