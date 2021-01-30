class DateTimeMicrophoneUi {
  private dateElement: HTMLElement;
  private timeElement: HTMLElement;
  private microphoneElement: HTMLElement;
  private dateTimeNow: Date;

  public constructor() {
    this.dateElement = document.querySelector('#date') as HTMLElement;
    this.timeElement = document.querySelector('#time') as HTMLElement;
    this.microphoneElement = document.querySelector('#micro') as HTMLElement;

    this.dateTimeNow = new Date();

    setInterval(() => {
      this.SetCurrentDate();
      this.SetCurrentTime();
    }, 1000);
  }

  public ToggleMicrophone(buttonPressed: boolean): void {
    if (buttonPressed) this.microphoneElement.setAttribute('src', './assets/micro-active.svg');
    else this.microphoneElement.setAttribute('src', './assets/micro-non-active.svg');
  }

  private SetCurrentDate(): void {
    this.dateElement.innerText = this.dateTimeNow.toLocaleDateString('ru-RU');
  }

  private SetCurrentTime(): void {
    const timeOptions = {hour: '2-digit', minute: '2-digit'}
    this.timeElement.innerText = this.dateTimeNow.toLocaleTimeString('ru-RU', timeOptions);
  }
}

const dateTimeMicrophoneUi = new DateTimeMicrophoneUi();
(window as any).dateTimeMicrophoneUi = dateTimeMicrophoneUi;