export enum RemoteEvents {
  ChatOpen = 'Remote:Chat:Open',
  ChatSendMessage = 'Remote:Chat:SendMessage',
  AuthenticationOpen = 'Remote:Authentication:Open',
  AuthenticationClose = 'Remote:Authentication:Close',
  AuthenticationLogin = 'Remote:Authentication:Login',
  AuthenticationRegistration = 'Remote:Authentication:Registration',
  AuthenticationLoginFailed = 'Remote:Authentication:LoginFailed',
  AuthenticationRegistrationFailed = 'Remote:Authentication:RegistrationFailed'
};