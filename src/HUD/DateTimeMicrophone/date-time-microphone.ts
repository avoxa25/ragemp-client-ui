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

  public ToggleMicrophone(buttonPressed: boolean){
    if(buttonPressed){
      this.microphoneElement.setAttribute('src', './assets/micro-active.svg');
    }else{      
      this.microphoneElement.setAttribute('src', './assets/micro-non-active.svg');
    }
  }

  private SetCurrentDate() {
    const day = ((this.dateTimeNow.getDate() < 10) ? "0" : "") + this.dateTimeNow.getDate();
    const month = ((this.dateTimeNow.getMonth() < 10) ? "0" : "") + (this.dateTimeNow.getMonth()  + 1);
    const year = this.dateTimeNow.getFullYear();
    
    this.dateElement.innerText = `${day}.${month}.${year}`;
  }

  private SetCurrentTime() {
    const hours = ((this.dateTimeNow.getHours() < 10) ? "0" : "") + this.dateTimeNow.getHours();
    const minutes = ((this.dateTimeNow.getMinutes() < 10) ? "0" : "") + (this.dateTimeNow.getMinutes()  + 1);
    
    this.timeElement.innerText = `${hours}:${minutes}`;
  }
}

const dateTimeMicrophoneUi = new DateTimeMicrophoneUi();
(window as any).dateTimeMicrophoneUi = dateTimeMicrophoneUi;