import { LocalEvents } from '../../Constants/local-events';
import { RemoteEvents } from '../../Constants/remote-events';
import { RemoteResponse } from '../../Constants/remote-response';

class CharacterSelect {
  private browser: BrowserMp;

  constructor(csm: string) {
    this.browser = mp.browsers.new('package://Character/Select/select.html');
    mp.players.local.freezePosition(true);

    mp.gui.cursor.show(true, true);

    this.ShowCharacters(csm);

    mp.events.add(RemoteResponse.CharacterSelected, () => this.Close());
    mp.events.add(RemoteResponse.CharacterDeleted, (csm: string) => this.ShowCharacters(csm));

    mp.events.add(LocalEvents.CharacterSelect, (id: number) => this.CharacterSelect(id));
    mp.events.add(LocalEvents.CharacterDelete, (id: number) => this.DeleteCharacter(id));
    mp.events.add(LocalEvents.CharacterSelectCreate, () => 
    {
      this.Close();
      this.CharacterSelectCreate();
    });
  }

  private Close(): void {
    this.browser.destroy();
  }

  private ShowCharacters(characterSelectModelsJson: string): void {
    mp.console.logFatal(characterSelectModelsJson);
    this.browser.execute(`window.characterSelectUi.ShowCharacters('${characterSelectModelsJson}');`);
  }

  private CharacterSelectCreate(): void {
    mp.events.call(LocalEvents.CharacterCreatorOpen);
  }

  private DeleteCharacter(characterId: number): void {
    mp.events.callRemote(RemoteEvents.CharacterDelete, characterId);
  }

  private CharacterSelect(characterId: number): void {
    mp.events.callRemote(RemoteEvents.CharacterSelect, characterId);
  }
}

// TODO: Redirect to purchase page or something similar

let characterSelect: CharacterSelect | undefined;
mp.events.add(RemoteResponse.LoginSuccess, (csm: string) => characterSelect = characterSelect ? characterSelect : new CharacterSelect(csm));
