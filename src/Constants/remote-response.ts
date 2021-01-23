export enum RemoteResponse {
  AuthenticationAllowed = 'RemoteResponse:Authentication:Allowed',
  AuthenticationSuccess = 'RemoteResponse:Authentication:Success',

  LoginFailed = 'RemoteResponse:Authentication:LoginFailed',
  RegistrationFailed = 'RemoteResponse:Authentication:RegistrationFailed',

  CharacterCreatorGenderChangeCompleted = "RemoteResponse:CharacterCreator:GenderChangeCompleted",
  CharacterCreatorFailed = "RemoteResponse:CharacterCreator:Failed",
  CharacterCreatorCreated = "RemoteResponse:CharacterCreator:Created",

  CharacterSelect = "RemoteResponse:Character:Select",
  CharacterSelected = "RemoteResponse:Character:Selected",
  CharacterMoneyChanged = "RemoteResponse:Character:MoneyChanged",

  NotificationSent = "RemoteResponse:Notification:Sent"
};