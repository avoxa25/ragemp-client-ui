export enum RemoteResponse {
  RegistrationSuccess = "RemoteResponse:Auth:RegistrationSuccess",
  RegistrationFailed = "RemoteResponse:Auth:RegistrationFailed",

  LoginAllowed = "RemoteResponse:Auth:LoginAllowed",
  LoginSuccess = "RemoteResponse:Auth:LoginSuccess",
  LoginFailed = "RemoteResponse:Auth:LoginFailed",

  CharacterCreatorGenderChangeCompleted = "RemoteResponse:CharacterCreator:GenderChangeCompleted",
  CharacterCreatorFailed = "RemoteResponse:CharacterCreator:Failed",
  CharacterCreatorCreated = "RemoteResponse:CharacterCreator:Created",

  CharacterSelected = "RemoteResponse:Character:Selected",
  CharacterSpawnSelected = "RemoteResponse:Character:SpawnSelected",
  CharacterMoneyChanged = "RemoteResponse:Character:MoneyChanged",

  NotificationSent = "RemoteResponse:Notification:Sent",

  MainMenuOpened = 'RemoteResponse:MainMenu:Opened'
};