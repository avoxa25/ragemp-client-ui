import { LocalEvent } from '../../../models/enums/events/local-event';
import { RemoteEvent } from '../../../models/enums/events/remote-event';
import { RemoteResponse } from '../../../models/enums/events/remote-response';

class CharacterSelect {
  private browser: BrowserMp;

  public constructor(csm: string) {
    this.browser = mp.browsers.new('package://Character/Select/select.html');
    mp.players.local.freezePosition(true);

    mp.gui.cursor.show(true, true);

    this.ShowCharacters(csm);

    mp.events.add(RemoteResponse.CharacterSelected, () => this.Close());
    mp.events.add(RemoteResponse.CharacterDeleted, (csm: string) => 
    {
      this.browser.reload(false);
      this.ShowCharacters(csm);
    });

    mp.events.add(LocalEvent.CharacterSelect, (id: number) => this.CharacterSelect(id));
    mp.events.add(LocalEvent.CharacterDelete, (id: number) => this.DeleteCharacter(id));
    mp.events.add(LocalEvent.CharacterSelectCreate, () => 
    {
      this.Close();
      this.CharacterSelectCreate();
    });
  }

  private Close(): void {
    this.browser.destroy();
  }

  private ShowCharacters(characterSelectModelsJson: string): void {
    this.browser.execute(`window.characterSelectUi.ShowCharacters('${characterSelectModelsJson}');`);
  }

  private CharacterSelectCreate(): void {
    mp.events.call(LocalEvent.CharacterCreatorOpen);
  }

  private DeleteCharacter(characterId: number): void {
    mp.events.callRemote(RemoteEvent.CharacterDelete, characterId);
  }

  private CharacterSelect(characterId: number): void {
    mp.events.callRemote(RemoteEvent.CharacterSelect, characterId);
  }
}

// TODO: Redirect to purchase page or something similar

let characterSelect: CharacterSelect | undefined;
mp.events.add(RemoteResponse.LoginSuccess, (csm: string) => characterSelect = characterSelect ? characterSelect : new CharacterSelect(csm));
