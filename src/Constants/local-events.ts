export enum LocalEvents {
  ChatCursorToggle = 'Local:Chat:CursorToggle',

  Login = 'Local:AuthenticationUi:Login',
  Registration = 'Local:AuthenticationUi:Registration',
  AuthenticationUiErrorMessage = 'Local:AuthenticationUi:ErrorMessage',

  CharacterCreatorOpen = 'Local:CharacterCreator:Open',
  CharacterCreatorTabHair = 'Local:CharacterCreator:TabHair',
  CharacterCreatorCreate = 'Local:CharacterCreator:Create',  
  CharacterCreatorChangeGender = 'Local:CharacterCreator:ChangeGender',
  CharacterCreatorUpdateMain = 'Local:CharacterCreator:UpdateMain',
  CharacterCreatorUpdateClothes = 'Local:CharacterCreator:UpdateClothes',
  CharacterCreatorUpdateFace = 'Local:CharacterCreator:UpdateFace',
  CharacterCreatorUpdateHair = 'Local:CharacterCreator:UpdateHair'
}