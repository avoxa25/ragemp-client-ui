export enum LocalEvent {
  CursorVisible = 'Local:Cursor:Visible',
  CursorSprite = 'Local:Cursor:Sprite',

  Login = 'Local:AuthenticationUi:Login',
  Registration = 'Local:AuthenticationUi:Registration',
  AuthenticationUiErrorMessage = 'Local:AuthenticationUi:ErrorMessage',

  CharacterDelete = 'Local:Character:Delete',
  CharacterSelect = 'Local:Character:Select',
  CharacterSelectCreate = 'Local:Character:SelectCreate',
  CharacterSpawnSelect = 'Local:Character:SpawnSelect',

  CharacterCreatorOpen = 'Local:CharacterCreator:Open',
  CharacterCreatorTabHair = 'Local:CharacterCreator:TabHair',
  CharacterCreatorCreate = 'Local:CharacterCreator:Create',
  CharacterCreatorChangeGender = 'Local:CharacterCreator:ChangeGender',
  CharacterCreatorUpdateMain = 'Local:CharacterCreator:UpdateMain',
  CharacterCreatorUpdateClothes = 'Local:CharacterCreator:UpdateClothes',
  CharacterCreatorUpdateFace = 'Local:CharacterCreator:UpdateFace',
  CharacterCreatorUpdateHair = 'Local:CharacterCreator:UpdateHair',

  SpeedometerShow = 'Local:Speedometer:Show',
  SpeedometerHide = 'Local:Speedometer:Hide',
  SpeedometerUpdate = 'Local:Speedometer:Update',

  HouseBuy = 'Local:House:Buy',
  HouseEnterExit = 'Local:House:EnterExit',
  HouseSetLockState = 'Local:House:SetLockState',
  HouseSetOnSellState = 'Local:House:SetOnSellState',
  
  HouseMenuClose = 'Local:HouseMenu:Close',
}
