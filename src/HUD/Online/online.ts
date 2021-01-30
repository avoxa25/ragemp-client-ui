class OnlineUi{
  private currentOnlineElement: HTMLElement;

  public constructor(){
    this.currentOnlineElement = document.querySelector('#currentOnline') as HTMLElement;
  }

  private SetCurrentOnline(currentOnline: string){
    this.currentOnlineElement.innerText = currentOnline;
  }
}

const onlineUi = new OnlineUi();
(window as any).onlineUi = onlineUi;