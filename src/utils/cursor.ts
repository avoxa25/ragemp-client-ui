import { LocalEvent } from "../constants/events/local-event";

export class Cursor {
  constructor() {
    mp.events.add(LocalEvent.CursorVisible, (fc: boolean, v: boolean) => this.CursorVisible(fc, v));
  }

  private CursorVisible(freezeControls: boolean, visible: boolean): void {
    mp.gui.cursor.show(freezeControls, visible);
  }

  // TODO: Add cursor sprite after new updates of RageMP
  // wiki: https://wiki.rage.mp/index.php?title=Ui::setCursorSprite
}

const cursor = new Cursor();