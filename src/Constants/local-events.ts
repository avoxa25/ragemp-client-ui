export enum LocalEvents {
  ChatCursorToggle = 'Local:Chat:CursorToggle',

  AuthenticationUiLogin = 'Local:AuthenticationUi:Login',
  AuthenticationUiRegistration = 'Local:AuthenticationUi:Registration',
  AuthenticationUiErrorMessage = 'Local:AuthenticationUi:ErrorMessage',

  CharacterCreatorOpen = 'Local:CharacterCreator:Open',
  CharacterCreatorTabHair = 'Local:CharacterCreator:TabHair',
  CharacterCreatorCreate = 'Local:CharacterCreator:Create',  
  CharacterCreatorChangeGender = 'Local:CharacterCreator:ChangeGender',
  CharacterCreatorUpdateMain = 'Local:CharacterCreator:UpdateMain',
  CharacterCreatorUpdateClothes = 'Local:CharacterCreator:UpdateClothes',
  CharacterCreatorUpdateFace = 'Local:CharacterCreator:UpdateFace',
  CharacterCreatorUpdateHair = 'Local:CharacterCreator:UpdateHair',

  InteractionCarOutsideToggleLock = 'Local:Interaction:CarOutside:ToggleLock',
  InteractionCarOutsideToggleThunk = 'Local:Interaction:CarOutside:ToggleThunk',
  InteractionCarOutsideToggleHood = 'Local:Interaction:CarOutside:ToggleHood',
  InteractionCarOutsideToggleDoor = 'Local:Interaction:CarOutside:ToggleDoor',
}