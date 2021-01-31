export enum RemoteResponse {
  RegistrationSuccess = "RemoteResponse:Authentication:RegistrationSuccess",
  RegistrationFailed = "RemoteResponse:Authentication:RegistrationFailed",

  LoginAllowed = "RemoteResponse:Authentication:LoginAllowed",
  LoginSuccess = "RemoteResponse:Authentication:LoginSuccess",
  LoginFailed = "RemoteResponse:Authentication:LoginFailed",

  CharacterCreatorGenderChangeCompleted = "RemoteResponse:CharacterCreator:GenderChangeCompleted",
  CharacterCreatorFailed = "RemoteResponse:CharacterCreator:Failed",
  CharacterCreatorCreated = "RemoteResponse:CharacterCreator:Created",

  CharacterSelected = "RemoteResponse:Character:Selected",
  CharacterDeleted = "RemoteResponse:Character:Deleted",
  CharacterSpawnSelected = "RemoteResponse:Character:SpawnSelected",
  CharacterMoneyChanged = "RemoteResponse:Character:MoneyChanged",

  MenusHouseClose = "RemoteResponse:MenusHouse:Close",
  MenusHouseReload = "RemoteResponse:MenusHouse:Reload",

  NotificationSent = "RemoteResponse:Notification:Sent"
}