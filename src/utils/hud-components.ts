class HudComponents{
  constructor(){
      mp.events.add(RageEnums.EventKey.RENDER, () => this.HideHudComponents());
      // wiki: https://wiki.rage.mp/index.php?title=GXT::set
      mp.game.gxt.set('PM_PAUSE_HDR', 'SweetLifeRP');
  }

  private HideHudComponents(): void{
    // https://wiki.rage.mp/index.php?title=HUD_Components
      mp.game.ui.hideHudComponentThisFrame(RageEnums.HudComponent.WANTED_STARS);
      mp.game.ui.hideHudComponentThisFrame(RageEnums.HudComponent.WEAPON_ICON);
      mp.game.ui.hideHudComponentThisFrame(RageEnums.HudComponent.CASH);
      mp.game.ui.hideHudComponentThisFrame(RageEnums.HudComponent.VEHICLE_NAME);
      mp.game.ui.hideHudComponentThisFrame(RageEnums.HudComponent.AREA_NAME);
      mp.game.ui.hideHudComponentThisFrame(RageEnums.HudComponent.VEHICLE_CLASS);
      mp.game.ui.hideHudComponentThisFrame(RageEnums.HudComponent.STREET_NAME);
      mp.game.ui.hideHudComponentThisFrame(RageEnums.HudComponent.CASH_CHANGE);
      mp.game.ui.hideHudComponentThisFrame(RageEnums.HudComponent.WEAPON_WHEEL_STATS);
  }
}

const hudComponents = new HudComponents();