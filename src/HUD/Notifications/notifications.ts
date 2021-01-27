class NotificationsUi {
  public ShowNotification(type: string, text: string): void {
    const notifyBlock = document.getElementById(`${type}`) as HTMLElement;
    const notifyText = document.getElementById(`${type}Text`) as HTMLElement;

    notifyText.innerHTML = text;
    notifyBlock.style.display = 'block';
    setTimeout(() => notifyBlock.style.display = 'none', 4000);
  }
}

const notificationsUi = new NotificationsUi();
(window as any).notificationsUi = notificationsUi;