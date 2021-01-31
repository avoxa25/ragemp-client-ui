class DateTimeMicrophoneUi {
  private readonly dateElement: HTMLElement;
  private readonly timeElement: HTMLElement;
  private readonly microphoneElement: HTMLElement;

  public constructor() {
    this.dateElement = document.querySelector('#date') as HTMLElement;
    this.timeElement = document.querySelector('#time') as HTMLElement;
    this.microphoneElement = document.querySelector('#micro') as HTMLElement;
  }

  public ToggleMicrophone(buttonPressed: boolean): void {
    if (buttonPressed) this.microphoneElement.setAttribute('src', './assets/micro-active.svg');
    else this.microphoneElement.setAttribute('src', './assets/micro-non-active.svg');
  }

  public SetDateTime(rawDateTime: string): void {
    const dateTime = new Date(rawDateTime);

    const formattedDate = dateTime.toLocaleDateString('ru-RU');
    this.dateElement.innerText = formattedDate;

    const timeOptions = { hour: '2-digit', minute: '2-digit' }
    const formattedTime = dateTime.toLocaleTimeString('ru-RU', timeOptions);
    this.timeElement.innerText = formattedTime;
  }
}

const dateTimeMicrophoneUi = new DateTimeMicrophoneUi();
(window as any).dateTimeMicrophoneUi = dateTimeMicrophoneUi;