import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
})
export class RadioComponent implements AfterViewInit{

  @ViewChild('radio', { static: true})
  radio!: ElementRef<HTMLDivElement>

  @Input()
  text: string = '';

  @Input()
  name: string = ''

  @Input()
  checked: boolean = false

  @Input()
  unchecked: boolean = false

  @Input()
  value: any

  @Output()
  checkOption = new EventEmitter<any>()

  constructor(private radioService: RadioService){}

  ngAfterViewInit(): void {
    /*if(this.checked){
      this.setChecked()
    }*/
  }

  toggleActive(){
    if(this.unchecked){
      if(this.isChecked()){
        this.removeChecked()
        this.radioService.emitRadioChange(this)
      } else {
        this.setChecked()
      }
    } else {
      this.setChecked()
    }
  }

  setChecked(){
    let radioElement = this.radio.nativeElement

    if(radioElement.getAttribute('checked') === null){
      radioElement.setAttribute('Checked', '')
      this.checkOption.emit(this.value)
      this.radioService.emitRadioChange(this)
    }
  }

  removeChecked(){
    let radioElement = this.radio.nativeElement

    if(radioElement.getAttribute('checked') !== null){
      radioElement.removeAttribute('Checked')
      this.checked = false
    }
  }

  isChecked(){
    return this.radio.nativeElement.getAttribute('checked') !== null
  }

  sendOption(){
    this.checkOption.emit(this.value)
  }
}

@Injectable({
  providedIn : 'root'
})
export class RadioService {

  radioChange: EventEmitter<any> = new EventEmitter<any>();

  emitRadioChange(event: any) {
    this.radioChange.emit(event);
  }
}
