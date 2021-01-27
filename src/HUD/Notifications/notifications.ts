class NotificationsUi {
  public ShowNotification(notifyType: string, text: string): void {
    const notifyBlock = document.getElementById(`${notifyType}`) as HTMLElement;
    const notifyText = document.getElementById(`${notifyType}Text`) as HTMLElement;

    notifyText.innerHTML = text;
    notifyBlock.style.display = 'block';
    setTimeout(() => notifyBlock.style.display = 'none', 4000);
  }
}

const notificationsUi = new NotificationsUi();
(window as any).notificationsUi = notificationsUi;