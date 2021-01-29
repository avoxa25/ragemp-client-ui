export enum LocalEvents {
  Login = 'Local:AuthenticationUi:Login',
  Registration = 'Local:AuthenticationUi:Registration',
  AuthenticationUiErrorMessage = 'Local:AuthenticationUi:ErrorMessage',

  CharacterDelete = 'Local:Character:Delete',
  CharacterSelect = 'Local:Character:Select',
  CharacterSelectCreate = 'Local:Character:SelectCreate',

  CharacterCreatorOpen = 'Local:CharacterCreator:Open',
  CharacterCreatorTabHair = 'Local:CharacterCreator:TabHair',
  CharacterCreatorCreate = 'Local:CharacterCreator:Create',  
  CharacterCreatorChangeGender = 'Local:CharacterCreator:ChangeGender',
  CharacterCreatorUpdateMain = 'Local:CharacterCreator:UpdateMain',
  CharacterCreatorUpdateClothes = 'Local:CharacterCreator:UpdateClothes',
  CharacterCreatorUpdateFace = 'Local:CharacterCreator:UpdateFace',
  CharacterCreatorUpdateHair = 'Local:CharacterCreator:UpdateHair',

  ChatCursorToggle = 'Local:Chat:CursorToggle'
}
